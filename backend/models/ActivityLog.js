const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  action: { type: String, enum: ['task_completed', 'focus_session'], required: true },
  category: { type: String, default: 'General' }, // Subject or task category
  duration: { type: Number, default: 0 }, // in minutes
  timestamp: { type: Date, default: Date.now, index: true }
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);
