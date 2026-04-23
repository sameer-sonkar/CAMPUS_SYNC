const mongoose = require('mongoose');

const plannerTaskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  dueDate: { type: Date, required: true },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  estimatedTime: { type: Number, default: 1 }, // in hours
  scheduledStart: { type: Date },
  scheduledEnd: { type: Date },
  isCompleted: { type: Boolean, default: false },
  status: { type: String, enum: ['todo', 'in-progress', 'completed'], default: 'todo' },
  isSmartReminder: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('PlannerTask', plannerTaskSchema);
