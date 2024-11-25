const express = require('express');
const mongoose = require('mongoose');
//const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth'); // Import authentication routes
const taskRoutes = require('./routes/tasks'); // Import task routes
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
//app.use(cors()); // Enable CORS
//app.use(bodyParser.json()); // Parse JSON bodies
app.use(cors({ origin: "*" }));

app.use(express.json());

// let users = [
//     { id: 1, name: "Aliyu" },
//     { id: 2, name: "Aliya" }
// ]

// Connect to MongoDB
// You can use connection string like this :
// mongosh "mongodb://user:pwd@localhost:27017/mybase" --authenticationDatabase admin
// This will connect directly to your database (mybase) , and your user, pwd will be checked on admin db

// mongoose.connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
//     .then(() => console.log('MongoDB connected'))
//     .catch(err => console.error('MongoDB connection error:', err));

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/tasks', taskRoutes); // Task management routes

// Serve static files for frontend
app.use(express.static('public')); // Adjust the path as necessary

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});