const mongoose = require('mongoose');

const dsaSubmissionSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  link: { type: String, default: '' },
  platform: { type: String, enum: ['LeetCode', 'Codeforces', 'AtCoder', 'CodeChef', 'GeeksforGeeks', 'Other'], default: 'Other' },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  topic: { type: String, required: true }, // Arrays, DP, Graph, etc.
  notes: { type: String, default: '' },
  solvedAt: { type: Date, default: Date.now, index: true }
});

module.exports = mongoose.model('DSASubmission', dsaSubmissionSchema);
