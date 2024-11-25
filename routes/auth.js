const express = require('express');
const router = express.Router();
const { register, login, getCurrentUser } = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');

// Authentication Routes
//router.post('/auth/register', register);
router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, getCurrentUser);

module.exports = router;