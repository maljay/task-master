const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');

const uniqueUsername = `testUser_${Date.now()}`; // Generate a unique username

beforeAll(async () => {
    // Connect to the test database
    await mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log('MongoDB connected'))
        .catch(err => console.error('MongoDB connection error:', err));
});

afterAll(async () => {
    // Clean up and close the database connection
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});

describe('User Authentication', () => {
    it('should register a new user', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                username: uniqueUsername,
                password: 'password123'
            });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('User registered successfully!');
    });

    it('should not allow registration with an existing username', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                username: uniqueUsername, // Use the same username
                password: 'password456'
            });

        expect(response.status).toBe(400); // Expecting a bad request status
        expect(response.body.error).toBe('Username already exists!');
    });

    it('should log in the user', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                username: uniqueUsername,
                password: 'password123'
            });

        expect(response.status).toBe(200);
        expect(response.body.token).toBeDefined(); // Ensure a token is returned
    });

    it('should not log in with incorrect password', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                username: 'testUser',
                password: 'wrongPassword'
            });

        expect(response.status).toBe(401);
        expect(response.body.error).toBe('Invalid credentials');
    });
});