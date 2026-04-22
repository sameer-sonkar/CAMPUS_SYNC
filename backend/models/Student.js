const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true }, // Custom UUID
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  verificationCode: { type: String },
  verificationCodeExpires: { type: Date },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  rollNo: { type: String },
  branch: { type: String },
  currentSemester: { type: Number, default: 1 },
  lastSemRollDate: { type: Date },
  
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
