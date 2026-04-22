const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  courseCode: { type: String, required: true },
  attended: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  Monday: { type: Number, default: 0 },
  Tuesday: { type: Number, default: 0 },
  Wednesday: { type: Number, default: 0 },
  Thursday: { type: Number, default: 0 },
  Friday: { type: Number, default: 0 }
});

module.exports = mongoose.model('Attendance', attendanceSchema);
