const mongoose = require('mongoose');

// The day arrays store objects representing classes.
// Updated Schema Structure for classes:
// {
//   time: "09:00 - 10:00",
//   code: "CS101",
//   subject: "Intro to Programming", // (or 'name')
//   teacher: "Dr. Smith",
//   room: "Room 304",
//   notes: "Bring laptop"
// }

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
