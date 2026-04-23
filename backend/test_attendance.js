require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const mongoose = require('mongoose');

async function testConnection() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
    
    const { Student, Timetable, Attendance } = require('./models');
    const student = await Student.findOne();
    if (!student) {
      console.log('No student found');
      process.exit(0);
    }
    console.log('Student found:', student.uid, student.branch, student.rollNo);
    
    let docId = 'DUMMY';
    if (student.branch && student.rollNo) {
      const startYear = student.rollNo.length >= 2 ? 2000 + parseInt(student.rollNo.substring(0, 2)) : 2024;
      docId = `${student.branch}_${startYear}-${startYear + 4}`;
    }
    console.log('Derived docId:', docId);

    const timetable = await Timetable.findOne({ docId });
    console.log('Timetable found:', timetable ? 'yes' : 'no');
    
    if (timetable) {
      console.log('Monday classes:', timetable.Monday);
    } else {
      const allTts = await Timetable.find({});
      console.log('Available timetables:', allTts.map(t => t.docId));
    }

    const attendanceRecords = await Attendance.find({ userId: student.uid });
    console.log('Attendance records:', attendanceRecords.length);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

testConnection();
