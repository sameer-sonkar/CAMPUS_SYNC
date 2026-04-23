const mongoose = require('mongoose');

const libraryBookSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
  title: { type: String, required: true },
  dueDate: { type: Date, required: true },
  isNotified: { type: Boolean, default: false },
  isRead: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('LibraryBook', libraryBookSchema);
