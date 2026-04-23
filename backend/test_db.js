require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
    
    const { Student } = require('./models');
    const student = await Student.findOne();
    console.log('Student found:', student ? 'yes' : 'no');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

testConnection();
