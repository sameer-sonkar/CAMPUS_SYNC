const express = require('express');
const router = express.Router();
const { Student, PastSemester } = require('../models');

// GET Student Data
router.get('/:uid', async (req, res) => {
  try {
    const student = await Student.findOne({ uid: req.params.uid });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE Student Data
router.put('/:uid', async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate(
      { uid: req.params.uid },
      { ...req.body, updatedAt: new Date() },
      { new: true, upsert: true }
    );
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET Past Semesters
router.get('/:uid/pastSemesters', async (req, res) => {
  try {
    const sems = await PastSemester.find({ userId: req.params.uid }).sort({ semester: 1 });
    res.json(sems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ADD (Archive) Past Semester
router.post('/:uid/pastSemesters', async (req, res) => {
  try {
    const { semester, spi, cpi, credit } = req.body;
    
    // Check if already archived
    const existing = await PastSemester.findOne({ userId: req.params.uid, semester });
    if (existing) {
      return res.status(400).json({ error: 'Semester already archived' });
    }

    const newSem = new PastSemester({
      userId: req.params.uid,
      semester, spi, cpi, credit
    });
    await newSem.save();
    
    res.json(newSem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// SAVE Focus Session
router.post('/:uid/focus', async (req, res) => {
  try {
    const { minutes } = req.body;
    if (minutes <= 0) return res.status(400).json({ error: 'Invalid minutes' });

    const student = await Student.findOne({ uid: req.params.uid });
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const now = new Date();
    const dateKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    student.focusStats.todayMinutes += minutes;
    student.focusStats.weekMinutes += minutes;
    student.focusStats.monthMinutes += minutes;
    student.focusStats.updatedAt = new Date();

    if (!student.focusStats.dailyLog) {
      student.focusStats.dailyLog = new Map();
    }
    
    const currentDaily = student.focusStats.dailyLog.get(dateKey) || 0;
    student.focusStats.dailyLog.set(dateKey, currentDaily + minutes);

    await student.save();
    res.json(student.focusStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET Attendance
router.get('/:uid/attendance', async (req, res) => {
  try {
    const { Attendance } = require('../models');
    const records = await Attendance.find({ userId: req.params.uid });
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET Timetable (by docId like CSE_2020-2024)
router.get('/timetable/:docId', async (req, res) => {
  try {
    const { Timetable } = require('../models');
    const tt = await Timetable.findOne({ docId: req.params.docId });
    if (!tt) return res.status(404).json({ error: 'Timetable not found' });
    res.json(tt);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET Curriculum (by docId like CSE_Sem1)
router.get('/curriculum/:docId', async (req, res) => {
  try {
    const { Curriculum } = require('../models');
    const curr = await Curriculum.findOne({ docId: req.params.docId });
    if (!curr) return res.status(404).json({ error: 'Curriculum not found' });
    res.json(curr);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET Attendance Meta
router.get('/:uid/attendanceMeta', async (req, res) => {
  try {
    const { AttendanceMeta } = require('../models');
    let meta = await AttendanceMeta.findOne({ userId: req.params.uid });
    if (!meta) {
      meta = new AttendanceMeta({ userId: req.params.uid, lastResetTimestamp: new Date(0) });
      await meta.save();
    }
    res.json(meta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT Attendance Meta
router.put('/:uid/attendanceMeta', async (req, res) => {
  try {
    const { AttendanceMeta } = require('../models');
    const meta = await AttendanceMeta.findOneAndUpdate(
      { userId: req.params.uid },
      { lastResetTimestamp: new Date() },
      { new: true, upsert: true }
    );
    res.json(meta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT Attendance (Single Course)
router.put('/:uid/attendance/:courseCode', async (req, res) => {
  try {
    const { Attendance } = require('../models');
    const attendance = await Attendance.findOneAndUpdate(
      { userId: req.params.uid, courseCode: req.params.courseCode },
      req.body,
      { new: true, upsert: true }
    );
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST Bulk Update Attendance (For weekly resets / initial skeletons)
router.post('/:uid/attendance/bulk', async (req, res) => {
  try {
    const { Attendance } = require('../models');
    const records = req.body; // Array of objects
    const updates = records.map(record => ({
      updateOne: {
        filter: { userId: req.params.uid, courseCode: record.courseCode },
        update: record,
        upsert: true
      }
    }));
    await Attendance.bulkWrite(updates);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET Sem Credits
router.get('/sem_credits/:branch', async (req, res) => {
  try {
    const { SemCredit } = require('../models');
    const credits = await SemCredit.findOne({ branch: req.params.branch.toUpperCase() });
    res.json(credits ? credits.credits : {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET Course Grades
router.get('/:uid/course_grades', async (req, res) => {
  try {
    const { CourseGrade } = require('../models');
    const grades = await CourseGrade.find({ userId: req.params.uid });
    res.json(grades);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT Course Grade
router.put('/:uid/course_grades/:courseId', async (req, res) => {
  try {
    const { CourseGrade } = require('../models');
    const grade = await CourseGrade.findOneAndUpdate(
      { userId: req.params.uid, courseId: req.params.courseId },
      req.body,
      { new: true, upsert: true }
    );
    res.json(grade);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT Past Semester (Update SPI)
router.put('/:uid/pastSemesters/:semester', async (req, res) => {
  try {
    const { PastSemester } = require('../models');
    const sem = await PastSemester.findOneAndUpdate(
      { userId: req.params.uid, semester: req.params.semester },
      req.body,
      { new: true }
    );
    res.json(sem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST Roll Semester
router.post('/:uid/roll_semester', async (req, res) => {
  try {
    const { Student, PastSemester } = require('../models');
    const { currentSem, spiForCurrentSem, cpiForCurrentSem, creditForCurrentSem } = req.body;
    
    const student = await Student.findOne({ uid: req.params.uid });
    if (!student) return res.status(404).json({ error: 'Student not found' });

    // Validate rollover logic
    const rollNo = student.rollNo || '';
    const startYear = rollNo.length >= 2 ? 2000 + parseInt(rollNo.substring(0, 2)) : 2024;
    
    let boundaryYear = startYear + Math.floor((currentSem - 1) / 2);
    let boundaryMonth = currentSem % 2 !== 0 ? 1 : 6;
    if (currentSem % 2 !== 0) boundaryYear += 1;
    
    const boundary = new Date(boundaryYear, boundaryMonth - 1, 1);
    const now = new Date();

    if (now < boundary) {
      return res.json({ newSemester: currentSem });
    }

    const lastRoll = student.lastSemRollDate ? new Date(student.lastSemRollDate) : null;
    if (lastRoll && lastRoll >= boundary) {
      return res.json({ newSemester: currentSem });
    }

    // Archive semester
    const existing = await PastSemester.findOne({ userId: req.params.uid, semester: currentSem });
    if (!existing) {
      const newSem = new PastSemester({
        userId: req.params.uid,
        semester: currentSem,
        spi: spiForCurrentSem,
        cpi: cpiForCurrentSem,
        credit: creditForCurrentSem,
        lockedAt: new Date()
      });
      await newSem.save();
    }

    // Update student
    student.currentSemester = currentSem + 1;
    student.lastSemRollDate = new Date();
    await student.save();

    res.json({ newSemester: currentSem + 1 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT Student Image
router.put('/:uid/images/:slot', async (req, res) => {
  try {
    const { Student } = require('../models');
    const updateQuery = {};
    updateQuery[`images.${req.params.slot}`] = req.body.url;
    
    const student = await Student.findOneAndUpdate(
      { uid: req.params.uid },
      { $set: updateQuery },
      { new: true, upsert: true }
    );
    res.json(student.images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE Student Image
router.delete('/:uid/images/:slot', async (req, res) => {
  try {
    const { Student } = require('../models');
    const updateQuery = {};
    updateQuery[`images.${req.params.slot}`] = 1;
    
    const student = await Student.findOneAndUpdate(
      { uid: req.params.uid },
      { $unset: updateQuery },
      { new: true }
    );
    res.json(student.images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
