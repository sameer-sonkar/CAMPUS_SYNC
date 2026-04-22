const mongoose = require('mongoose');

const semCreditSchema = new mongoose.Schema({
  branch: { type: String, required: true, unique: true },
  credits: { type: Map, of: Number }
});

module.exports = mongoose.model('SemCredit', semCreditSchema);
