const express = require('express');
const router = express.Router();
const { Student, PastSemester } = require('../models');

// (Moved GET /:uid to the bottom to prevent route shadowing)

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

    // Log productivity activity
    const { ActivityLog } = require('../models');
    await ActivityLog.create({
      userId: req.params.uid,
      action: 'focus_session',
      category: req.body.category || 'General',
      duration: minutes
    });

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

// PUT Timetable (Admin updating the global timetable)
router.put('/timetable/:docId', async (req, res) => {
  try {
    const { Timetable } = require('../models');
    const updatedTT = await Timetable.findOneAndUpdate(
      { docId: req.params.docId },
      req.body,
      { new: true, upsert: true }
    );
    res.json(updatedTT);
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

// PUT Curriculum (Admin updating the global curriculum)
router.put('/curriculum/:docId', async (req, res) => {
  try {
    const { Curriculum } = require('../models');
    const updatedCurr = await Curriculum.findOneAndUpdate(
      { docId: req.params.docId },
      req.body,
      { new: true, upsert: true }
    );
    res.json(updatedCurr);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =======================
// USER DOCUMENTS ROUTES
// =======================

// GET all documents for a user
router.get('/:uid/documents', async (req, res) => {
  try {
    const { UserDocument } = require('../models');
    const docs = await UserDocument.find({ userId: req.params.uid }).sort({ uploadedAt: -1 });
    res.json(docs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST a new document
router.post('/:uid/documents', async (req, res) => {
  try {
    const { UserDocument } = require('../models');
    const { name, fileData } = req.body;
    
    if (!name || !fileData) {
      return res.status(400).json({ error: 'Name and fileData are required' });
    }

    const newDoc = new UserDocument({
      userId: req.params.uid,
      name,
      fileData
    });
    await newDoc.save();
    
    res.json(newDoc);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE a document
router.delete('/:uid/documents/:docId', async (req, res) => {
  try {
    const { UserDocument } = require('../models');
    await UserDocument.findByIdAndDelete(req.params.docId);
    res.json({ success: true });
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
    
    // Check constraint: Can only mark once per day
    const existing = await Attendance.findOne({ userId: req.params.uid, courseCode: req.params.courseCode });
    if (existing && req.body.lastMarkedDate && existing.lastMarkedDate === req.body.lastMarkedDate) {
      return res.status(400).json({ error: "Attendance already marked for this course today" });
    }

    // Prevent MongoServerError by removing immutable fields before update
    delete req.body._id;
    delete req.body.createdAt;
    delete req.body.updatedAt;
    delete req.body.__v;

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

// =======================
// LEETCODE INTEGRATION ROUTES
// =======================

const LEETCODE_PROBLEMS = [
  { titleSlug: "two-sum", name: "Two Sum", difficulty: "Easy" },
  { titleSlug: "valid-parentheses", name: "Valid Parentheses", difficulty: "Easy" },
  { titleSlug: "merge-two-sorted-lists", name: "Merge Two Sorted Lists", difficulty: "Easy" },
  { titleSlug: "best-time-to-buy-and-sell-stock", name: "Best Time to Buy and Sell Stock", difficulty: "Easy" },
  { titleSlug: "valid-palindrome", name: "Valid Palindrome", difficulty: "Easy" },
  { titleSlug: "invert-binary-tree", name: "Invert Binary Tree", difficulty: "Easy" },
  { titleSlug: "maximum-subarray", name: "Maximum Subarray", difficulty: "Medium" },
  { titleSlug: "container-with-most-water", name: "Container With Most Water", difficulty: "Medium" },
  { titleSlug: "3sum", name: "3Sum", difficulty: "Medium" },
  { titleSlug: "longest-substring-without-repeating-characters", name: "Longest Substring Without Repeating Characters", difficulty: "Medium" },
];

router.put('/:uid/leetcode/link', async (req, res) => {
  try {
    const { Student } = require('../models');
    const { username } = req.body;
    const student = await Student.findOneAndUpdate(
      { uid: req.params.uid },
      { leetcodeUsername: username },
      { new: true }
    );
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:uid/leetcode/challenge', async (req, res) => {
  try {
    // Pick a problem based on the day of the year so everyone gets the same one
    const start = new Date(new Date().getFullYear(), 0, 0);
    const diff = new Date() - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    
    const problem = LEETCODE_PROBLEMS[dayOfYear % LEETCODE_PROBLEMS.length];
    res.json(problem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:uid/leetcode/verify', async (req, res) => {
  try {
    const { Student } = require('../models');
    const student = await Student.findOne({ uid: req.params.uid });
    if (!student || !student.leetcodeUsername) {
      return res.status(400).json({ error: 'LeetCode username not linked' });
    }

    // Get today's challenge
    const start = new Date(new Date().getFullYear(), 0, 0);
    const diff = new Date() - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const challenge = LEETCODE_PROBLEMS[dayOfYear % LEETCODE_PROBLEMS.length];

    // Query LeetCode GraphQL
    const query = `
      query recentAcSubmissions($username: String!, $limit: Int!) {
        recentAcSubmissionList(username: $username, limit: $limit) {
          title
          titleSlug
          timestamp
          statusDisplay
        }
      }
    `;

    // Make native fetch request since Node 18 supports it
    const fetchResponse = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com'
      },
      body: JSON.stringify({
        query,
        variables: { username: student.leetcodeUsername, limit: 50 }
      })
    });

    const data = await fetchResponse.json();
    const submissions = data?.data?.recentAcSubmissionList || [];

    // Check if challenge titleSlug is in their recent accepted submissions within the last 24 hours
    const nowTimestamp = Math.floor(Date.now() / 1000);
    const solvedToday = submissions.find(sub => 
      sub.titleSlug === challenge.titleSlug && 
      Math.abs(nowTimestamp - parseInt(sub.timestamp)) < (24 * 60 * 60)
    );

    if (solvedToday) {
      // Check if already updated today
      const lastUpdate = student.lastLeetcodeSolveDate ? new Date(student.lastLeetcodeSolveDate).toISOString().split('T')[0] : null;
      const today = new Date().toISOString().split('T')[0];
      
      if (lastUpdate !== today) {
        student.leetcodeStreak = (student.leetcodeStreak || 0) + 1;
        student.lastLeetcodeSolveDate = new Date();
        await student.save();
        return res.json({ success: true, verified: true, streak: student.leetcodeStreak, message: "Challenge verified! Streak increased." });
      } else {
        return res.json({ success: true, verified: true, streak: student.leetcodeStreak, message: "You already claimed your streak today!" });
      }
    } else {
      return res.json({ success: true, verified: false, message: "No recent submission found. LeetCode's public server can delay updates by up to 10 minutes. Please try again shortly!" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =======================
// CODEFORCES INTEGRATION ROUTES
// =======================

let codeforcesProblemsCache = null;
let lastCacheTime = null;

async function getCodeforcesProblems() {
  if (codeforcesProblemsCache && (Date.now() - lastCacheTime < 24 * 60 * 60 * 1000)) {
    return codeforcesProblemsCache;
  }
  const res = await fetch('https://codeforces.com/api/problemset.problems');
  const data = await res.json();
  if (data.status === 'OK') {
    codeforcesProblemsCache = data.result.problems;
    lastCacheTime = Date.now();
    return codeforcesProblemsCache;
  }
  return [];
}

router.put('/:uid/codeforces/link', async (req, res) => {
  try {
    const { Student } = require('../models');
    const { username } = req.body;
    
    // Fetch CF user info to get rating
    const cfRes = await fetch(`https://codeforces.com/api/user.info?handles=${username}`);
    const cfData = await cfRes.json();
    
    if (cfData.status !== 'OK') {
      return res.status(400).json({ error: 'Invalid Codeforces handle' });
    }
    
    const rating = cfData.result[0].rating || 800;

    const student = await Student.findOneAndUpdate(
      { uid: req.params.uid },
      { codeforcesUsername: username, codeforcesRating: rating },
      { new: true }
    );
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:uid/codeforces/challenge', async (req, res) => {
  try {
    const { Student } = require('../models');
    const student = await Student.findOne({ uid: req.params.uid });
    if (!student || !student.codeforcesUsername) {
      return res.status(400).json({ error: 'Codeforces username not linked' });
    }

    const rating = student.codeforcesRating || 800;
    const problems = await getCodeforcesProblems();
    
    // Filter by rating (R - 100 to R + 300)
    const validProblems = problems.filter(p => p.rating && p.rating >= rating - 100 && p.rating <= rating + 300);
    
    if (validProblems.length === 0) {
      return res.json(problems[0]); // fallback
    }

    // Pick consistent problem for the day using day of year + username length as seed
    const start = new Date(new Date().getFullYear(), 0, 0);
    const diff = new Date() - start;
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    const seed = dayOfYear + student.codeforcesUsername.length;
    const problem = validProblems[seed % validProblems.length];
    
    res.json({
      name: problem.name,
      contestId: problem.contestId,
      index: problem.index,
      difficulty: `Rating ${problem.rating}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:uid/codeforces/verify', async (req, res) => {
  try {
    const { Student } = require('../models');
    const student = await Student.findOne({ uid: req.params.uid });
    if (!student || !student.codeforcesUsername) {
      return res.status(400).json({ error: 'Codeforces username not linked' });
    }

    // Get today's challenge
    const rating = student.codeforcesRating || 800;
    const problems = await getCodeforcesProblems();
    const validProblems = problems.filter(p => p.rating && p.rating >= rating - 100 && p.rating <= rating + 300);
    
    if (validProblems.length === 0) return res.status(400).json({ error: 'No challenge found' });

    const start = new Date(new Date().getFullYear(), 0, 0);
    const diff = new Date() - start;
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    const seed = dayOfYear + student.codeforcesUsername.length;
    const challenge = validProblems[seed % validProblems.length];

    // Query CF user.status
    const cfRes = await fetch(`https://codeforces.com/api/user.status?handle=${student.codeforcesUsername}&from=1&count=50`);
    const cfData = await cfRes.json();
    
    if (cfData.status !== 'OK') {
      return res.status(400).json({ error: 'Failed to fetch Codeforces data' });
    }

    const submissions = cfData.result;
    const nowTimestamp = Math.floor(Date.now() / 1000);
    
    const solvedToday = submissions.find(sub => 
      sub.problem.name === challenge.name && 
      sub.verdict === 'OK' &&
      Math.abs(nowTimestamp - sub.creationTimeSeconds) < (24 * 60 * 60)
    );

    if (solvedToday) {
      const lastUpdate = student.lastCodeforcesSolveDate ? new Date(student.lastCodeforcesSolveDate).toISOString().split('T')[0] : null;
      const today = new Date().toISOString().split('T')[0];
      
      if (lastUpdate !== today) {
        student.codeforcesStreak = (student.codeforcesStreak || 0) + 1;
        student.lastCodeforcesSolveDate = new Date();
        await student.save();
        return res.json({ success: true, verified: true, streak: student.codeforcesStreak, message: "Challenge verified! Streak increased." });
      } else {
        return res.json({ success: true, verified: true, streak: student.codeforcesStreak, message: "You already claimed your streak today!" });
      }
    } else {
      return res.json({ success: true, verified: false, message: "No recent accepted submission found. Make sure your verdict is OK and try again." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =======================
// ATCODER INTEGRATION
// =======================
let atcoderProblemsCache = null;
let lastAtcoderCacheTime = null;

async function getAtcoderProblems() {
  if (atcoderProblemsCache && (Date.now() - lastAtcoderCacheTime < 24 * 60 * 60 * 1000)) {
    return atcoderProblemsCache;
  }
  try {
    const res = await fetch('https://kenkoooo.com/atcoder/resources/problems.json');
    const data = await res.json();
    atcoderProblemsCache = data;
    lastAtcoderCacheTime = Date.now();
    return atcoderProblemsCache;
  } catch (error) {
    return [];
  }
}

router.put('/:uid/atcoder/link', async (req, res) => {
  try {
    const { Student } = require('../models');
    const { username } = req.body;
    
    // Kenkoooo user info (no official API for ratings, but we can verify handle exists via submission check or just accept it)
    // We will just accept it for now and set rating to 0.
    const student = await Student.findOneAndUpdate(
      { uid: req.params.uid },
      { atcoderUsername: username, atcoderRating: 0 },
      { new: true }
    );
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:uid/atcoder/challenge', async (req, res) => {
  try {
    const { Student } = require('../models');
    const student = await Student.findOne({ uid: req.params.uid });
    if (!student || !student.atcoderUsername) return res.status(400).json({ error: 'AtCoder not linked' });

    const problems = await getAtcoderProblems();
    // Filter out beginner ABC problems (easy/medium)
    const abcProblems = problems.filter(p => p.id.startsWith('abc') && (p.id.endsWith('_a') || p.id.endsWith('_b') || p.id.endsWith('_c')));
    
    if (abcProblems.length === 0) return res.status(400).json({ error: 'No problems loaded' });

    const start = new Date(new Date().getFullYear(), 0, 0);
    const dayOfYear = Math.floor((new Date() - start) / (1000 * 60 * 60 * 24));
    const seed = dayOfYear + student.atcoderUsername.length;
    const problem = abcProblems[seed % abcProblems.length];
    
    res.json({
      id: problem.id,
      name: problem.name,
      contestId: problem.contest_id,
      difficulty: problem.id.endsWith('_a') ? 'Easy' : problem.id.endsWith('_b') ? 'Medium' : 'Hard'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:uid/atcoder/verify', async (req, res) => {
  try {
    const { Student } = require('../models');
    const student = await Student.findOne({ uid: req.params.uid });
    if (!student || !student.atcoderUsername) return res.status(400).json({ error: 'AtCoder not linked' });

    const problems = await getAtcoderProblems();
    const abcProblems = problems.filter(p => p.id.startsWith('abc') && (p.id.endsWith('_a') || p.id.endsWith('_b') || p.id.endsWith('_c')));
    const start = new Date(new Date().getFullYear(), 0, 0);
    const dayOfYear = Math.floor((new Date() - start) / (1000 * 60 * 60 * 24));
    const challenge = abcProblems[(dayOfYear + student.atcoderUsername.length) % abcProblems.length];

    // Kenkoooo user submissions API
    const subRes = await fetch(`https://kenkoooo.com/atcoder/atcoder-api/v3/user/submissions?user=${student.atcoderUsername}&from_second=${Math.floor(Date.now()/1000) - 86400}`);
    const submissions = await subRes.json();
    
    const solvedToday = submissions.find(sub => sub.problem_id === challenge.id && sub.result === 'AC');

    if (solvedToday) {
      const today = new Date().toISOString().split('T')[0];
      const lastUpdate = student.lastAtcoderSolveDate ? new Date(student.lastAtcoderSolveDate).toISOString().split('T')[0] : null;
      if (lastUpdate !== today) {
        student.atcoderStreak = (student.atcoderStreak || 0) + 1;
        student.lastAtcoderSolveDate = new Date();
        await student.save();
        return res.json({ success: true, verified: true, streak: student.atcoderStreak, message: "AtCoder verified!" });
      }
      return res.json({ success: true, verified: true, streak: student.atcoderStreak, message: "Already claimed today!" });
    }
    return res.json({ success: true, verified: false, message: "No recent AC submission found on AtCoder." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =======================
// CODECHEF INTEGRATION (SELF-REPORT)
// =======================
const codechefProblems = [
  { code: 'WATERCONS', name: 'Water Consumption', difficulty: 'Beginner' },
  { code: 'SQUATS', name: 'Squats', difficulty: 'Beginner' },
  { code: 'TAXSAVING', name: 'Saving Taxes', difficulty: 'Beginner' },
  { code: 'MINCOINS', name: 'Minimum Coins', difficulty: 'Beginner' },
  { code: 'MAXDIFFMIN', name: 'Max minus Min', difficulty: 'Beginner' }
];

router.put('/:uid/codechef/link', async (req, res) => {
  try {
    const { Student } = require('../models');
    const { username } = req.body;
    const student = await Student.findOneAndUpdate(
      { uid: req.params.uid },
      { codechefUsername: username },
      { new: true }
    );
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:uid/codechef/challenge', async (req, res) => {
  try {
    const { Student } = require('../models');
    const student = await Student.findOne({ uid: req.params.uid });
    if (!student || !student.codechefUsername) return res.status(400).json({ error: 'CodeChef not linked' });

    const start = new Date(new Date().getFullYear(), 0, 0);
    const dayOfYear = Math.floor((new Date() - start) / (1000 * 60 * 60 * 24));
    const challenge = codechefProblems[(dayOfYear + student.codechefUsername.length) % codechefProblems.length];
    
    res.json(challenge);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:uid/codechef/verify', async (req, res) => {
  try {
    const { Student } = require('../models');
    const student = await Student.findOne({ uid: req.params.uid });
    if (!student || !student.codechefUsername) return res.status(400).json({ error: 'CodeChef not linked' });

    // Option A: Self-Report Logic
    const today = new Date().toISOString().split('T')[0];
    const lastUpdate = student.lastCodechefSolveDate ? new Date(student.lastCodechefSolveDate).toISOString().split('T')[0] : null;
    
    if (lastUpdate !== today) {
      student.codechefStreak = (student.codechefStreak || 0) + 1;
      student.lastCodechefSolveDate = new Date();
      await student.save();
      return res.json({ success: true, verified: true, streak: student.codechefStreak, message: "CodeChef self-reported successfully!" });
    }
    return res.json({ success: true, verified: true, streak: student.codechefStreak, message: "Already claimed today!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =======================
// CONTESTS API
// =======================
let upcomingContestsCache = null;
let lastContestCacheTime = null;

router.get('/hub/contests/upcoming', async (req, res) => {
  try {
    let contests = [];
    
    if (upcomingContestsCache && (Date.now() - lastContestCacheTime < 60 * 60 * 1000)) {
      contests = [...upcomingContestsCache];
    } else {
      const cfRes = await fetch('https://codeforces.com/api/contest.list');
      const cfData = await cfRes.json();
      
      if (cfData.status === 'OK') {
        const upcoming = cfData.result.filter(c => c.phase === 'BEFORE').slice(0, 5);
        contests = upcoming.map(c => ({
          platform: 'Codeforces',
          name: c.name,
          startTime: new Date(c.startTimeSeconds * 1000).toISOString(),
          durationSeconds: c.durationSeconds,
          link: 'https://codeforces.com/contests'
        }));
        
        upcomingContestsCache = contests;
        lastContestCacheTime = Date.now();
      }
    }
    
    // Add fake predictable Leetcode contest for Sunday
    const nextSunday = new Date();
    nextSunday.setDate(nextSunday.getDate() + (7 - nextSunday.getDay()) % 7);
    nextSunday.setHours(8, 0, 0, 0); // 8 AM local time usually
    
    contests.push({
      platform: 'LeetCode',
      name: 'Weekly Contest',
      startTime: nextSunday.toISOString(),
      durationSeconds: 5400,
      link: 'https://leetcode.com/contest/'
    });

    // Sort by time
    contests.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    
    res.json(contests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update working hours
router.put('/:uid/working-hours', async (req, res) => {
  try {
    const { Student } = require('../models');
    const student = await Student.findOneAndUpdate(
      { uid: req.params.uid },
      { workingHours: req.body.workingHours },
      { new: true }
    );
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET Student Data (Moved to bottom to prevent route shadowing)
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

module.exports = router;
