const express = require('express');
const router = express.Router();
const { ActivityLog, PlannerTask } = require('../models');

// GET /:id/weekly
router.get('/:id/weekly', async (req, res) => {
  try {
    const uid = req.params.id;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // 1. Weekly Tasks Completed (Bar Chart)
    const taskLogs = await ActivityLog.aggregate([
      { $match: { userId: uid, action: 'task_completed', timestamp: { $gte: sevenDaysAgo } } },
      { $project: { dayOfWeek: { $dayOfWeek: "$timestamp" } } },
      { $group: { _id: "$dayOfWeek", count: { $sum: 1 } } }
    ]);

    // Format to Mon-Sun array
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const barData = days.map((day, idx) => {
      // MongoDB $dayOfWeek is 1-indexed starting Sunday (1=Sun, 2=Mon...)
      const match = taskLogs.find(t => t._id === idx + 1);
      return { name: day, tasks: match ? match.count : 0 };
    });
    // Shift array to make Monday first
    barData.push(barData.shift());

    // 2. Study Hours per Subject (Pie Chart)
    const focusLogs = await ActivityLog.aggregate([
      { $match: { userId: uid, action: 'focus_session', timestamp: { $gte: sevenDaysAgo } } },
      { $group: { _id: "$category", totalMinutes: { $sum: "$duration" } } }
    ]);

    const pieData = focusLogs.map(log => ({
      name: log._id || 'General',
      value: parseFloat((log.totalMinutes / 60).toFixed(1)) // converting to hours
    })).filter(log => log.value > 0);

    // 3. Completion Rate (Tasks Completed / Total Tasks Due in last 7 days)
    const totalDue = await PlannerTask.countDocuments({
      userId: uid,
      dueDate: { $gte: sevenDaysAgo, $lte: new Date() }
    });
    
    const completedTasks = await ActivityLog.countDocuments({
      userId: uid,
      action: 'task_completed',
      timestamp: { $gte: sevenDaysAgo }
    });

    const completionRate = totalDue > 0 ? Math.round((completedTasks / totalDue) * 100) : (completedTasks > 0 ? 100 : 0);

    res.json({
      barData,
      pieData,
      completionRate
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /:id/daily (Heatmap / Hourly Distribution)
router.get('/:id/daily', async (req, res) => {
  try {
    const uid = req.params.id;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const hourlyActivity = await ActivityLog.aggregate([
      { $match: { userId: uid, timestamp: { $gte: thirtyDaysAgo } } },
      { $project: { hour: { $hour: "$timestamp" } } },
      { $group: { _id: "$hour", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    // Find most productive time
    let mostProductiveTime = "N/A";
    if (hourlyActivity.length > 0) {
      let maxCount = -1;
      let maxHour = 0;
      hourlyActivity.forEach(h => {
        if (h.count > maxCount) {
          maxCount = h.count;
          maxHour = h._id;
        }
      });
      const endHour = (maxHour + 2) % 24;
      const formatAMPM = (h) => {
        const ampm = h >= 12 ? 'PM' : 'AM';
        const hr = h % 12 || 12;
        return `${hr}:00 ${ampm}`;
      };
      mostProductiveTime = `${formatAMPM(maxHour)} - ${formatAMPM(endHour)}`;
    }

    // Format heatmap data (0-23 hours)
    const heatmapData = Array.from({ length: 24 }, (_, i) => {
      const match = hourlyActivity.find(h => h._id === i);
      const ampm = i >= 12 ? 'PM' : 'AM';
      const hr = i % 12 || 12;
      return {
        hour: `${hr}${ampm}`,
        activity: match ? match.count : 0
      };
    });

    res.json({
      heatmapData,
      mostProductiveTime
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /:id/smart-attendance
router.get('/:id/smart-attendance', async (req, res) => {
  try {
    const { Timetable, Attendance, Student } = require('../models');
    const uid = req.params.id;
    
    const student = await Student.findById(uid);
    if (!student) return res.json([]);
    
    // Derive docId exactly as frontend does
    let docId = 'DUMMY';
    if (student.branch && student.rollNo) {
      const startYear = student.rollNo.length >= 2 ? 2000 + parseInt(student.rollNo.substring(0, 2)) : 2024;
      docId = `${student.branch}_${startYear}-${startYear + 4}`;
    }

    const timetable = await Timetable.findOne({ docId });
    if (!timetable) return res.json([]);

    const attendanceRecords = await Attendance.find({ userId: uid });
    
    // 1. Calculate how many days of each weekday have passed since Jan 1st
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    
    let daysPassed = {
      Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0, Sunday: 0
    };
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    for (let d = new Date(startOfYear); d <= today; d.setDate(d.getDate() + 1)) {
      daysPassed[dayNames[d.getDay()]]++;
    }
    
    // 2. Count expected classes based on the Timetable
    let courseWeeklyCounts = {}; 
    const scheduleDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    scheduleDays.forEach(day => {
      // Data in DB is stored inside `schedule` object
      const daySchedule = timetable.schedule && timetable.schedule[day] ? timetable.schedule[day] : (timetable[day] && Array.isArray(timetable[day]) ? timetable[day] : null);
      
      if (daySchedule && Array.isArray(daySchedule)) {
        daySchedule.forEach(cls => {
          if (cls.code) {
            const normalizedCode = cls.code.toLowerCase().trim();
            if (!courseWeeklyCounts[normalizedCode]) {
              courseWeeklyCounts[normalizedCode] = { expected: 0, code: cls.code };
            }
            courseWeeklyCounts[normalizedCode].expected += daysPassed[day];
          }
        });
      }
    });

    // 3. Compute Attendance percentage
    const result = [];
    for (const normCode in courseWeeklyCounts) {
      let expected = courseWeeklyCounts[normCode].expected;
      if (expected === 0) continue;
      
      const record = attendanceRecords.find(r => r.courseCode.toLowerCase().trim() === normCode);
      
      let absences = 0;
      if (record) {
        // Assume missing data means present. Absences = total tracked - attended tracked.
        absences = Math.max(0, record.total - record.attended);
      }
      
      let assumedAttended = expected - absences;
      if (assumedAttended < 0) assumedAttended = 0;
      
      let percentage = Math.round((assumedAttended / expected) * 100);
      
      result.push({
        courseCode: courseWeeklyCounts[normCode].code,
        expected,
        attended: assumedAttended,
        absences,
        percentage
      });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /:id/attendance-timeline
router.get('/:id/attendance-timeline', async (req, res) => {
  try {
    const { Timetable, Attendance, Student } = require('../models');
    const uid = req.params.id;
    
    const student = await Student.findById(uid);
    if (!student) return res.json({ timeline: [], courses: [] });
    
    let docId = 'DUMMY';
    if (student.branch && student.rollNo) {
      const startYear = student.rollNo.length >= 2 ? 2000 + parseInt(student.rollNo.substring(0, 2)) : 2024;
      docId = `${student.branch}_${startYear}-${startYear + 4}`;
    }

    let timetable = await Timetable.findOne({ docId });
    if (!timetable) {
      // Fallback to dummy timetable so the tracker works for new/unconfigured users
      const dummyClasses = [
        { code: "CS101", name: "Intro to Programming" },
        { code: "MATH201", name: "Calculus II" },
        { code: "PHY101", name: "Physics Lab" }
      ];
      timetable = {
        schedule: {
          Monday: dummyClasses,
          Tuesday: dummyClasses,
          Wednesday: dummyClasses,
          Thursday: dummyClasses,
          Friday: dummyClasses
        }
      };
    }

    const attendanceRecords = await Attendance.find({ userId: uid });
    
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const scheduleDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    let courseWeeklyMap = {}; 
    scheduleDays.forEach(day => {
      const daySchedule = timetable.schedule && timetable.schedule[day] ? timetable.schedule[day] : (timetable[day] && Array.isArray(timetable[day]) ? timetable[day] : null);
      if (daySchedule && Array.isArray(daySchedule)) {
        daySchedule.forEach(cls => {
          if (cls.code) {
            const normalizedCode = cls.code.toUpperCase().trim();
            if (!courseWeeklyMap[normalizedCode]) courseWeeklyMap[normalizedCode] = { days: [] };
            courseWeeklyMap[normalizedCode].days.push(day);
          }
        });
      }
    });

    const courses = Object.keys(courseWeeklyMap);
    if (courses.length === 0) return res.json({ timeline: [], courses: [] });

    let totalExpectedToday = {};
    courses.forEach(c => totalExpectedToday[c] = 0);
    for (let d = new Date(startOfYear); d <= today; d.setDate(d.getDate() + 1)) {
      const dayName = scheduleDays[d.getDay()];
      courses.forEach(c => {
        if (courseWeeklyMap[c].days.includes(dayName)) totalExpectedToday[c]++;
      });
    }

    let state = {};
    courses.forEach(c => {
      const record = attendanceRecords.find(r => r.courseCode.toUpperCase().trim() === c);
      let totalAbsences = record ? Math.max(0, record.total - record.attended) : 0;
      state[c] = { totalAbsences, expectedSoFar: 0 };
    });

    let timeline = [];
    let currentWeekStart = new Date(startOfYear);
    // Align to the start of the week (Sunday)
    currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay());
    let weekCounter = 1;

    while (currentWeekStart <= today) {
      let weekEnd = new Date(currentWeekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      let processingEnd = new Date(weekEnd);
      if (processingEnd > today) processingEnd = new Date(today);

      for (let d = new Date(currentWeekStart); d <= processingEnd; d.setDate(d.getDate() + 1)) {
        // Skip days before Jan 1 if week started in Dec
        if (d < startOfYear) continue;
        const dayName = scheduleDays[d.getDay()];
        courses.forEach(c => {
          if (courseWeeklyMap[c].days.includes(dayName)) {
            state[c].expectedSoFar++;
          }
        });
      }

      let point = { name: `Week ${weekCounter}` };
      courses.forEach(c => {
        if (state[c].expectedSoFar === 0) {
          point[c] = 100;
        } else {
          // Calculate proportional absences up to this point
          const absenceRate = state[c].totalAbsences / (totalExpectedToday[c] || 1);
          const absencesSoFar = Math.round(state[c].expectedSoFar * absenceRate);
          const attendedSoFar = state[c].expectedSoFar - absencesSoFar;
          point[c] = Math.round((attendedSoFar / state[c].expectedSoFar) * 100);
        }
      });

      timeline.push(point);
      
      currentWeekStart.setDate(currentWeekStart.getDate() + 7);
      weekCounter++;
    }

    res.json({ timeline, courses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

