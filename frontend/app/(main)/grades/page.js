"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Save } from 'lucide-react';

export default function GradesPage() {
  const [courses, setCourses] = useState([
    { id: 1, name: "Data Structures", credit: 4, grade: "AA" },
    { id: 2, name: "Calculus", credit: 4, grade: "AB" },
    { id: 3, name: "Physics", credit: 3, grade: "BB" },
  ]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <header>
        <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>Grade Calculator</h1>
        <p style={{ color: 'var(--text-muted)' }}>Estimate your semester SPI and CPI.</p>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass"
        style={{ padding: '2rem' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--primary-dark)' }}>
          <Calculator size={24} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Current Semester</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {courses.map((course) => (
            <div key={course.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <input type="text" className="input-premium" value={course.name} readOnly style={{ flex: 2 }} />
              <input type="number" className="input-premium" value={course.credit} readOnly style={{ flex: 1 }} />
              <select className="input-premium" value={course.grade} onChange={() => {}} style={{ flex: 1, appearance: 'none' }}>
                <option value="AA">AA (10)</option>
                <option value="AB">AB (9)</option>
                <option value="BB">BB (8)</option>
                <option value="BC">BC (7)</option>
                <option value="CC">CC (6)</option>
                <option value="CD">CD (5)</option>
                <option value="DD">DD (4)</option>
                <option value="F">F (0)</option>
              </select>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', backgroundColor: 'var(--background)', borderRadius: '12px' }}>
          <div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 700 }}>Estimated SPI</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--primary-dark)' }}>8.81</div>
          </div>
          <button className="btn-primary" style={{ gap: '0.5rem' }}>
            <Save size={18} /> Save to History
          </button>
        </div>
      </motion.div>
    </div>
  );
}
