const Task = require('../models/Task'); // Task model

// Create Task
exports.createTask = async (req, res) => {
    const { title, description, deadline, priority } = req.body;
    const task = new Task({
        title,
        description,
        deadline,
        priority,
        userId: req.user.id // Associate task with user
    });

    try {
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ error: 'Task creation failed' });
    }
};

// Get All Tasks
// exports.getAllTasks = async (req, res) => {
//     try {
//         const tasks = await Task.find({ userId: req.user.id });
//         res.json(tasks);
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to retrieve tasks' });
//     }
// };

exports.getAllTasks = async (req, res) => {
    const { priority, deadline } = req.query; // Extract filters from query

    // Build a filter object
    let filter = { userId: req.user.id }; // Ensure only the user's tasks are fetched

    if (priority) {
        filter.priority = priority; // Add priority filter if provided
    }

    if (deadline) {
        // Check if the deadline is a valid date and convert to ISO format
        const date = new Date(deadline);
        if (!isNaN(date.getTime())) {
            //filter.deadline = { $lte: date }; // Filter tasks with a deadline less than or equal to the specified date

            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0); // Start of the day
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999); // End of the day

            filter.deadline = { $gte: startOfDay, $lte: endOfDay }; // For tasks within the whole day

            //filter.deadline = { $lte: endOfDay }; // For tasks on or before the end of the specified date
        }
    }

    try {
        const tasks = await Task.find(filter); // Fetch tasks with the filter
        res.json(tasks); // Send the tasks as a response
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Task by ID
exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve task' });
    }
};

// Update Task
exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            req.body,
            { new: true }
        );

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        res.status(400).json({ error: 'Task update failed' });
    }
};

// Delete Task
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Task deletion failed' });
    }
};

// Filter Tasks
exports.filterTasks = async (req, res) => {
    const { priority, dueDate } = req.query;
    const filters = { userId: req.user.id };

    if (priority) filters.priority = priority;
    if (dueDate) filters.deadline = { $lte: new Date(dueDate) };

    try {
        const tasks = await Task.find(filters);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to filter tasks' });
    }
};

// Search Tasks
exports.searchTasks = async (req, res) => {
    const { q } = req.query;

    try {
        const tasks = await Task.find({
            userId: req.user.id,
            $or: [
                { title: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } }
            ]
        });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Search failed' });
    }
};