const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');

let token; // To store the JWT token after login
let userId; // To store the user ID

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log('MongoDB connected'))
        .catch(err => console.error('MongoDB connection error:', err));

    // Create a test user and log in to get a token
    const userResponse = await request(app)
        .post('/api/auth/register')
        .send({
            username: `testUser_${Date.now()}`, // Unique username
            password: 'password123'
        });

    expect(userResponse.status).toBe(201);
    userId = userResponse.body.user._id;

    const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
            username: userResponse.body.user.username,
            password: 'password123'
        });

    token = loginResponse.body.token; // Store the token for use in tests
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});

describe('Task Creation', () => {
    it('should create a new task', async () => {
        const response = await request(app)
            .post('/api/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Test Task',
                description: 'This is a test task.',
                deadline: new Date().toISOString(),
                priority: 'medium',
                id: userId // Associate task with the user
            });

        console.log(response.body);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Task added successfully!');
        expect(response.body.task).toHaveProperty('title', 'Test Task');
    });

    it('should not create a task without title', async () => {
        const response = await request(app)
            .post('/api/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send({
                description: 'This is a test task without a title.',
                deadline: new Date().toISOString(),
                priority: 'medium',
                id: userId
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
    });
});