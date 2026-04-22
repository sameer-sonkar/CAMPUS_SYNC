"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { studentService, attendanceService } from '@/lib/api';

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Configuration State
  const [branch, setBranch] = useState('CSE');
  const [batchYear, setBatchYear] = useState('2024');
  
  // Timetable State
  const [schedule, setSchedule] = useState({
    Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: []
  });
  
  const [selectedDay, setSelectedDay] = useState('Monday');

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const uid = localStorage.getItem('uid');
        if (!uid) {
          setLoading(false);
          return;
        }
        const profile = await studentService.getStudent(uid);
        if (profile?.role === 'admin') {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Admin check failed");
      } finally {
        setLoading(false);
      }
    };
    checkAdmin();
  }, []);

  const loadExistingTimetable = async () => {
    try {
      const docId = `${branch}_${batchYear}-${parseInt(batchYear) + 4}`;
      const tt = await attendanceService.getTimetable(docId);
      if (tt && tt.schedule) {
        setSchedule({
          Monday: tt.schedule.Monday || [],
          Tuesday: tt.schedule.Tuesday || [],
          Wednesday: tt.schedule.Wednesday || [],
          Thursday: tt.schedule.Thursday || [],
          Friday: tt.schedule.Friday || [],
          Saturday: tt.schedule.Saturday || [],
          Sunday: tt.schedule.Sunday || [],
        });
        alert(`Loaded existing timetable for ${docId}`);
      } else {
        alert("No existing timetable found. You can start fresh.");
        setSchedule({ Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: [] });
      }
    } catch (error) {
      alert("No existing timetable found. Start fresh.");
      setSchedule({ Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: [] });
    }
  };

  const handleAddClass = () => {
    const newClass = { time: "09:00 - 10:00", code: "NEW101", name: "New Course", room: "Room X" };
    setSchedule(prev => ({
      ...prev,
      [selectedDay]: [...prev[selectedDay], newClass]
    }));
  };

  const handleUpdateClass = (index, field, value) => {
    const updatedDay = [...schedule[selectedDay]];
    updatedDay[index] = { ...updatedDay[index], [field]: value };
    setSchedule(prev => ({ ...prev, [selectedDay]: updatedDay }));
  };

  const handleDeleteClass = (index) => {
    const updatedDay = schedule[selectedDay].filter((_, i) => i !== index);
    setSchedule(prev => ({ ...prev, [selectedDay]: updatedDay }));
  };

  const handlePublish = async () => {
    try {
      const docId = `${branch}_${batchYear}-${parseInt(batchYear) + 4}`;
      await attendanceService.updateTimetable(docId, schedule);
      alert(`✅ Timetable successfully published for ${docId}!`);
    } catch (error) {
      console.error(error);
      alert("Failed to publish timetable.");
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading Admin Portal...</div>;
  if (!isAdmin) return <div style={{ padding: '2rem', color: 'red' }}>Access Denied. You must be an Admin.</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <header>
        <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>Admin Portal</h1>
        <p style={{ color: 'var(--text-muted)' }}>Globally manage Timetables and Courses for all students.</p>
      </header>

      {/* Configuration Panel */}
      <motion.div className="glass" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem' }}>Branch</label>
          <select value={branch} onChange={e => setBranch(e.target.value)} className="input-premium">
            <option value="CSE">CSE</option>
            <option value="Civil">Civil</option>
            <option value="Mechanical">Mechanical</option>
            <option value="Electrical">Electrical</option>
            <option value="ECE">ECE</option>
            <option value="Chemical">Chemical</option>
            <option value="Metallurgy">Metallurgy</option>
            <option value="Economics">Economics</option>
            <option value="AI & DS">AI & DS</option>
            <option value="Mathematics and Computing">Mathematics and Computing</option>
          </select>
        </div>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem' }}>Batch Start Year</label>
          <select value={batchYear} onChange={e => setBatchYear(e.target.value)} className="input-premium">
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
          </select>
        </div>
        <button className="btn-secondary" onClick={loadExistingTimetable} style={{ padding: '0.8rem 1.5rem', fontWeight: 700, backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer' }}>
          Load Existing
        </button>
      </motion.div>

      {/* Builder Panel */}
      <div className="glass" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Timetable Builder</h2>
          <div style={{ fontWeight: 600, color: 'var(--primary-dark)' }}>
            Targeting: {branch}_{batchYear}-{parseInt(batchYear) + 4}
          </div>
        </div>

        {/* Days Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {DAYS.map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                border: 'none',
                fontWeight: 700,
                cursor: 'pointer',
                backgroundColor: selectedDay === day ? 'var(--primary)' : 'var(--surface)',
                color: selectedDay === day ? '#1A1D20' : 'var(--text-main)',
                transition: 'all 0.2s ease'
              }}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Classes List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {schedule[selectedDay]?.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', backgroundColor: 'var(--background)', borderRadius: '12px' }}>
              No classes scheduled for {selectedDay}.
            </div>
          ) : (
            schedule[selectedDay].map((cls, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'center', backgroundColor: 'var(--background)', padding: '1rem', borderRadius: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Time</label>
                  <input type="text" value={cls.time} onChange={(e) => handleUpdateClass(idx, 'time', e.target.value)} className="input-premium" style={{ padding: '0.5rem' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Code</label>
                  <input type="text" value={cls.code} onChange={(e) => handleUpdateClass(idx, 'code', e.target.value)} className="input-premium" style={{ padding: '0.5rem' }} />
                </div>
                <div style={{ flex: 2 }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Name</label>
                  <input type="text" value={cls.name} onChange={(e) => handleUpdateClass(idx, 'name', e.target.value)} className="input-premium" style={{ padding: '0.5rem' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Room</label>
                  <input type="text" value={cls.room} onChange={(e) => handleUpdateClass(idx, 'room', e.target.value)} className="input-premium" style={{ padding: '0.5rem' }} />
                </div>
                <button onClick={() => handleDeleteClass(idx)} style={{ padding: '0.5rem', backgroundColor: 'var(--danger)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', alignSelf: 'flex-end', height: '42px', fontWeight: 700 }}>
                  Delete
                </button>
              </div>
            ))
          )}
        </div>

        <button onClick={handleAddClass} style={{ marginTop: '1.5rem', width: '100%', padding: '1rem', backgroundColor: 'var(--surface)', border: '2px dashed var(--border)', borderRadius: '12px', color: 'var(--text-main)', fontWeight: 700, cursor: 'pointer' }}>
          + Add Class to {selectedDay}
        </button>
      </div>

      <button className="btn-primary" onClick={handlePublish} style={{ padding: '1.25rem', fontSize: '1.1rem', marginTop: '1rem' }}>
        Publish Global Timetable
      </button>

    </div>
  );
}
