const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({

  email: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  verificationCode: { type: String },
  verificationCodeExpires: { type: Date },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  program: { type: String },
  rollNo: { type: String },
  branch: { type: String },
  currentSemester: { type: Number, default: 1 },
  profilePic: { type: String },
  lastSemRollDate: { type: Date },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  
  leetcodeUsername: { type: String, default: '' },
  leetcodeStreak: { type: Number, default: 0 },
  lastLeetcodeSolveDate: { type: Date },
  
  codeforcesUsername: { type: String, default: '' },
  codeforcesRating: { type: Number, default: 800 },
  codeforcesStreak: { type: Number, default: 0 },
  lastCodeforcesSolveDate: { type: Date },

  atcoderUsername: { type: String, default: '' },
  atcoderRating: { type: Number, default: 0 },
  atcoderStreak: { type: Number, default: 0 },
  lastAtcoderSolveDate: { type: Date },

  codechefUsername: { type: String, default: '' },
  codechefRating: { type: Number, default: 0 },
  codechefStreak: { type: Number, default: 0 },
  lastCodechefSolveDate: { type: Date },

  // Planner Preferences
  workingHours: {
    start: { type: String, default: '08:00' },
    end: { type: String, default: '22:00' }
  },
  
  // Focus Stats embedded
  focusStats: {
    todayMinutes: { type: Number, default: 0 },
    weekMinutes: { type: Number, default: 0 },
    monthMinutes: { type: Number, default: 0 },
    dailyLog: { type: Map, of: Number, default: {} },
    updatedAt: { type: Date, default: Date.now }
  },

  // Meta embedded
  meta: {
    admin_prefs: { type: Map, of: Boolean, default: {} }
  },

  // Images embedded
  images: { type: Map, of: String, default: {} }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
