const express = require('express');
const Task = require('../model/taskModel')
const { taskValidation } = require('../joiValidation/validation');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Create a new task
router.post('/create', authMiddleware, async (req, res) => {
  const { error } = taskValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const task = new Task({
    title: req.body.title,
    description: req.body.description,
    status: req.body.status,
    dueDate: req.body.dueDate,
    user: req.user._id,
  });

  try {
    const savedTask = await task.save();
    res.send(savedTask);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Get all tasks for authenticated user
router.get('/alltasks', authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });
    res.send(tasks);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Update task
router.put('/update/:id', authMiddleware, async (req, res) => {
  const { error } = taskValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!updatedTask) return res.status(404).send('Task not found');
    res.send(updatedTask);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Delete task
router.delete('/delete/:id', authMiddleware, async (req, res) => {
  try {
    const removedTask = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!removedTask) return res.status(404).send('Task not found');
    res.send(removedTask);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
