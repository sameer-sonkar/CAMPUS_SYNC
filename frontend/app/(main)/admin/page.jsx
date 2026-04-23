"use client";
import { useState, useEffect } from 'react';
import { studentService, attendanceService } from '@/lib/api';
import { Container, Header, Title, Subtitle, ConfigPanel, FormGroup, Label, Select, LoadBtn, BuilderPanel, BuilderHeader, BuilderTitle, TargetBadge, DaysTabs, DayBtn, ClassesList, EmptyDay, ClassRow, InputSmall, DeleteBtn, AddClassBtn, PublishBtn } from './styles';

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const [branch, setBranch] = useState('CSE');
  const [batchYear, setBatchYear] = useState('2024');
  
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

  const loadExistingTimetable = async (silent = false) => {
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
        if (!silent) alert(`Loaded existing timetable for ${docId}`);
      } else {
        if (!silent) alert("No existing timetable found. You can start fresh.");
        setSchedule({ Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: [] });
      }
    } catch (error) {
      if (!silent) alert("No existing timetable found. Start fresh.");
      setSchedule({ Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: [] });
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadExistingTimetable(true);
    }
  }, [isAdmin, branch, batchYear]);

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

  if (loading) return <div style={{ padding: '2rem', color: '#888' }}>Loading Admin Portal...</div>;
  if (!isAdmin) return <div style={{ padding: '2rem', color: '#FF5252', fontWeight: 700 }}>Access Denied. You must be an Admin.</div>;

  return (
    <Container>
      <Header>
        <Title>Admin Portal</Title>
        <Subtitle>Globally manage Timetables and Courses for all students.</Subtitle>
      </Header>

      <ConfigPanel initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <FormGroup>
          <Label>Branch</Label>
          <Select value={branch} onChange={e => setBranch(e.target.value)}>
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
          </Select>
        </FormGroup>
        <FormGroup>
          <Label>Batch Start Year</Label>
          <Select value={batchYear} onChange={e => setBatchYear(e.target.value)}>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
          </Select>
        </FormGroup>
        <LoadBtn onClick={loadExistingTimetable}>
          Load Existing
        </LoadBtn>
      </ConfigPanel>

      <BuilderPanel>
        <BuilderHeader>
          <BuilderTitle>Timetable Builder</BuilderTitle>
          <TargetBadge>
            Targeting: {branch}_{batchYear}-{parseInt(batchYear) + 4}
          </TargetBadge>
        </BuilderHeader>

        <DaysTabs>
          {DAYS.map(day => (
            <DayBtn
              key={day}
              onClick={() => setSelectedDay(day)}
              $isActive={selectedDay === day}
            >
              {day}
            </DayBtn>
          ))}
        </DaysTabs>

        <ClassesList>
          {schedule[selectedDay]?.length === 0 ? (
            <EmptyDay>
              No classes scheduled for {selectedDay}.
            </EmptyDay>
          ) : (
            schedule[selectedDay].map((cls, idx) => (
              <ClassRow key={idx}>
                <div style={{ flex: 1, minWidth: '100px' }}>
                  <Label style={{ fontSize: '0.75rem' }}>Time</Label>
                  <InputSmall type="text" value={cls.time} onChange={(e) => handleUpdateClass(idx, 'time', e.target.value)} />
                </div>
                <div style={{ flex: 1, minWidth: '80px' }}>
                  <Label style={{ fontSize: '0.75rem' }}>Code</Label>
                  <InputSmall type="text" value={cls.code} onChange={(e) => handleUpdateClass(idx, 'code', e.target.value)} />
                </div>
                <div style={{ flex: 2, minWidth: '150px' }}>
                  <Label style={{ fontSize: '0.75rem' }}>Name</Label>
                  <InputSmall type="text" value={cls.name} onChange={(e) => handleUpdateClass(idx, 'name', e.target.value)} />
                </div>
                <div style={{ flex: 1, minWidth: '100px' }}>
                  <Label style={{ fontSize: '0.75rem' }}>Room</Label>
                  <InputSmall type="text" value={cls.room} onChange={(e) => handleUpdateClass(idx, 'room', e.target.value)} />
                </div>
                <DeleteBtn onClick={() => handleDeleteClass(idx)}>
                  Delete
                </DeleteBtn>
              </ClassRow>
            ))
          )}
        </ClassesList>

        <AddClassBtn onClick={handleAddClass}>
          + Add Class to {selectedDay}
        </AddClassBtn>
      </BuilderPanel>

      <PublishBtn onClick={handlePublish}>
        Publish Global Timetable
      </PublishBtn>

    </Container>
  );
}
