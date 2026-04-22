"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Clock, Plus } from 'lucide-react';

export default function PlannerPage() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Finish Math Assignment', category: 'Homework', completed: false, time: '2:00 PM' },
    { id: 2, title: 'Read Chapter 4 History', category: 'Reading', completed: true, time: '4:30 PM' },
    { id: 3, title: 'Submit Project Proposal', category: 'Project', completed: false, time: 'Tomorrow' },
  ]);

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>Daily Planner</h1>
          <p style={{ color: 'var(--text-muted)' }}>Stay on top of your tasks.</p>
        </div>
        <button className="btn-primary" style={{ gap: '0.5rem', padding: '0.75rem 1rem' }}>
          <Plus size={20} /> New Task
        </button>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {tasks.map((task, idx) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass"
            style={{ 
              display: 'flex', alignItems: 'center', padding: '1.25rem', gap: '1rem',
              opacity: task.completed ? 0.6 : 1, transition: 'all 0.2s ease'
            }}
          >
            <div onClick={() => toggleTask(task.id)} style={{ cursor: 'pointer', color: task.completed ? 'var(--success)' : 'var(--text-muted)' }}>
              {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
            </div>
            
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, textDecoration: task.completed ? 'line-through' : 'none' }}>
                {task.title}
              </h3>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                <span style={{ color: 'var(--primary-dark)' }}>{task.category}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14} /> {task.time}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
