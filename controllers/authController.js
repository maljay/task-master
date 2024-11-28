const User = require('../models/User'); // User model
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// User Registration
exports.register = async (req, res) => {
    const { username, password } = req.body;


    try {
        const existingUser = await User.findOne({ username: req.body.username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists!' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });

        await user.save();

        user.username = "";
        user.password = "";
        res.status(201).json({ message: 'User registered successfully!', user });
    } catch (error) {
        console.error('Error during registration: ', error);
        res.status(500).json({ error: error.message });
    }
};

// User Login
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
};

// Get Current User
exports.getCurrentUser = (req, res) => {
    res.json(req.user);
};