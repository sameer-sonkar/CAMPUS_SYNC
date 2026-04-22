const express = require('express');
const router = express.Router();
const { PlannerTask, SmartReminder } = require('../models');

// GET all tasks for a user
router.get('/:uid', async (req, res) => {
  try {
    const tasks = await PlannerTask.find({ userId: req.params.uid }).sort({ dueDate: 1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ADD a new task
router.post('/:uid', async (req, res) => {
  try {
    const taskData = req.body;
    taskData.userId = req.params.uid;
    const newTask = new PlannerTask(taskData);
    await newTask.save();

    // Mirror to SmartReminder if requested
    if (newTask.isSmartReminder) {
      const reminder = new SmartReminder({
        userId: req.params.uid,
        source: 'planner',
        title: newTask.title,
        description: newTask.description,
        dateTime: newTask.dateTime,
        originalId: newTask._id.toString()
      });
      await reminder.save();
    }

    res.json(newTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE a task
router.put('/:uid/:taskId', async (req, res) => {
  try {
    const task = await PlannerTask.findOneAndUpdate(
      { _id: req.params.taskId, userId: req.params.uid },
      req.body,
      { new: true }
    );

    if (task.isSmartReminder) {
      if (task.isCompleted) {
        await SmartReminder.findOneAndUpdate(
          { originalId: task._id.toString(), userId: req.params.uid },
          { isRead: true }
        );
      } else {
        await SmartReminder.findOneAndUpdate(
          { originalId: task._id.toString(), userId: req.params.uid },
          { 
            title: task.title, 
            description: task.description, 
            dateTime: task.dateTime 
          },
          { upsert: true }
        );
      }
    } else {
      await SmartReminder.findOneAndDelete({ originalId: task._id.toString(), userId: req.params.uid });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE a task
router.delete('/:uid/:taskId', async (req, res) => {
  try {
    await PlannerTask.findOneAndDelete({ _id: req.params.taskId, userId: req.params.uid });
    await SmartReminder.findOneAndDelete({ originalId: req.params.taskId, userId: req.params.uid });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
