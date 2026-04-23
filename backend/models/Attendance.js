const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
  courseCode: { type: String, required: true },
  attended: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  Monday: { type: Number, default: 0 },
  Tuesday: { type: Number, default: 0 },
  Wednesday: { type: Number, default: 0 },
  Thursday: { type: Number, default: 0 },
  Friday: { type: Number, default: 0 },
  lastMarkedDate: { type: String, default: "" },
  lastMarkedStatus: { type: String, enum: ["present", "absent", ""], default: "" }
});

module.exports = mongoose.model('Attendance', attendanceSchema);
