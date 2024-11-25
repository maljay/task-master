const express = require('express');
const router = express.Router();
const { createTask, getAllTasks, getTaskById, updateTask, deleteTask, filterTasks, searchTasks } = require('../controllers/taskController');
const { authenticate } = require('../middleware/authMiddleware');

// Task Management Routes
//router.post('/tasks', authenticate, createTask);
router.post('/', authenticate, createTask);
//router.get('/tasks', authenticate, getAllTasks);
router.get('/', authenticate, getAllTasks);
router.get('/tasks/:id', authenticate, getTaskById);
//router.put('/tasks/:id', authenticate, updateTask);
router.put('/:id', authenticate, updateTask);
//router.delete('/tasks/:id', authenticate, deleteTask);
router.delete('/:id', authenticate, deleteTask);
//router.get('/tasks/filter', authenticate, filterTasks);
router.get('/filter', authenticate, filterTasks);
//router.get('/tasks/search', authenticate, searchTasks);
router.get('/search', authenticate, searchTasks);

module.exports = router;