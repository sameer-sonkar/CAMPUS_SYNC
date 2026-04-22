"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function TimetablePage() {
  const [selectedDay, setSelectedDay] = useState("Monday");

  // Dummy timetable data
  const timetable = [
    { time: "09:00 - 10:00", code: "CS101", name: "Intro to Programming", room: "Room 304" },
    { time: "10:30 - 11:30", code: "MATH201", name: "Calculus II", room: "Lecture Hall A" },
    { time: "13:00 - 14:30", code: "PHY101", name: "Physics Lab", room: "Lab 2" },
  ];

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
        {timetable.map((cls, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass"
            style={{ display: 'flex', alignItems: 'center', padding: '1.5rem', gap: '1.5rem' }}
          >
            <div style={{ backgroundColor: 'rgba(255,209,102,0.15)', padding: '1rem', borderRadius: '12px', textAlign: 'center', minWidth: '120px' }}>
              <div style={{ fontWeight: 800 }}>{cls.time.split(' - ')[0]}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--primary-dark)', margin: '0.2rem 0' }}>↓</div>
              <div style={{ fontWeight: 800 }}>{cls.time.split(' - ')[1]}</div>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ color: 'var(--primary-dark)', fontWeight: 800, fontSize: '0.85rem' }}>{cls.code}</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0.25rem 0' }}>{cls.name}</h3>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>{cls.room}</div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: 'var(--background)', padding: '0.5rem', borderRadius: '12px' }}>
              <button style={{ padding: '0.75rem', borderRadius: '8px', border: 'none', backgroundColor: 'var(--success)', color: 'white', cursor: 'pointer', fontWeight: 700 }}>
                Present
              </button>
              <button style={{ padding: '0.75rem', borderRadius: '8px', border: 'none', backgroundColor: 'var(--danger)', color: 'white', cursor: 'pointer', fontWeight: 700 }}>
                Absent
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
