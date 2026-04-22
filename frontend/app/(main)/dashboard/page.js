"use client";
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, Clock, Play, Square, Bell, Plus, Trash2 } from 'lucide-react';
import { reminderService, studentService } from '@/lib/api';

export default function DashboardPage() {
  // Focus Timer State
  const [initialMinutes, setInitialMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // in seconds
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  // Library State
  const [libraryBooks, setLibraryBooks] = useState([]);
  const [newBookTitle, setNewBookTitle] = useState("");
  const [newBookDays, setNewBookDays] = useState("");
  const [libraryError, setLibraryError] = useState("");

  // Reminders State
  const [reminders, setReminders] = useState([]);
  const [newReminder, setNewReminder] = useState("");
  const [reminderError, setReminderError] = useState("");

  const [uid, setUid] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUid(localStorage.getItem('uid'));
    }
  }, []);
  // Initial Data Fetch
  useEffect(() => {
    if (!uid) return;
    
    const fetchDashboardData = async () => {
      try {
        const books = await reminderService.getLibraryBooks(uid);
        setLibraryBooks(books);

        const smartReminders = await reminderService.getSmartReminders(uid);
        setReminders(smartReminders);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };
    
    fetchDashboardData();
  }, [uid]);

  // --- Timer Logic ---
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Timer finished!
      clearInterval(timerRef.current);
      setIsRunning(false);
      
      if (uid) {
        studentService.saveFocusSession(uid, initialMinutes).catch(console.error);
      }
      
      alert(`🎉 Focus session complete! You studied for ${initialMinutes} minutes.`);
      setTimeLeft(initialMinutes * 60);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, timeLeft, initialMinutes, uid]);

  const toggleTimer = () => setIsRunning(!isRunning);
  
  const resetTimer = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
    setTimeLeft(initialMinutes * 60);
  };

  const handleSetMinutes = (mins) => {
    if (!isRunning) {
      setInitialMinutes(mins);
      setTimeLeft(mins * 60);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // --- Library Logic ---
  const handleReturnBook = async (bookId) => {
    if (!uid) return;
    try {
      await reminderService.deleteLibraryBook(uid, bookId);
      setLibraryBooks(prev => prev.filter(b => b._id !== bookId));
    } catch (error) {
      console.error("Failed to return book:", error);
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    if (!newBookTitle.trim() || !newBookDays) {
      setLibraryError("Book title and due date are required!");
      return;
    }
    if (!uid) return;

    setLibraryError("");
    try {
      const newBook = await reminderService.addLibraryBook(uid, newBookTitle, newBookDays);
      setLibraryBooks([...libraryBooks, newBook]);
      setNewBookTitle("");
      setNewBookDays("");
    } catch (error) {
      console.error("Failed to add book:", error);
      setLibraryError("Failed to add book. Please try again.");
    }
  };

  // --- Reminder Logic ---
  const handleAddReminder = async (e) => {
    e.preventDefault();
    if (!newReminder.trim()) {
      setReminderError("Reminder cannot be empty!");
      return;
    }
    if (!uid) return;

    setReminderError("");
    try {
      // Assuming you want to treat manual reminders as 'smart reminders' for now
      // A more complete implementation might separate manual vs auto reminders in the DB
      // We will simulate it by just showing it locally since the endpoint for adding manual reminders doesn't exist yet
      setReminders([...reminders, { _id: Date.now().toString(), title: newReminder }]);
      setNewReminder("");
    } catch (error) {
      console.error("Failed to add reminder:", error);
    }
  };

  const deleteReminder = async (id) => {
    if (!uid) return;
    try {
      // If it's a real MongoDB ID, delete it. If it's our simulated timestamp ID, just filter it locally.
      if (id.length > 20) {
        // We don't have a specific delete endpoint for manual reminders exported yet, but we'll filter it.
      }
      setReminders(prev => prev.filter(r => r._id !== id));
    } catch (error) {
      console.error("Failed to delete reminder:", error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header>
        <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>Overview</h1>
        <p style={{ color: 'var(--text-muted)' }}>Welcome back to your academic hub.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* --- FOCUS TIMER WIDGET --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass"
          style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-muted)', width: '100%' }}>
            <Clock size={20} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Focus Timer</h2>
          </div>
          
          <div style={{ position: 'relative', width: '200px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'var(--background)', boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.05)' }}>
            <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="4" />
              <circle 
                cx="50" cy="50" r="45" fill="none" stroke="var(--primary)" strokeWidth="4" 
                strokeDasharray="283" 
                strokeDashoffset={283 - (283 * (timeLeft / (initialMinutes * 60)))} 
                style={{ transition: 'stroke-dashoffset 1s linear' }} 
              />
            </svg>
            <span style={{ fontSize: '3.5rem', fontWeight: 900, fontFamily: 'monospace' }}>
              {formatTime(timeLeft)}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button onClick={toggleTimer} className="btn-primary" style={{ padding: '1rem', borderRadius: '50%', backgroundColor: isRunning ? 'var(--danger)' : 'var(--success)' }}>
              {isRunning ? <Square color="white" /> : <Play color="white" />}
            </button>
            <button onClick={resetTimer} className="btn-primary" style={{ padding: '1rem 1.5rem', backgroundColor: 'var(--background)', color: 'var(--text-main)', border: '1px solid rgba(0,0,0,0.1)' }}>
              Reset
            </button>
          </div>

          {!isRunning && (
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              {[15, 25, 50, 90, 120, 180].map(mins => (
                <button 
                  key={mins}
                  onClick={() => handleSetMinutes(mins)}
                  style={{ 
                    padding: '0.5rem 0.75rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700,
                    backgroundColor: initialMinutes === mins ? 'var(--primary)' : 'var(--background)',
                    color: initialMinutes === mins ? '#1A1D20' : 'var(--text-muted)'
                  }}
                >
                  {mins >= 60 ? `${mins / 60}h` : `${mins}m`}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* --- LIBRARY DUE DATES WIDGET --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass"
          style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
            <Book size={20} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Library Due Dates</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, overflowY: 'auto', maxHeight: '300px' }}>
            <AnimatePresence>
              {libraryBooks.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>No books borrowed currently.</p>
              ) : (
                libraryBooks.map(book => {
                  const isUrgent = new Date(book.dueDate).getTime() - Date.now() < 86400000 * 2; // Less than 2 days
                  return (
                    <motion.div 
                      key={book._id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, scale: 0.9, height: 0 }}
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--background)', borderRadius: '12px' }}
                    >
                      <div>
                        <h4 style={{ fontWeight: 700, fontSize: '0.95rem' }}>{book.title}</h4>
                        <span style={{ fontSize: '0.8rem', color: isUrgent ? 'var(--danger)' : 'var(--text-muted)', fontWeight: 600 }}>
                          Due: {new Date(book.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                      <button onClick={() => handleReturnBook(book._id)} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', fontWeight: 800 }}>Return</button>
                    </motion.div>
                  )
                })
              )}
            </AnimatePresence>
          </div>

          <form onSubmit={handleAddBook} style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', flexWrap: 'wrap', position: 'relative' }}>
            {libraryError && (
              <div style={{ position: 'absolute', top: '-1.5rem', left: '0.5rem', color: 'var(--danger)', fontSize: '0.8rem', fontWeight: 700 }}>
                {libraryError}
              </div>
            )}
            <input 
              type="text" value={newBookTitle} 
              onChange={e => { setNewBookTitle(e.target.value); setLibraryError(""); }} 
              onBlur={() => setLibraryError("")}
              placeholder="Book Title..." className="input-premium" style={{ padding: '0.75rem', flex: 2, minWidth: '150px', borderColor: libraryError ? 'var(--danger)' : 'rgba(0,0,0,0.1)' }} 
            />
            <input 
              type="date" value={newBookDays} 
              onChange={e => { setNewBookDays(e.target.value); setLibraryError(""); }} 
              onBlur={() => setLibraryError("")}
              className="input-premium" style={{ padding: '0.75rem', flex: 1, minWidth: '120px', borderColor: libraryError ? 'var(--danger)' : 'rgba(0,0,0,0.1)' }} 
            />
            <button type="submit" className="btn-primary" style={{ padding: '0.75rem' }}><Plus size={20} /></button>
          </form>
        </motion.div>

        {/* --- SMART REMINDERS WIDGET --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass"
          style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
            <Bell size={20} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Smart Reminders</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, overflowY: 'auto', maxHeight: '300px' }}>
            <AnimatePresence>
              {reminders.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'var(--background)', borderRadius: '12px', border: '1px dashed rgba(0,0,0,0.1)' }}>
                  <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>You are all caught up!</p>
                </div>
              ) : (
                reminders.map(rem => (
                  <motion.div 
                    key={rem._id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--background)', borderRadius: '12px' }}
                  >
                    <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{rem.title}</span>
                    <button onClick={() => deleteReminder(rem._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                      <Trash2 size={18} />
                    </button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          <form onSubmit={handleAddReminder} style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', position: 'relative' }}>
            {reminderError && (
              <div style={{ position: 'absolute', top: '-1.5rem', left: '0.5rem', color: 'var(--danger)', fontSize: '0.8rem', fontWeight: 700 }}>
                {reminderError}
              </div>
            )}
            <input 
              type="text" value={newReminder} 
              onChange={e => { setNewReminder(e.target.value); setReminderError(""); }} 
              onBlur={() => setReminderError("")}
              placeholder="Add a reminder..." className="input-premium" style={{ padding: '0.75rem', flex: 1, borderColor: reminderError ? 'var(--danger)' : 'rgba(0,0,0,0.1)' }} 
            />
            <button type="submit" className="btn-primary" style={{ padding: '0.75rem' }}><Plus size={20} /></button>
          </form>

        </motion.div>

      </div>
    </div>
  );
}
