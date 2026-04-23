"use client";
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { attendanceService, studentService, plannerService } from '@/lib/api';
import { ChevronDown, ChevronUp, User, MapPin, AlignLeft, CheckCircle2, CalendarOff } from 'lucide-react';
import {
  Container, Header, Title, Subtitle, DaySelector, DayButton, ClassList,
  LoadingState, EmptyState, ClassCard, CardHeader, TimeBlock, TimeStart, TimeArrow, TimeEnd,
  InfoBlock, Badges, CodeBadge, TasksBadge, SubjectTitle, MetaInfo, MetaItem,
  AttendanceBlock, AttendanceLabel, AttendancePercent, AttendanceFraction,
  ChevronBlock, ExpandedContentContainer, ExpandedContent, ExpandedDivider,
  NotesGrid, NotesCard, NotesTitle, NotesText, TasksList, TaskItem, TaskTitle, TaskPriority,
  ControlsBlock, LockedWarning, LockedText, MarkedToday, MarkedText, UndoButton,
  ActionButtons, PresentButton, AbsentButton, WarningTag
} from './styles';

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function TimetablePage() {
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [timetable, setTimetable] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [plannerTasks, setPlannerTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedClassIdx, setExpandedClassIdx] = useState(null);

  const DUMMY_TIMETABLE = [
    { time: "09:00 - 10:00", code: "CS101", subject: "Intro to Programming", teacher: "Dr. Alan Turing", room: "Room 304", notes: "Bring your laptop. Ensure Node.js is installed." },
    { time: "10:30 - 11:30", code: "MATH201", subject: "Calculus II", teacher: "Prof. Newton", room: "Lecture Hall A", notes: "Read chapter 4 on integration techniques." },
    { time: "13:00 - 14:30", code: "PHY101", subject: "Physics Lab", teacher: "Dr. Feynman", room: "Lab 2", notes: "Safety goggles and lab coat required." },
  ];

  const [uid, setUid] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUid(localStorage.getItem('uid'));
      const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long' });
      if (DAYS.includes(todayStr)) {
        setSelectedDay(todayStr);
      }
    }
  }, []);

  useEffect(() => {
    if (!uid) return;

    const fetchData = async () => {
      try {
        const student = await studentService.getStudent(uid);
        let docId = 'DUMMY';
        if (student && student.branch && student.rollNo) {
          const startYear = student.rollNo.length >= 2 ? 2000 + parseInt(student.rollNo.substring(0, 2)) : 2024;
          docId = `${student.branch}_${startYear}-${startYear + 4}`;
        }

        try {
          const tt = await attendanceService.getTimetable(docId);
          if (tt && tt.schedule && tt.schedule[selectedDay]) {
            setTimetable(tt.schedule[selectedDay]);
          } else {
            setTimetable(DUMMY_TIMETABLE);
          }
        } catch (e) {
          console.warn("Real timetable not found, using dummy data.");
          setTimetable(DUMMY_TIMETABLE);
        }

        const attRecords = await attendanceService.getAttendance(uid);
        const attMap = {};
        attRecords.forEach(rec => { attMap[rec.courseCode] = rec; });
        setAttendanceRecords(attMap);

        const tasks = await plannerService.getTasks(uid);
        setPlannerTasks(tasks);
        
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setTimetable(DUMMY_TIMETABLE);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [uid, selectedDay]);

  const handleAttendance = async (courseCode, isPresent) => {
    if (!uid) return;
    const currentDateStr = new Date().toISOString().split('T')[0];

    const prevRecord = attendanceRecords[courseCode] || { attended: 0, total: 0 };
    const updatedRecord = {
      ...prevRecord,
      total: prevRecord.total + 1,
      attended: isPresent ? prevRecord.attended + 1 : prevRecord.attended,
      [selectedDay]: (prevRecord[selectedDay] || 0) + 1,
      lastMarkedDate: currentDateStr,
      lastMarkedStatus: isPresent ? "present" : "absent"
    };

    setAttendanceRecords({ ...attendanceRecords, [courseCode]: updatedRecord });

    try {
      await attendanceService.updateAttendance(uid, courseCode, updatedRecord);
    } catch (error) {
      console.error("Failed to update attendance:", error);
      setAttendanceRecords({ ...attendanceRecords, [courseCode]: prevRecord });
    }
  };

  const handleUndoAttendance = async (courseCode) => {
    if (!uid) return;
    const prevRecord = attendanceRecords[courseCode];
    if (!prevRecord) return;

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

    setAttendanceRecords({ ...attendanceRecords, [courseCode]: updatedRecord });

    try {
      await attendanceService.updateAttendance(uid, courseCode, updatedRecord);
    } catch (error) {
      console.error("Failed to undo attendance:", error);
      setAttendanceRecords({ ...attendanceRecords, [courseCode]: prevRecord });
    }
  };

  const calculatePercentage = (attended, total) => {
    if (total === 0) return 0;
    return Math.round((attended / total) * 100);
  };

  const getRelatedTasks = (cls) => {
    if (!cls.code && !cls.subject && !cls.name) return [];
    
    return plannerTasks.filter(task => {
      const categoryMatch = task.description?.match(/Category:\s*(.+)/);
      const category = categoryMatch ? categoryMatch[1].trim().toLowerCase() : '';
      const taskTitle = task.title.toLowerCase();
      
      const classCode = (cls.code || '').toLowerCase();
      const className = (cls.subject || cls.name || '').toLowerCase();

      return (
        (classCode && category.includes(classCode)) ||
        (className && category.includes(className)) ||
        (classCode && taskTitle.includes(classCode)) ||
        (className && taskTitle.includes(className))
      );
    });
  };

  return (
    <Container>
      <Header>
        <Title>Weekly Schedule</Title>
        <Subtitle>Manage your attendance and track class-specific tasks.</Subtitle>
      </Header>

      <DaySelector>
        {DAYS.map(day => (
          <DayButton
            key={day}
            onClick={() => { setSelectedDay(day); setExpandedClassIdx(null); }}
            $isActive={selectedDay === day}
          >
            {day}
          </DayButton>
        ))}
      </DaySelector>

      <ClassList>
        <AnimatePresence>
          {isLoading ? (
            <LoadingState key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              Loading schedule...
            </LoadingState>
          ) : timetable.length === 0 ? (
            <EmptyState key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <CalendarOff size={48} color="#333" />
              No classes scheduled for {selectedDay}. Enjoy your day!
            </EmptyState>
          ) : (
            timetable.map((cls, idx) => {
              const att = attendanceRecords[cls.code] || { attended: 0, total: 0 };
              const percent = calculatePercentage(att.attended, att.total);
              const isExpanded = expandedClassIdx === idx;
              const relatedTasks = getRelatedTasks(cls);
              const isCurrentDay = selectedDay === new Date().toLocaleDateString('en-US', { weekday: 'long' });

              const COLORS = ['#FFD700', '#FF5252', '#318CE7', '#00b8a3', '#9C27B0'];
              const accentColor = COLORS[idx % COLORS.length];

              return (
                <ClassCard
                  key={`${selectedDay}-${idx}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  $isExpanded={isExpanded}
                  $color={accentColor}
                >
                  <CardHeader onClick={() => setExpandedClassIdx(isExpanded ? null : idx)}>
                    <TimeBlock>
                      <TimeStart>{cls.time.split(' - ')[0]}</TimeStart>
                      <TimeArrow>↓</TimeArrow>
                      <TimeEnd>{cls.time.split(' - ')[1]}</TimeEnd>
                    </TimeBlock>

                    <InfoBlock>
                      <Badges>
                        <CodeBadge>{cls.code}</CodeBadge>
                        {relatedTasks.length > 0 && (
                          <TasksBadge>
                            <CheckCircle2 size={14} /> {relatedTasks.length} Tasks
                          </TasksBadge>
                        )}
                      </Badges>
                      <SubjectTitle>{cls.subject || cls.name}</SubjectTitle>
                      <MetaInfo>
                        {cls.room && <MetaItem><MapPin size={16} /> {cls.room}</MetaItem>}
                        {cls.teacher && <MetaItem><User size={16} /> {cls.teacher}</MetaItem>}
                      </MetaInfo>
                    </InfoBlock>

                    <AttendanceBlock>
                      <AttendanceLabel>Attendance</AttendanceLabel>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                        <AttendancePercent $percent={percent}>
                          {percent}%
                        </AttendancePercent>
                        <AttendanceFraction>({att.attended}/{att.total})</AttendanceFraction>
                      </div>
                      <WarningTag $isLow={percent < 75 && att.total > 0}>
                        {percent < 75 && att.total > 0 ? '⚠️ Low' : '✅ Safe'}
                      </WarningTag>
                    </AttendanceBlock>

                    <ControlsBlock style={{ marginLeft: '1rem' }} onClick={(e) => e.stopPropagation()}>
                      {!isCurrentDay ? (
                        <LockedWarning>
                          <LockedText>🔒</LockedText>
                        </LockedWarning>
                      ) : att.lastMarkedDate === new Date().toISOString().split('T')[0] ? (
                        <MarkedToday>
                          <MarkedText>✅</MarkedText>
                          <UndoButton onClick={(e) => { e.stopPropagation(); handleUndoAttendance(cls.code); }}>
                            Undo
                          </UndoButton>
                        </MarkedToday>
                      ) : (
                        <ActionButtons style={{ flexDirection: 'column', gap: '0.5rem' }}>
                          <PresentButton style={{ padding: '0.5rem 1.5rem', fontSize: '0.85rem' }} onClick={(e) => { e.stopPropagation(); handleAttendance(cls.code, true); }}>
                            Present
                          </PresentButton>
                          <AbsentButton style={{ padding: '0.5rem 1.5rem', fontSize: '0.85rem' }} onClick={(e) => { e.stopPropagation(); handleAttendance(cls.code, false); }}>
                            Absent
                          </AbsentButton>
                        </ActionButtons>
                      )}
                    </ControlsBlock>

                    <ChevronBlock $isExpanded={isExpanded}>
                      {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                    </ChevronBlock>
                  </CardHeader>

                  <AnimatePresence>
                    {isExpanded && (
                      <ExpandedContentContainer
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                      >
                        <ExpandedContent>
                          <ExpandedDivider>
                            
                            {(cls.notes || relatedTasks.length > 0) && (
                              <NotesGrid>
                                {cls.notes && (
                                  <NotesCard>
                                    <NotesTitle>
                                      <AlignLeft size={18} color="#FFD700" /> Class Notes
                                    </NotesTitle>
                                    <NotesText>{cls.notes}</NotesText>
                                  </NotesCard>
                                )}

                                {relatedTasks.length > 0 && (
                                  <NotesCard>
                                    <NotesTitle>
                                      <CheckCircle2 size={18} color="#00b8a3" /> Related Tasks
                                    </NotesTitle>
                                    <TasksList>
                                      {relatedTasks.map(task => (
                                        <TaskItem key={task._id}>
                                          <TaskTitle $isCompleted={task.isCompleted}>
                                            {task.title}
                                          </TaskTitle>
                                          <TaskPriority $priority={task.priority}>
                                            {task.priority}
                                          </TaskPriority>
                                        </TaskItem>
                                      ))}
                                    </TasksList>
                                  </NotesCard>
                                )}
                              </NotesGrid>
                            )}
                          </ExpandedDivider>
                        </ExpandedContent>
                      </ExpandedContentContainer>
                    )}
                  </AnimatePresence>
                </ClassCard>
              );
            })
          )}
        </AnimatePresence>
      </ClassList>
    </Container>
  );
}
