const mongoose = require('mongoose');

const smartReminderSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  source: { type: String, enum: ['planner', 'library'], required: true },
  title: { type: String, required: true },
  dateTime: { type: Date, required: true },
  description: { type: String, default: '' },
  isRead: { type: Boolean, default: false },
  originalId: { type: String } // e.g. 'lib_{bookId}' or planner task id
}, { timestamps: true });

module.exports = mongoose.model('SmartReminder', smartReminderSchema);
