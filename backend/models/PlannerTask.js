const mongoose = require('mongoose');

const plannerTaskSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  dueDate: { type: Date, required: true },
  isCompleted: { type: Boolean, default: false },
  isSmartReminder: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('PlannerTask', plannerTaskSchema);
