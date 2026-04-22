const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  fileData: { type: String, required: true }, // Base64 representation of the file
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserDocument', documentSchema);
