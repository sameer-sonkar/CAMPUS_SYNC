const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const { Student } = require('./models');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('✅ Connected to MongoDB Atlas');
  
  // Seed Admin User
  try {
    const adminEmail = 'sksonkar850@gmail.com';
    const existingAdmin = await Student.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('labibamenal123@', salt);
      const newAdmin = new Student({
        uid: crypto.randomUUID(),
        email: adminEmail,
        fullName: 'System Admin',
        password: hashedPassword,
        isVerified: true,
        role: 'admin'
      });
      await newAdmin.save();
      console.log('✅ Admin user created automatically');
    } else if (existingAdmin.role !== 'admin') {
      existingAdmin.role = 'admin';
      await existingAdmin.save();
      console.log('✅ Existing user upgraded to Admin');
    }
  } catch (error) {
    console.error('❌ Failed to seed admin:', error);
  }
})
.catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const reminderRoutes = require('./routes/reminderRoutes');
const plannerRoutes = require('./routes/plannerRoutes');
const { verifyToken } = require('./middleware/authMiddleware');

app.use('/api/auth', authRoutes);
app.use('/api/students', verifyToken, studentRoutes);
app.use('/api/reminders', verifyToken, reminderRoutes);
app.use('/api/planner', verifyToken, plannerRoutes);

// Basic Health Check Route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running!' });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
