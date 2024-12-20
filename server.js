const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth'); // Import authentication routes
const taskRoutes = require('./routes/tasks'); // Import task routes
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors()); // Enable CORS
//app.use(cors({ origin: "*" }));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/tasks', taskRoutes); // Task management routes

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Serve static files for frontend
app.use(express.static(path.join(__dirname, 'public')));

// Set the views directory
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/', (req, res) => {
    res.render('index', { title: 'TaskMaster' });
});

app.get('/login', (req, res) => {
    res.render('login', { title: 'TaskMaster' });
});

app.get('/registration', (req, res) => {
    res.render('registration', { title: 'TaskMaster' });
});

// Export the app for testing
module.exports = app;

// Start server only if this file is run directly
if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

// Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });