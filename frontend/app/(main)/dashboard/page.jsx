"use client";
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, Clock, Play, Square, Bell, Plus, Trash2, Activity, Zap, CheckCircle2, Calendar, Coffee, Inbox } from 'lucide-react';
import { reminderService, studentService, analyticsService, attendanceService } from '@/lib/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis, LineChart, Line, Legend } from 'recharts';
import {
  DashboardContainer, Header, Title, Subtitle, Section, SectionTitle, SectionTitleWhite,
  LoadingContainer, GridStats, StatCard, IconWrapper, StatLabel, StatValue,
  GridCharts, ChartCard, ChartCardTitle, ChartSubtitle, ChartContainerWrapper, HeatmapCard, Divider,
  GridWidgets, Widget, WidgetHeader, ScrollArea, EmptyStateContainer, ClassItem, TimeColumn, TimeStart, TimeEnd,
  ClassDetails, ClassCode, ClassName, ClassRoom, FocusWidget, TimerCircle, TimerSvg, TimerText,
  TimerControls, PlayButton, ResetButton, MinuteOptions, MinuteButton, ListItem, ItemTitle, ItemSubtitle,
  OutlineButton, IconButton, FormContainer, ErrorMsg, InputField, SubmitButton
} from './styles';

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

  // Analytics State
  const [weeklyData, setWeeklyData] = useState({ barData: [], pieData: [], completionRate: 0 });
  const [dailyData, setDailyData] = useState({ heatmapData: [], mostProductiveTime: "N/A" });
  const [attendanceData, setAttendanceData] = useState({ timeline: [], courses: [] });
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  const [todaysClasses, setTodaysClasses] = useState([]);

  const [uid, setUid] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [studentCpi, setStudentCpi] = useState("0.0");

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

        const wData = await analyticsService.getWeeklyAnalytics(uid);
        setWeeklyData(wData);

        const dData = await analyticsService.getDailyAnalytics(uid);
        setDailyData(dData);

        const aData = await analyticsService.getAttendanceTimeline(uid);
        setAttendanceData(aData);

        // Fetch Today's Classes & Student Data
        const student = await studentService.getStudent(uid);
        if (student) {
          setStudentName(student.fullName?.split(' ')[0] || "Student");
          setStudentCpi(student.cpi || "8.4"); // Mock or real

          if (student.branch && student.rollNo) {
            const startYear = student.rollNo.length >= 2 ? 2000 + parseInt(student.rollNo.substring(0, 2)) : 2024;
            const docId = `${student.branch}_${startYear}-${startYear + 4}`;
          try {
            const tt = await attendanceService.getTimetable(docId);
            const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long' });
            if (tt && tt.schedule && tt.schedule[todayStr]) {
              setTodaysClasses(tt.schedule[todayStr]);
            }
          } catch(e) {
            console.warn("Real timetable not found for today's classes.");
            const DUMMY_TIMETABLE = [
              { time: "09:00 - 10:00", code: "CS101", subject: "Intro to Programming", room: "Room 304" },
              { time: "10:30 - 11:30", code: "MATH201", subject: "Calculus II", room: "Lecture Hall A" },
              { time: "13:00 - 14:30", code: "PHY101", subject: "Physics Lab", room: "Lab 2" }
            ];
            const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long' });
            if (['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(todayStr)) {
              setTodaysClasses(DUMMY_TIMETABLE);
            }
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      } finally {
        setAnalyticsLoading(false);
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
      clearInterval(timerRef.current);
      setIsRunning(false);
      
      if (uid) {
        studentService.saveFocusSession(uid, initialMinutes).catch(console.error);
        setWeeklyData(prev => ({
          ...prev,
          pieData: [...prev.pieData] 
        }));
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
      setLibraryError("Failed to add book. Please try again.");
    }
  };

  // --- Reminder Logic ---
  const handleAddReminder = async (e) => {
    e.preventDefault();
    if (!newReminder.trim()) return setReminderError("Reminder cannot be empty!");
    if (!uid) return;
    setReminderError("");
    setReminders([...reminders, { _id: Date.now().toString(), title: newReminder }]);
    setNewReminder("");
  };

  const deleteReminder = async (id) => {
    setReminders(prev => prev.filter(r => r._id !== id));
  };

  const COLORS = ['#FFD700', '#FF5252', '#318CE7', '#00b8a3', '#9C27B0'];

  return (
    <DashboardContainer>
      
      {/* Header - Personalized Greeting */}
      <div style={{ marginBottom: '1rem', padding: '1.5rem', backgroundColor: '#111', border: '1px solid #FFD700', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', margin: '0 0 0.5rem 0' }}>
            Good morning, {studentName || 'Student'}! 🌻
          </h1>
          <p style={{ color: '#888', margin: 0, fontSize: '0.95rem', fontWeight: 500 }}>
            You have {reminders.length || 3} tasks due today · Attendance: {attendanceData?.timeline?.[attendanceData.timeline.length-1]?.Total || 89}% this week
          </p>
        </div>
        <button style={{ padding: '0.75rem 1.5rem', backgroundColor: '#FFD700', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
          + New Task
        </button>
      </div>

      {/* --- PRODUCTIVITY ANALYTICS SYSTEM --- */}
      <Section>
        {analyticsLoading ? (
          <LoadingContainer>
            Crunching your data...
          </LoadingContainer>
        ) : (
          <>
            {/* Top Stats Row (4 Metric Cards) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              
              {/* Card 1: Attendance */}
              <div style={{ padding: '1.5rem', backgroundColor: '#0A0A0A', border: '1px solid #222', borderRadius: '12px' }}>
                <p style={{ color: '#888', fontSize: '0.85rem', fontWeight: 600, margin: '0 0 0.5rem 0' }}>Attendance</p>
                <h3 style={{ color: '#00b8a3', fontSize: '2rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>{attendanceData?.timeline?.[attendanceData.timeline.length-1]?.Total || 89}%</h3>
                <p style={{ color: '#00b8a3', fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>↑ Safe zone</p>
              </div>

              {/* Card 2: Tasks Done */}
              <div style={{ padding: '1.5rem', backgroundColor: '#0A0A0A', border: '1px solid #222', borderRadius: '12px' }}>
                <p style={{ color: '#888', fontSize: '0.85rem', fontWeight: 600, margin: '0 0 0.5rem 0' }}>Tasks done</p>
                <h3 style={{ color: '#FFD700', fontSize: '2rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>4/7</h3>
                <p style={{ color: '#FFD700', fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>57% today</p>
              </div>

              {/* Card 3: Current GPA */}
              <div style={{ padding: '1.5rem', backgroundColor: '#0A0A0A', border: '1px solid #222', borderRadius: '12px' }}>
                <p style={{ color: '#888', fontSize: '0.85rem', fontWeight: 600, margin: '0 0 0.5rem 0' }}>Current GPA</p>
                <h3 style={{ color: '#fff', fontSize: '2rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>{studentCpi}</h3>
                <p style={{ color: '#888', fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>Last sem: 8.1</p>
              </div>

              {/* Card 4: LeetCode Streak */}
              <div style={{ padding: '1.5rem', backgroundColor: '#0A0A0A', border: '1px solid #222', borderRadius: '12px' }}>
                <p style={{ color: '#888', fontSize: '0.85rem', fontWeight: 600, margin: '0 0 0.5rem 0' }}>LeetCode streak</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>🔥</span>
                  <h3 style={{ color: '#fff', fontSize: '2rem', fontWeight: 800, margin: 0 }}>12</h3>
                </div>
                <p style={{ color: '#FF5252', fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>days</p>
              </div>

            </div>

            <Divider />

            {/* Existing Dashboard Widgets Moved Up */}
            <GridWidgets>
              
              {/* --- TODAY'S CLASSES WIDGET --- */}
              <Widget>
                <WidgetHeader>
                  <Calendar size={20} />
                  <SectionTitleWhite>Today's Classes</SectionTitleWhite>
                </WidgetHeader>
                
                <ScrollArea>
                  <AnimatePresence>
                    {todaysClasses.length === 0 ? (
                      <EmptyStateContainer initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <Coffee size={40} style={{ color: '#333', marginBottom: '0.5rem' }} />
                        <p>No classes today. Enjoy your day!</p>
                      </EmptyStateContainer>
                    ) : (
                      todaysClasses.map((cls, idx) => (
                        <ClassItem key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                          <TimeColumn>
                            <TimeStart>{cls.time.split(' - ')[0]}</TimeStart>
                            <TimeEnd>{cls.time.split(' - ')[1]}</TimeEnd>
                          </TimeColumn>
                          <ClassDetails>
                            <ClassCode>{cls.code}</ClassCode>
                            <ClassName>{cls.subject || cls.name}</ClassName>
                            <ClassRoom>
                              {cls.room && cls.room}
                            </ClassRoom>
                          </ClassDetails>
                        </ClassItem>
                      ))
                    )}
                  </AnimatePresence>
                </ScrollArea>
              </Widget>

              {/* --- FOCUS TIMER WIDGET --- */}
              <FocusWidget>
                <WidgetHeader style={{ width: '100%', marginBottom: '1rem' }}>
                  <Clock size={20} />
                  <SectionTitleWhite>Focus Timer</SectionTitleWhite>
                </WidgetHeader>
                
                <TimerCircle>
                  <TimerSvg viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#222" strokeWidth="4" />
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#FFD700" strokeWidth="4" strokeDasharray="283" strokeDashoffset={283 - (283 * (timeLeft / (initialMinutes * 60)))} style={{ transition: 'stroke-dashoffset 1s linear' }} />
                  </TimerSvg>
                  <TimerText>
                    {formatTime(timeLeft)}
                  </TimerText>
                </TimerCircle>

                <TimerControls>
                  <PlayButton onClick={toggleTimer} $isActive={isRunning}>
                    {isRunning ? <Square color="#fff" size={24} /> : <Play color="#000" size={24} style={{ marginLeft: '4px' }} />}
                  </PlayButton>
                  <ResetButton onClick={resetTimer}>
                    Reset
                  </ResetButton>
                </TimerControls>

                {!isRunning && (
                  <MinuteOptions>
                    {[15, 25, 50, 90].map(mins => (
                      <MinuteButton 
                        key={mins} 
                        onClick={() => handleSetMinutes(mins)} 
                        $isActive={initialMinutes === mins}
                      >
                        {mins >= 60 ? `${mins / 60}h` : `${mins}m`}
                      </MinuteButton>
                    ))}
                  </MinuteOptions>
                )}
              </FocusWidget>

              {/* --- LIBRARY DUE DATES WIDGET --- */}
              <Widget>
                <WidgetHeader>
                  <Book size={20} />
                  <SectionTitleWhite>Library Due Dates</SectionTitleWhite>
                </WidgetHeader>

                <ScrollArea style={{ maxHeight: '300px' }}>
                  <AnimatePresence>
                    {libraryBooks.length === 0 ? (
                      <EmptyStateContainer initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <Book size={40} style={{ color: '#333', marginBottom: '0.5rem' }} />
                        <p>No books borrowed currently.</p>
                      </EmptyStateContainer>
                    ) : (
                      libraryBooks.map(book => {
                        const isUrgent = new Date(book.dueDate).getTime() - Date.now() < 86400000 * 2;
                        return (
                          <ListItem key={book._id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, scale: 0.9, height: 0 }}>
                            <div>
                              <ItemTitle>{book.title}</ItemTitle>
                              <ItemSubtitle $isUrgent={isUrgent}>Due: {new Date(book.dueDate).toLocaleDateString()}</ItemSubtitle>
                            </div>
                            <OutlineButton onClick={() => handleReturnBook(book._id)}>Return</OutlineButton>
                          </ListItem>
                        )
                      })
                    )}
                  </AnimatePresence>
                </ScrollArea>

                <FormContainer onSubmit={handleAddBook}>
                  {libraryError && <ErrorMsg>{libraryError}</ErrorMsg>}
                  <InputField type="text" value={newBookTitle} onChange={e => { setNewBookTitle(e.target.value); setLibraryError(""); }} onBlur={() => setLibraryError("")} placeholder="Book Title..." style={{ flex: 2, minWidth: '150px' }} />
                  <InputField type="date" value={newBookDays} onChange={e => { setNewBookDays(e.target.value); setLibraryError(""); }} onBlur={() => setLibraryError("")} style={{ flex: 1, minWidth: '120px' }} />
                  <SubmitButton type="submit"><Plus size={20} strokeWidth={3} /></SubmitButton>
                </FormContainer>
              </Widget>

              {/* --- SMART REMINDERS WIDGET --- */}
              <Widget>
                <WidgetHeader>
                  <Bell size={20} />
                  <SectionTitleWhite>Reminders</SectionTitleWhite>
                </WidgetHeader>

                <ScrollArea style={{ maxHeight: '300px' }}>
                  <AnimatePresence>
                    {reminders.length === 0 ? (
                      <EmptyStateContainer initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <Inbox size={40} style={{ color: '#333', marginBottom: '0.5rem' }} />
                        <p>You are all caught up!</p>
                      </EmptyStateContainer>
                    ) : (
                      reminders.map(rem => (
                        <ListItem key={rem._id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                          <ItemTitle style={{ margin: 0 }}>{rem.title}</ItemTitle>
                          <IconButton onClick={() => deleteReminder(rem._id)}><Trash2 size={18} /></IconButton>
                        </ListItem>
                      ))
                    )}
                  </AnimatePresence>
                </ScrollArea>

                <FormContainer onSubmit={handleAddReminder}>
                  {reminderError && <ErrorMsg>{reminderError}</ErrorMsg>}
                  <InputField type="text" value={newReminder} onChange={e => { setNewReminder(e.target.value); setReminderError(""); }} onBlur={() => setReminderError("")} placeholder="Add a reminder..." style={{ flex: 1 }} />
                  <SubmitButton type="submit"><Plus size={20} strokeWidth={3} /></SubmitButton>
                </FormContainer>

              </Widget>

            </GridWidgets>

            <Divider />

            {/* Charts Row */}
            <GridCharts>
              
              {/* Weekly Velocity Chart */}
              <ChartCard>
                <ChartCardTitle>Weekly Task Velocity</ChartCardTitle>
                <ChartContainerWrapper>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData.barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis dataKey="name" stroke="#666" tick={{ fill: '#888', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis stroke="#666" tick={{ fill: '#888', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <Tooltip cursor={{ fill: '#1A1A1A' }} contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff' }} />
                      <Bar dataKey="tasks" fill="#FFD700" radius={[4, 4, 0, 0]} barSize={30} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainerWrapper>
              </ChartCard>

              {/* Subject Distribution Chart */}
              <ChartCard>
                <ChartCardTitle>Focus Distribution (Hours)</ChartCardTitle>
                <ChartContainerWrapper>
                  {weeklyData.pieData.length === 0 ? (
                    <EmptyStateContainer style={{ padding: 0 }}>No focus sessions recorded this week.</EmptyStateContainer>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={weeklyData.pieData} innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value" stroke="none">
                          {weeklyData.pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </ChartContainerWrapper>
                {/* Custom Legend */}
                {weeklyData.pieData.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
                    {weeklyData.pieData.map((entry, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#aaa' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: COLORS[idx % COLORS.length] }}></div>
                        {entry.name} ({entry.value}h)
                      </div>
                    ))}
                  </div>
                )}
              </ChartCard>

            </GridCharts>

            {/* Daily Heatmap / Scatter */}
            <HeatmapCard>
              <ChartCardTitle>30-Day Activity Heatmap</ChartCardTitle>
              <ChartContainerWrapper>
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 0, left: -20 }}>
                    <XAxis type="category" dataKey="hour" name="Time" stroke="#666" tick={{ fill: '#888', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis type="number" dataKey="activity" name="Activity" hide />
                    <ZAxis type="number" dataKey="activity" range={[20, 400]} />
                    <Tooltip cursor={{ strokeDasharray: '3 3', stroke: '#333' }} contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff' }} />
                    <Scatter data={dailyData.heatmapData} fill="#318CE7" shape="circle" />
                  </ScatterChart>
                </ResponsiveContainer>
              </ChartContainerWrapper>
            </HeatmapCard>

            {/* Smart Attendance Graph */}
            <ChartCard>
              <ChartCardTitle style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Smart Attendance Timeline</span>
                <ChartSubtitle>YTD Trend (Proportional Absence)</ChartSubtitle>
              </ChartCardTitle>
              <ChartContainerWrapper>
                {!attendanceData.timeline || attendanceData.timeline.length === 0 ? (
                  <EmptyStateContainer>No timetable data found.</EmptyStateContainer>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={attendanceData.timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis dataKey="name" stroke="#666" tick={{ fill: '#888', fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} />
                      <YAxis stroke="#666" tick={{ fill: '#888', fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff' }}
                        formatter={(value) => [`${value}%`]} 
                      />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#888', paddingTop: '10px' }} />
                      {attendanceData.courses.map((course, idx) => (
                        <Line 
                          key={course} 
                          type="monotone" 
                          dataKey={course} 
                          stroke={COLORS[idx % COLORS.length]} 
                          strokeWidth={3}
                          dot={{ r: 2, fill: COLORS[idx % COLORS.length] }}
                          activeDot={{ r: 6 }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </ChartContainerWrapper>
            </ChartCard>
          </>
        )}
      </Section>
    </DashboardContainer>
  );
}
