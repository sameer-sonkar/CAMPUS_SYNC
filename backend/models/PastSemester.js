const mongoose = require('mongoose');

const pastSemesterSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
  semester: { type: Number, required: true },
  spi: { type: Number, default: 8.0 },
  cpi: { type: Number, default: 8.0 },
  credit: { type: Number, default: 21 },
  lockedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PastSemester', pastSemesterSchema);
