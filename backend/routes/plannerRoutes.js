const express = require('express');
const router = express.Router();
const { PlannerTask, SmartReminder } = require('../models');

// GET all tasks for a user
router.get('/:uid', async (req, res) => {
  try {
    const tasks = await PlannerTask.find({ userId: req.params.uid }).sort({ dueDate: 1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ADD a new task
router.post('/:uid', async (req, res) => {
  try {
    const taskData = req.body;
    taskData.userId = req.params.uid;
    const newTask = new PlannerTask(taskData);
    await newTask.save();

    // Mirror to SmartReminder if requested
    if (newTask.isSmartReminder) {
      const reminder = new SmartReminder({
        userId: req.params.uid,
        source: 'planner',
        title: newTask.title,
        description: newTask.description,
        dateTime: newTask.dateTime,
        originalId: newTask._id.toString()
      });
      await reminder.save();
    }

    res.json(newTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE a task
router.put('/:uid/:taskId', async (req, res) => {
  try {
    const task = await PlannerTask.findOneAndUpdate(
      { _id: req.params.taskId, userId: req.params.uid },
      req.body,
      { new: true }
    );

    if (task.isSmartReminder) {
      if (task.isCompleted) {
        await SmartReminder.findOneAndUpdate(
          { originalId: task._id.toString(), userId: req.params.uid },
          { isRead: true }
        );
      } else {
        await SmartReminder.findOneAndUpdate(
          { originalId: task._id.toString(), userId: req.params.uid },
          { 
            title: task.title, 
            description: task.description, 
            dateTime: task.dateTime 
          },
          { upsert: true }
        );
      }
    } else {
      await SmartReminder.findOneAndDelete({ originalId: task._id.toString(), userId: req.params.uid });
    }

    // Log productivity activity if completed
    if (req.body.isCompleted === true) {
      const { ActivityLog } = require('../models');
      const categoryMatch = task.description?.match(/Category:\s*(.+)/);
      const category = categoryMatch ? categoryMatch[1].trim() : 'Task';
      
      await ActivityLog.create({
        userId: req.params.uid,
        action: 'task_completed',
        category: category
      });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE a task
router.delete('/:uid/:taskId', async (req, res) => {
  try {
    await PlannerTask.findOneAndDelete({ _id: req.params.taskId, userId: req.params.uid });
    await SmartReminder.findOneAndDelete({ originalId: req.params.taskId, userId: req.params.uid });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /:uid/schedule-suggestion (Smart Scheduling Algorithm)
router.post('/:uid/schedule-suggestion', async (req, res) => {
  try {
    const { title, dueDate, priority, estimatedTime } = req.body;
    const { Student, Timetable, PlannerTask } = require('../models');
    
    // 1. Fetch Student preferences & docId
    const student = await Student.findOne({ uid: req.params.uid });
    if (!student) return res.status(404).json({ error: "Student not found" });

    const whStart = student.workingHours?.start || "08:00";
    const whEnd = student.workingHours?.end || "22:00";
    
    // 2. Fetch Timetable
    let timetable = null;
    if (student.docId) {
      timetable = await Timetable.findOne({ docId: student.docId });
    }

    // 3. Fetch existing scheduled tasks
    const existingTasks = await PlannerTask.find({ 
      userId: req.params.uid, 
      scheduledStart: { $exists: true },
      isCompleted: false 
    });

    // Helper: time string "HH:MM" to minutes from midnight
    const timeToMins = (tStr) => {
      if (!tStr) return 0;
      const [h, m] = tStr.split(':').map(Number);
      return h * 60 + m;
    };
    
    const whStartMins = timeToMins(whStart);
    const whEndMins = timeToMins(whEnd);
    const neededMins = (estimatedTime || 1) * 60;

    // Helper: get day name
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // We look up to 7 days ahead, starting from today
    const now = new Date();
    let suggestedStart = null;
    let suggestedEnd = null;

    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(now);
      currentDay.setDate(now.getDate() + i);
      currentDay.setHours(0, 0, 0, 0);

      // Stop if we passed the due date (unless it's today)
      const due = new Date(dueDate);
      if (currentDay > due && i > 0) break;

      const dayName = days[currentDay.getDay()];
      
      // Get class blocks for this day
      const classBlocks = [];
      if (timetable && timetable[dayName] && Array.isArray(timetable[dayName])) {
        timetable[dayName].forEach(c => {
          // Assuming format "09:00 - 10:00"
          if (c.time && c.time.includes('-')) {
            const [startStr, endStr] = c.time.split('-').map(s => s.trim());
            classBlocks.push({ start: timeToMins(startStr), end: timeToMins(endStr) });
          }
        });
      }

      // Get existing tasks for this day
      const taskBlocks = [];
      existingTasks.forEach(t => {
        const tStart = new Date(t.scheduledStart);
        const tEnd = new Date(t.scheduledEnd);
        if (tStart.toDateString() === currentDay.toDateString()) {
          taskBlocks.push({ 
            start: tStart.getHours() * 60 + tStart.getMinutes(),
            end: tEnd.getHours() * 60 + tEnd.getMinutes()
          });
        }
      });

      // Combine and merge all busy blocks
      let busyBlocks = [...classBlocks, ...taskBlocks];
      busyBlocks.sort((a, b) => a.start - b.start);
      
      const mergedBusy = [];
      if (busyBlocks.length > 0) {
        let current = busyBlocks[0];
        for (let j = 1; j < busyBlocks.length; j++) {
          if (busyBlocks[j].start <= current.end) {
            current.end = Math.max(current.end, busyBlocks[j].end);
          } else {
            mergedBusy.push(current);
            current = busyBlocks[j];
          }
        }
        mergedBusy.push(current);
      }

      // Find free gap
      let freeStartMins = whStartMins;
      
      // If it's today, we can't schedule in the past
      if (i === 0) {
        const currentMins = now.getHours() * 60 + now.getMinutes();
        freeStartMins = Math.max(freeStartMins, currentMins + 15); // buffer 15 mins
        // Round to next 30 min block
        freeStartMins = Math.ceil(freeStartMins / 30) * 30;
      }

      for (const block of mergedBusy) {
        if (freeStartMins < block.start) {
          if (block.start - freeStartMins >= neededMins) {
            // Found a gap!
            break; // freeStartMins is our winner
          }
        }
        freeStartMins = Math.max(freeStartMins, block.end);
      }

      // Check if tail end has space
      if (freeStartMins + neededMins <= whEndMins) {
        // We found a slot!
        const sDate = new Date(currentDay);
        sDate.setHours(Math.floor(freeStartMins / 60), freeStartMins % 60, 0, 0);
        
        const eDate = new Date(sDate);
        eDate.setMinutes(sDate.getMinutes() + neededMins);

        suggestedStart = sDate;
        suggestedEnd = eDate;

        // If high priority, we break immediately (earliest possible).
        // If low/medium, maybe we keep looking for a better time?
        // For MVP simplicity, we just take the first available slot.
        break;
      }
    }

    if (suggestedStart && suggestedEnd) {
      res.json({
        success: true,
        suggestedStart,
        suggestedEnd,
        message: `Suggested: ${suggestedStart.toLocaleDateString() === now.toLocaleDateString() ? 'Today' : suggestedStart.toLocaleDateString()} ${suggestedStart.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${suggestedEnd.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`
      });
    } else {
      res.json({
        success: false,
        message: "No free slots found before the deadline."
      });
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
