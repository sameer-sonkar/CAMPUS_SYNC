"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { attendanceService, studentService } from '@/lib/api';

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function TimetablePage() {
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [timetable, setTimetable] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Fallback dummy timetable if the user doesn't have a real one assigned
  const DUMMY_TIMETABLE = [
    { time: "09:00 - 10:00", code: "CS101", name: "Intro to Programming", room: "Room 304" },
    { time: "10:30 - 11:30", code: "MATH201", name: "Calculus II", room: "Lecture Hall A" },
    { time: "13:00 - 14:30", code: "PHY101", name: "Physics Lab", room: "Lab 2" },
  ];

  const [uid, setUid] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUid(localStorage.getItem('uid'));
    }
  }, []);

  useEffect(() => {
    if (!uid) return;

    const fetchTimetableAndAttendance = async () => {
      try {
        // 1. Fetch Student Profile to get branch/semester (to find timetable docId)
        const student = await studentService.getStudent(uid);
        let docId = 'DUMMY';
        if (student && student.branch && student.rollNo) {
          // Derive docId logic if they have branch and rollNo
          const startYear = student.rollNo.length >= 2 ? 2000 + parseInt(student.rollNo.substring(0, 2)) : 2024;
          docId = `${student.branch}_${startYear}-${startYear + 4}`;
        }

        // 2. Fetch Timetable
        try {
          const tt = await attendanceService.getTimetable(docId);
          // Assuming tt has a 'schedule' object with days
          if (tt && tt.schedule) {
            // We map the backend schedule format to our UI format
            // If the backend format is different, this needs adjusting
            setTimetable(tt.schedule[selectedDay] || []);
          } else {
            setTimetable(DUMMY_TIMETABLE);
          }
        } catch (e) {
          console.warn("Real timetable not found, using dummy data.", e);
          setTimetable(DUMMY_TIMETABLE);
        }

        // 3. Fetch Attendance
        const attRecords = await attendanceService.getAttendance(uid);
        const attMap = {};
        attRecords.forEach(rec => {
          attMap[rec.courseCode] = rec;
        });
        setAttendanceRecords(attMap);
        
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setTimetable(DUMMY_TIMETABLE);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTimetableAndAttendance();
  }, [uid, selectedDay]);

  const handleAttendance = async (courseCode, isPresent) => {
    if (!uid) return;

    const currentDateStr = new Date().toISOString().split('T')[0];

    // Optimistically update UI
    const prevRecord = attendanceRecords[courseCode] || { attended: 0, total: 0 };
    const updatedRecord = {
      ...prevRecord,
      total: prevRecord.total + 1,
      attended: isPresent ? prevRecord.attended + 1 : prevRecord.attended,
      [selectedDay]: (prevRecord[selectedDay] || 0) + 1,
      lastMarkedDate: currentDateStr,
      lastMarkedStatus: isPresent ? "present" : "absent"
    };

    setAttendanceRecords({
      ...attendanceRecords,
      [courseCode]: updatedRecord
    });

    try {
      await attendanceService.updateAttendance(uid, courseCode, updatedRecord);
    } catch (error) {
      console.error("Failed to update attendance:", error);
      setAttendanceRecords({ ...attendanceRecords, [courseCode]: prevRecord });
      alert("Failed to save attendance to the database!");
    }
  };

  const handleUndoAttendance = async (courseCode) => {
    if (!uid) return;

    const prevRecord = attendanceRecords[courseCode];
    if (!prevRecord) return;

    // If it's a legacy record without lastMarkedStatus, safely fallback to assuming 'present'
    const status = prevRecord.lastMarkedStatus || "present";
    const isPresent = status === "present";

    const updatedRecord = {
      ...prevRecord,
      total: Math.max(0, prevRecord.total - 1),
      attended: isPresent ? Math.max(0, prevRecord.attended - 1) : prevRecord.attended,
      [selectedDay]: Math.max(0, (prevRecord[selectedDay] || 1) - 1),
      lastMarkedDate: "",
      lastMarkedStatus: ""
    };

    setAttendanceRecords({
      ...attendanceRecords,
      [courseCode]: updatedRecord
    });

    try {
      // We pass lastMarkedDate: "" which will correctly bypass the backend's daily block!
      await attendanceService.updateAttendance(uid, courseCode, updatedRecord);
    } catch (error) {
      console.error("Failed to undo attendance:", error);
      setAttendanceRecords({ ...attendanceRecords, [courseCode]: prevRecord });
      alert("Failed to undo attendance!");
    }
  };


  const calculatePercentage = (attended, total) => {
    if (total === 0) return 0;
    return Math.round((attended / total) * 100);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <header>
        <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>Weekly Schedule</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage your attendance.</p>
      </header>

      {/* Day Selector */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {DAYS.map(day => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: selectedDay === day ? 'var(--primary)' : 'var(--surface)',
              color: selectedDay === day ? 'var(--text-main)' : 'var(--text-muted)',
              fontWeight: selectedDay === day ? 800 : 600,
              cursor: 'pointer',
              boxShadow: selectedDay === day ? '0 4px 12px rgba(255,209,102,0.3)' : '0 2px 5px rgba(0,0,0,0.02)',
              transition: 'all 0.2s ease',
            }}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Classes List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              Loading schedule...
            </motion.div>
          ) : timetable.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              No classes scheduled for {selectedDay}.
            </motion.div>
          ) : (
            timetable.map((cls, idx) => {
              const att = attendanceRecords[cls.code] || { attended: 0, total: 0 };
              const percent = calculatePercentage(att.attended, att.total);
              
              return (
                <motion.div
                  key={`${selectedDay}-${idx}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass"
                  style={{ display: 'flex', alignItems: 'center', padding: '1.5rem', gap: '1.5rem', flexWrap: 'wrap' }}
                >
                  <div style={{ backgroundColor: 'rgba(255,209,102,0.15)', padding: '1rem', borderRadius: '12px', textAlign: 'center', minWidth: '120px' }}>
                    <div style={{ fontWeight: 800 }}>{cls.time.split(' - ')[0]}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--primary-dark)', margin: '0.2rem 0' }}>↓</div>
                    <div style={{ fontWeight: 800 }}>{cls.time.split(' - ')[1]}</div>
                  </div>

                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ color: 'var(--primary-dark)', fontWeight: 800, fontSize: '0.85rem' }}>{cls.code}</div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0.25rem 0' }}>{cls.name}</h3>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>{cls.room}</div>
                  </div>

                  {/* Attendance Stats Display */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.5rem 1rem', backgroundColor: 'var(--background)', borderRadius: '12px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Attendance</span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 900, color: percent >= 75 ? 'var(--success)' : percent > 0 ? 'var(--danger)' : 'var(--text-main)' }}>
                      {percent}%
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({att.attended}/{att.total})</span>
                  </div>

                  {selectedDay !== new Date().toLocaleDateString('en-US', { weekday: 'long' }) ? (
                    <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: 'var(--surface)', padding: '0.75rem 1.5rem', borderRadius: '12px', alignItems: 'center', opacity: 0.7 }}>
                      <span style={{ color: 'var(--text-muted)', fontWeight: 800 }}>🔒 Locked (Available only on {selectedDay}s)</span>
                    </div>
                  ) : att.lastMarkedDate === new Date().toISOString().split('T')[0] ? (
                    <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: 'rgba(6, 214, 160, 0.1)', padding: '0.75rem 1.5rem', borderRadius: '12px', alignItems: 'center' }}>
                      <span style={{ color: 'var(--success)', fontWeight: 800 }}>✅ Marked Today</span>
                      <button 
                        onClick={() => handleUndoAttendance(cls.code)}
                        style={{ marginLeft: '1rem', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--surface)', color: 'var(--text-main)', cursor: 'pointer', fontWeight: 700, transition: 'all 0.2s ease' }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--background)'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--surface)'}
                      >
                        Undo ↩
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: 'var(--background)', padding: '0.5rem', borderRadius: '12px' }}>
                      <button 
                        onClick={() => handleAttendance(cls.code, true)}
                        style={{ padding: '0.75rem', borderRadius: '8px', border: 'none', backgroundColor: 'var(--success)', color: 'white', cursor: 'pointer', fontWeight: 700 }}
                      >
                        Present
                      </button>
                      <button 
                        onClick={() => handleAttendance(cls.code, false)}
                        style={{ padding: '0.75rem', borderRadius: '8px', border: 'none', backgroundColor: 'var(--danger)', color: 'white', cursor: 'pointer', fontWeight: 700 }}
                      >
                        Absent
                      </button>
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
