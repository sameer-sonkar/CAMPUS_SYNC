const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
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
