const express = require('express');
const router = express.Router();
const { SmartReminder, LibraryBook, PlannerTask } = require('../models');

// GET Smart Reminders
router.get('/:id', async (req, res) => {
  try {
    const reminders = await SmartReminder.find({ userId: req.params.id }).sort({ createdAt: -1 });
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// TOGGLE Smart Reminder Read Status
router.put('/:id/:reminderId/read', async (req, res) => {
  try {
    const { isRead } = req.body;
    const reminder = await SmartReminder.findOneAndUpdate(
      { userId: req.params.id, _id: req.params.reminderId },
      { isRead },
      { new: true }
    );
    res.json(reminder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE Smart Reminder
router.delete('/:id/:reminderId', async (req, res) => {
  try {
    await SmartReminder.findOneAndDelete({ userId: req.params.id, _id: req.params.reminderId });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET Library Books
router.get('/:id/library', async (req, res) => {
  try {
    const books = await LibraryBook.find({ userId: req.params.id, isDeleted: false }).sort({ dueDate: 1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ADD Library Book
router.post('/:id/library', async (req, res) => {
  try {
    const { title, dueDate } = req.body;
    
    const newBook = new LibraryBook({
      userId: req.params.id,
      title,
      dueDate: new Date(dueDate)
    });
    await newBook.save();

    // Create a matching Smart Reminder
    const newReminder = new SmartReminder({
      userId: req.params.id,
      source: 'library',
      title: `Return "${title}"`,
      dateTime: new Date(dueDate),
      originalId: `lib_${newBook._id}`
    });
    await newReminder.save();

    res.json(newBook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// DELETE Library Book
router.delete('/:id/library/:bookId', async (req, res) => {
  try {
    await LibraryBook.findByIdAndUpdate(req.params.bookId, { isDeleted: true });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/:id/planner-active', async (req, res) => {
  try {
    const tasks = await PlannerTask.find({ 
      userId: req.params.id, 
      isSmartReminder: true, 
      isCompleted: false 
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET Admin Reminders
router.get('/admin', async (req, res) => {
  try {
    const { AdminReminder } = require('../models');
    const reminders = await AdminReminder.find().sort({ createdAt: -1 }).limit(20);
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET Admin State for User
router.get('/admin/state/:id', async (req, res) => {
  try {
    const { AdminState } = require('../models');
    let state = await AdminState.findOne({ userId: req.params.id });
    if (!state) {
      state = new AdminState({ userId: req.params.id, read_ids: [], dismissed_ids: [] });
      await state.save();
    }
    res.json(state);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT Admin State (Toggle Read/Dismiss)
router.put('/admin/state/:id', async (req, res) => {
  try {
    const { action, id } = req.body; // action: 'read', 'unread', 'dismiss'
    const { AdminState } = require('../models');
    let update = {};

    if (action === 'read') update = { $addToSet: { read_ids: id } };
    else if (action === 'unread') update = { $pull: { read_ids: id } };
    else if (action === 'dismiss') update = { $addToSet: { dismissed_ids: id } };

    const state = await AdminState.findOneAndUpdate(
      { userId: req.params.id },
      update,
      { new: true, upsert: true }
    );
    res.json(state);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST Admin Reminder
router.post('/admin', async (req, res) => {
  try {
    const { AdminReminder } = require('../models');
    const { title, description, priority, pushedBy } = req.body;
    const reminder = new AdminReminder({
      title,
      description,
      priority,
      pushedBy,
      createdAt: new Date(),
      isRead: false
    });
    await reminder.save();
    res.json(reminder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE Admin Reminder
router.delete('/admin/:id', async (req, res) => {
  try {
    const { AdminReminder } = require('../models');
    await AdminReminder.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

