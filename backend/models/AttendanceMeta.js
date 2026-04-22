const mongoose = require('mongoose');

const attendanceMetaSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  lastResetTimestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AttendanceMeta', attendanceMetaSchema);
