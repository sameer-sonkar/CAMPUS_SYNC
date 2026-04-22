const mongoose = require('mongoose');

const adminReminderSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  priority: { type: String, default: 'low' },
  pushedBy: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AdminReminder', adminReminderSchema);
