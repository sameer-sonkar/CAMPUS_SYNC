const mongoose = require('mongoose');

const courseGradeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
  courseId: { type: String, required: true },
  theory: { type: Array, default: [] },
  lab: { type: Array, default: [] },
  theory_weight: { type: Number, default: 70 },
  lab_weight: { type: Number, default: 30 }
}, { strict: false }); // Allow other fields like in Firebase

module.exports = mongoose.model('CourseGrade', courseGradeSchema);
