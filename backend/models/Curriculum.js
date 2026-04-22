const mongoose = require('mongoose');

const curriculumSchema = new mongoose.Schema({
  docId: { type: String, required: true, unique: true },
  courses: { type: Array, default: [] }
});

module.exports = mongoose.model('Curriculum', curriculumSchema);
