"use client";
import { useState, useEffect } from 'react';
import { Calculator, Save, FileQuestion, BookOpen, Clock, Plus } from 'lucide-react';
import { studentService, attendanceService } from '@/lib/api';
import { 
  Container, Header, Title, Subtitle, Card, CardHeader, CardTitle, 
  CourseList, CourseRow, Input, Select, ResultBox, ResultLabel, 
  ResultValue, SaveBtn, EmptyState, EmptyStateText,
  AdminPanel, AdminHeader, ConfigRow, ConfigGroup, Label,
  BuilderList, BuilderRow, SmallInput, SmallSelect, DeleteBtn, AddBtn, LoadBtn,
  PastSemsCard, PastSemRow, PastLabel, PastValue, FormCard, CpiBox
} from './styles';

export default function GradesPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [studentProfile, setStudentProfile] = useState(null);
  
  // Student State
  const [studentCourses, setStudentCourses] = useState([]);
  const [spi, setSpi] = useState('0.00');
  const [cpi, setCpi] = useState('0.00');
  const [currentCredits, setCurrentCredits] = useState(0);

  // Past Semesters State
  const [pastSemesters, setPastSemesters] = useState([]);
  const [newPastSem, setNewPastSem] = useState({ semester: '', spi: '', credit: '' });
  const [savingPastSem, setSavingPastSem] = useState(false);

  // Admin State
  const [adminBranch, setAdminBranch] = useState('CSE');
  const [adminSemester, setAdminSemester] = useState('1');
  const [adminCourses, setAdminCourses] = useState([]);

  useEffect(() => {
    const initData = async () => {
      try {
        const uid = localStorage.getItem('uid');
        if (!uid) return;
        const profile = await studentService.getStudent(uid);
        setStudentProfile(profile);
        
        if (profile?.role === 'admin') {
          setIsAdmin(true);
        }

        // Fetch Past Semesters
        try {
          const pastSems = await studentService.getPastSemesters(uid);
          setPastSemesters(pastSems || []);
        } catch (e) {
          console.log("Failed to load past semesters");
        }

        // Fetch Curriculum
        if (profile?.branch && profile?.currentSemester) {
          const docId = `${profile.branch}_Sem${profile.currentSemester}`;
          try {
            const curr = await attendanceService.getCurriculum(docId);
            if (curr && curr.courses && curr.courses.length > 0) {
              const mapped = curr.courses.map((c, i) => ({
                id: i,
                name: c.name,
                credit: c.credits,
                grade: 'AA' // default
              }));
              setStudentCourses(mapped);
            }
          } catch (e) {
            console.log("No curriculum found for student's current sem");
          }
        }
      } catch (error) {
        console.error("Failed to load grades page data", error);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, []);

  // Recalculate SPI and CPI whenever student courses or past semesters change
  useEffect(() => {
    let currentPoints = 0;
    let currCredits = 0;
    
    const gradeMap = {
      "AA": 10, "AB": 9, "BB": 8, "BC": 7, "CC": 6, "CD": 5, "DD": 4, "F": 0
    };

    // Calculate current SPI
    studentCourses.forEach(c => {
      const g = gradeMap[c.grade] || 0;
      const cred = parseFloat(c.credit) || 0;
      currentPoints += (g * cred);
      currCredits += cred;
    });

    const currentSpi = currCredits > 0 ? (currentPoints / currCredits) : 0;
    setSpi(currentSpi.toFixed(2));
    setCurrentCredits(currCredits);

    // Calculate overall CPI
    let totalPoints = currentPoints;
    let totalCredits = currCredits;

    pastSemesters.forEach(sem => {
      const spi = parseFloat(sem.spi) || 0;
      const cred = parseFloat(sem.credit) || 0;
      totalPoints += (spi * cred);
      totalCredits += cred;
    });

    if (totalCredits > 0) {
      setCpi((totalPoints / totalCredits).toFixed(2));
    } else {
      setCpi('0.00');
    }

  }, [studentCourses, pastSemesters]);

  const handleStudentGradeChange = (id, newGrade) => {
    setStudentCourses(prev => prev.map(c => c.id === id ? { ...c, grade: newGrade } : c));
  };

  const handleAddPastSemester = async (e) => {
    e.preventDefault();
    if (!newPastSem.semester || !newPastSem.spi || !newPastSem.credit) return;
    
    setSavingPastSem(true);
    try {
      const uid = localStorage.getItem('uid');
      const data = {
        semester: Number(newPastSem.semester),
        spi: Number(newPastSem.spi),
        credit: Number(newPastSem.credit),
        cpi: 0 // Will be calculated by backend if needed, or just calculated dynamically here
      };
      const savedSem = await studentService.addPastSemester(uid, data);
      
      setPastSemesters(prev => [...prev, savedSem].sort((a, b) => a.semester - b.semester));
      setNewPastSem({ semester: '', spi: '', credit: '' });
    } catch (error) {
      if (error.response?.data?.error) {
        alert(error.response.data.error);
      } else {
        alert("Failed to add past semester. Make sure you haven't already added this semester.");
      }
    } finally {
      setSavingPastSem(false);
    }
  };

  // --- ADMIN LOGIC ---
  const loadAdminCurriculum = async (silent = false) => {
    try {
      const docId = `${adminBranch}_Sem${adminSemester}`;
      const curr = await attendanceService.getCurriculum(docId);
      if (curr && curr.courses) {
        setAdminCourses(curr.courses);
        if (!silent) alert(`Loaded curriculum for ${docId}`);
      } else {
        if (!silent) alert("No existing curriculum found. Starting fresh.");
        setAdminCourses([]);
      }
    } catch (e) {
      if (!silent) alert("No existing curriculum found. Starting fresh.");
      setAdminCourses([]);
    }
  };

  // Auto-load admin curriculum when branch or semester changes
  useEffect(() => {
    if (isAdmin) {
      loadAdminCurriculum(true);
    }
  }, [isAdmin, adminBranch, adminSemester]);

  const handleAdminAddCourse = () => {
    setAdminCourses(prev => [
      ...prev,
      { code: "NEW101", name: "New Course", credits: 4, lecHours: 3, labHours: 2 }
    ]);
  };

  const handleAdminUpdateCourse = (index, field, value) => {
    const updated = [...adminCourses];
    updated[index] = { ...updated[index], [field]: field === 'name' || field === 'code' ? value : Number(value) };
    setAdminCourses(updated);
  };

  const handleAdminDeleteCourse = (index) => {
    setAdminCourses(prev => prev.filter((_, i) => i !== index));
  };

  const handleAdminPublish = async () => {
    try {
      const docId = `${adminBranch}_Sem${adminSemester}`;
      await attendanceService.updateCurriculum(docId, adminCourses);
      alert(`✅ Curriculum successfully published for ${docId}!`);
    } catch (error) {
      console.error(error);
      alert("Failed to publish curriculum.");
    }
  };

  if (loading) return <div style={{ padding: '2rem', color: '#888' }}>Loading Grades...</div>;

  return (
    <Container>
      <Header>
        <Title>Grade Calculator</Title>
        <Subtitle>Estimate your semester SPI and calculate your overall CPI.</Subtitle>
      </Header>

      {isAdmin && (
        <AdminPanel initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <AdminHeader>
            <BookOpen size={24} />
            <CardTitle>Admin: Curriculum Builder</CardTitle>
          </AdminHeader>
          <Subtitle style={{ marginBottom: '1.5rem' }}>Define courses, credits, and hours globally.</Subtitle>

          <ConfigRow>
            <ConfigGroup>
              <Label>Branch</Label>
              <SmallSelect value={adminBranch} onChange={e => setAdminBranch(e.target.value)} style={{ width: '100%' }}>
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
              </SmallSelect>
            </ConfigGroup>
            <ConfigGroup>
              <Label>Semester</Label>
              <SmallSelect value={adminSemester} onChange={e => setAdminSemester(e.target.value)} style={{ width: '100%' }}>
                {[1,2,3,4,5,6,7,8,9,10].map(s => <option key={s} value={s}>{s}</option>)}
              </SmallSelect>
            </ConfigGroup>
            <LoadBtn onClick={loadAdminCurriculum}>Load Existing</LoadBtn>
          </ConfigRow>

          <BuilderList>
            {adminCourses.length === 0 ? (
              <EmptyState style={{ padding: '1.5rem' }}>
                <EmptyStateText>No courses defined yet.</EmptyStateText>
              </EmptyState>
            ) : (
              adminCourses.map((c, idx) => (
                <BuilderRow key={idx}>
                  <div style={{ flex: 1, minWidth: '80px' }}>
                    <Label style={{ fontSize: '0.75rem' }}>Code</Label>
                    <SmallInput type="text" value={c.code} onChange={(e) => handleAdminUpdateCourse(idx, 'code', e.target.value)} style={{ width: '100%' }} />
                  </div>
                  <div style={{ flex: 2, minWidth: '150px' }}>
                    <Label style={{ fontSize: '0.75rem' }}>Name</Label>
                    <SmallInput type="text" value={c.name} onChange={(e) => handleAdminUpdateCourse(idx, 'name', e.target.value)} style={{ width: '100%' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: '60px' }}>
                    <Label style={{ fontSize: '0.75rem' }}>Credits</Label>
                    <SmallInput type="number" value={c.credits} onChange={(e) => handleAdminUpdateCourse(idx, 'credits', e.target.value)} style={{ width: '100%' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: '60px' }}>
                    <Label style={{ fontSize: '0.75rem' }}>Lec Hrs</Label>
                    <SmallInput type="number" value={c.lecHours} onChange={(e) => handleAdminUpdateCourse(idx, 'lecHours', e.target.value)} style={{ width: '100%' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: '60px' }}>
                    <Label style={{ fontSize: '0.75rem' }}>Lab Hrs</Label>
                    <SmallInput type="number" value={c.labHours} onChange={(e) => handleAdminUpdateCourse(idx, 'labHours', e.target.value)} style={{ width: '100%' }} />
                  </div>
                  <DeleteBtn onClick={() => handleAdminDeleteCourse(idx)}>Delete</DeleteBtn>
                </BuilderRow>
              ))
            )}
          </BuilderList>

          <AddBtn onClick={handleAdminAddCourse}>+ Add Course</AddBtn>
          <SaveBtn onClick={handleAdminPublish} style={{ marginTop: '1.5rem', width: '100%', justifyContent: 'center' }}>
            <Save size={18} /> Publish Curriculum to {adminBranch} Sem {adminSemester}
          </SaveBtn>
        </AdminPanel>
      )}

      {/* CPI Display */}
      <CpiBox>
        <div>
          <ResultLabel style={{ color: '#FFD700' }}>Overall Expected CPI</ResultLabel>
          <ResultValue style={{ fontSize: '4rem' }}>{cpi}</ResultValue>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: '#aaa', fontSize: '0.9rem' }}>Based on Past Semesters</div>
          <div style={{ color: '#aaa', fontSize: '0.9rem' }}>+ Current Est. SPI ({spi})</div>
        </div>
      </CpiBox>

      {/* CURRENT SEMESTER CALCULATOR */}
      <Card initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <CardHeader>
          <Calculator size={24} />
          <CardTitle>Current Semester Calculator (Sem {studentProfile?.currentSemester || '?'})</CardTitle>
        </CardHeader>

        {studentCourses.length === 0 ? (
          <EmptyState>
            <FileQuestion size={40} />
            <EmptyStateText>No curriculum published for your current branch and semester yet.</EmptyStateText>
          </EmptyState>
        ) : (
          <CourseList>
            <div style={{ display: 'flex', gap: '1rem', padding: '0 0.5rem', color: '#888', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>
              <div style={{ flex: 2, minWidth: '150px' }}>Course</div>
              <div style={{ flex: 1, minWidth: '80px' }}>Credits</div>
              <div style={{ flex: 1, minWidth: '100px' }}>Est. Grade</div>
            </div>
            {studentCourses.map((course) => (
              <CourseRow key={course.id}>
                <Input type="text" value={course.name} readOnly style={{ flex: 2, minWidth: '150px' }} />
                <Input type="number" value={course.credit} readOnly style={{ flex: 1, minWidth: '80px' }} />
                <Select value={course.grade} onChange={(e) => handleStudentGradeChange(course.id, e.target.value)} style={{ flex: 1, minWidth: '100px' }}>
                  <option value="AA">AA (10)</option>
                  <option value="AB">AB (9)</option>
                  <option value="BB">BB (8)</option>
                  <option value="BC">BC (7)</option>
                  <option value="CC">CC (6)</option>
                  <option value="CD">CD (5)</option>
                  <option value="DD">DD (4)</option>
                  <option value="F">F (0)</option>
                </Select>
              </CourseRow>
            ))}
          </CourseList>
        )}

        <ResultBox>
          <div>
            <ResultLabel>Estimated SPI</ResultLabel>
            <ResultValue>{spi}</ResultValue>
          </div>
          <div style={{ color: '#aaa', fontWeight: 700 }}>
            {currentCredits} Credits
          </div>
        </ResultBox>
      </Card>

      {/* PAST SEMESTERS MANAGER */}
      <PastSemsCard initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <CardHeader>
          <Clock size={24} />
          <CardTitle>Past Semesters History</CardTitle>
        </CardHeader>
        
        {pastSemesters.length === 0 ? (
          <EmptyState style={{ padding: '2rem' }}>
            <EmptyStateText>No past semesters logged yet.</EmptyStateText>
          </EmptyState>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {pastSemesters.map((sem, idx) => (
              <PastSemRow key={idx}>
                <div style={{ flex: 1 }}>
                  <PastLabel>Semester</PastLabel>
                  <PastValue>{sem.semester}</PastValue>
                </div>
                <div style={{ flex: 1 }}>
                  <PastLabel>Earned SPI</PastLabel>
                  <PastValue style={{ color: '#FFD700' }}>{Number(sem.spi).toFixed(2)}</PastValue>
                </div>
                <div style={{ flex: 1 }}>
                  <PastLabel>Credits</PastLabel>
                  <PastValue>{sem.credit}</PastValue>
                </div>
              </PastSemRow>
            ))}
          </div>
        )}

        <FormCard>
          <CardTitle style={{ fontSize: '1rem', color: '#888' }}>Add Past Semester</CardTitle>
          <form onSubmit={handleAddPastSemester} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: 1, minWidth: '100px' }}>
              <Label>Sem No.</Label>
              <SmallInput 
                type="number" 
                min="1" max="10" 
                required 
                placeholder="e.g. 1"
                value={newPastSem.semester} 
                onChange={(e) => setNewPastSem({...newPastSem, semester: e.target.value})} 
                style={{ width: '100%' }} 
              />
            </div>
            <div style={{ flex: 1, minWidth: '100px' }}>
              <Label>SPI</Label>
              <SmallInput 
                type="number" 
                step="0.01" min="0" max="10" 
                required 
                placeholder="e.g. 8.5"
                value={newPastSem.spi} 
                onChange={(e) => setNewPastSem({...newPastSem, spi: e.target.value})} 
                style={{ width: '100%' }} 
              />
            </div>
            <div style={{ flex: 1, minWidth: '100px' }}>
              <Label>Credits</Label>
              <SmallInput 
                type="number" 
                min="1" max="40" 
                required 
                placeholder="e.g. 21"
                value={newPastSem.credit} 
                onChange={(e) => setNewPastSem({...newPastSem, credit: e.target.value})} 
                style={{ width: '100%' }} 
              />
            </div>
            <SaveBtn type="submit" disabled={savingPastSem} style={{ height: '46px', padding: '0 1.5rem' }}>
              <Plus size={18} /> {savingPastSem ? 'Saving...' : 'Add'}
            </SaveBtn>
          </form>
        </FormCard>

      </PastSemsCard>

    </Container>
  );
}
