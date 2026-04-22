const mongoose = require('mongoose');

const adminStateSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  read_ids: { type: [String], default: [] },
  dismissed_ids: { type: [String], default: [] }
});

module.exports = mongoose.model('AdminState', adminStateSchema);
