const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  docId: { type: String, required: true, unique: true }, // e.g. CSE_2020-2024
  Monday: { type: Array, default: [] },
  Tuesday: { type: Array, default: [] },
  Wednesday: { type: Array, default: [] },
  Thursday: { type: Array, default: [] },
  Friday: { type: Array, default: [] },
  Saturday: { type: Array, default: [] },
  Sunday: { type: Array, default: [] }
}, { strict: false }); // strict false to allow dynamic days

module.exports = mongoose.model('Timetable', timetableSchema);
