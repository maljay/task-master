const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = 'your_jwt_secret'; // Replace with your own secret

exports.authenticate = async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied' });
    }

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = await User.findById(verified.id).select('-password'); // Do not return the password
        next();
    } catch (error) {
        res.status(400).json({ error: 'Invalid token' });
    }
};