"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, Clock, Plus, X, Trash2 } from 'lucide-react';
import { plannerService } from '@/lib/api';

export default function PlannerPage() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState("Homework");
  const [newTaskTime, setNewTaskTime] = useState("");
  const [taskError, setTaskError] = useState("");

  const [uid, setUid] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUid(localStorage.getItem('uid'));
    }
  }, []);
  // Fetch Tasks
  useEffect(() => {
    if (!uid) return;
    const fetchTasks = async () => {
      try {
        const data = await plannerService.getTasks(uid);
        setTasks(data);
      } catch (error) {
        console.error("Failed to fetch planner tasks", error);
      }
    };
    fetchTasks();
  }, [uid]);

  const toggleTask = async (id, currentCompletedStatus) => {
    if (!uid) return;
    
    // Optimistic UI update
    setTasks(tasks.map(t => t._id === id ? { ...t, isCompleted: !currentCompletedStatus } : t));
    
    try {
      await plannerService.updateTask(uid, id, { isCompleted: !currentCompletedStatus });
    } catch (error) {
      console.error("Failed to update task", error);
      // Revert if failed
      setTasks(tasks.map(t => t._id === id ? { ...t, isCompleted: currentCompletedStatus } : t));
    }
  };

  const handleDeleteTask = async (e, id) => {
    e.stopPropagation(); // prevent toggling completion
    if (!uid) return;

    try {
      await plannerService.deleteTask(uid, id);
      setTasks(tasks.filter(t => t._id !== id));
    } catch (error) {
      console.error("Failed to delete task", error);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !newTaskTime.trim()) {
      setTaskError("Title and Time are required!");
      return;
    }
    if (!uid) return;
    
    setTaskError("");
    
    try {
      const newTask = await plannerService.addTask(uid, {
        title: newTaskTitle,
        dueDate: new Date(), // We might want to parse newTaskTime properly, but for now we'll send current date and rely on title/desc
        description: `Time: ${newTaskTime} | Category: ${newTaskCategory}`,
        isCompleted: false
      });

      // The backend model (PlannerTask) has title and description but not "category" explicitly.
      // So we store category in description. We'll map it to UI fields:
      const mappedTask = {
        ...newTask,
        category: newTaskCategory,
        time: newTaskTime
      };

      setTasks([mappedTask, ...tasks]);
      setNewTaskTitle("");
      setNewTaskTime("");
      setNewTaskCategory("Homework");
      setShowForm(false);
    } catch (error) {
      console.error("Failed to add planner task:", error);
      setTaskError("Failed to add task. Please try again.");
    }
  };

  // Helper to parse the description back to category/time if it came from DB
  const parseTask = (task) => {
    if (task.category && task.time) return task; // already mapped locally
    
    let category = "Task";
    let time = new Date(task.dueDate).toLocaleDateString();
    
    if (task.description && task.description.includes('|')) {
      const parts = task.description.split('|');
      time = parts[0].replace('Time: ', '').trim();
      category = parts[1].replace('Category: ', '').trim();
    }
    
    return { ...task, category, time };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>Daily Planner</h1>
          <p style={{ color: 'var(--text-muted)' }}>Stay on top of your tasks.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary" style={{ gap: '0.5rem', padding: '0.75rem 1rem' }}>
          {showForm ? <X size={20} /> : <Plus size={20} />} 
          {showForm ? 'Cancel' : 'New Task'}
        </button>
      </header>

      <AnimatePresence>
        {showForm && (
          <motion.form 
            initial={{ opacity: 0, height: 0, scale: 0.95 }}
            animate={{ opacity: 1, height: 'auto', scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.95 }}
            onSubmit={handleAddTask}
            className="glass"
            style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', overflow: 'hidden' }}
          >
            {taskError && (
              <div style={{ color: 'var(--danger)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '-0.5rem' }}>
                {taskError}
              </div>
            )}
            
            <input 
              type="text" 
              value={newTaskTitle} 
              onChange={e => { setNewTaskTitle(e.target.value); setTaskError(""); }}
              onBlur={() => setTaskError("")}
              placeholder="Task Title (e.g. Finish Math Assignment)" 
              className="input-premium" 
              style={{ borderColor: taskError ? 'var(--danger)' : 'rgba(0,0,0,0.1)' }}
            />
            
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <input 
                type="text" 
                value={newTaskTime} 
                onChange={e => { setNewTaskTime(e.target.value); setTaskError(""); }}
                onBlur={() => setTaskError("")}
                placeholder="Time (e.g. 2:00 PM or Tomorrow)" 
                className="input-premium" 
                style={{ flex: 1, borderColor: taskError ? 'var(--danger)' : 'rgba(0,0,0,0.1)' }}
              />
              <select 
                value={newTaskCategory} 
                onChange={e => setNewTaskCategory(e.target.value)}
                className="input-premium"
                style={{ flex: 1, appearance: 'none', cursor: 'pointer' }}
              >
                <option value="Homework">Homework</option>
                <option value="Reading">Reading</option>
                <option value="Project">Project</option>
                <option value="Exam Prep">Exam Prep</option>
                <option value="Personal">Personal</option>
              </select>
            </div>
            
            <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}>
              Add to Planner
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <AnimatePresence>
          {tasks.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '2rem' }}>No tasks found. Create one above!</p>
          ) : (
            tasks.map((rawTask, idx) => {
              const task = parseTask(rawTask);
              return (
                <motion.div
                  key={task._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.05 }}
                  className="glass"
                  style={{ 
                    display: 'flex', alignItems: 'center', padding: '1.25rem', gap: '1rem',
                    opacity: task.isCompleted ? 0.6 : 1, transition: 'all 0.2s ease'
                  }}
                >
                  <div onClick={() => toggleTask(task._id, task.isCompleted)} style={{ cursor: 'pointer', color: task.isCompleted ? 'var(--success)' : 'var(--text-muted)' }}>
                    {task.isCompleted ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, textDecoration: task.isCompleted ? 'line-through' : 'none' }}>
                      {task.title}
                    </h3>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      <span style={{ color: 'var(--primary-dark)' }}>{task.category}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14} /> {task.time}</span>
                    </div>
                  </div>

                  <button onClick={(e) => handleDeleteTask(e, task._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                    <Trash2 size={20} />
                  </button>
                </motion.div>
              )
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
