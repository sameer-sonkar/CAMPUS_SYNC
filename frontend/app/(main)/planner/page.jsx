"use client";
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Circle, Clock, Plus, X, Trash2, Sparkles, Settings, Calendar, ArrowRight, Zap, AlertCircle } from 'lucide-react';
import { plannerService, studentService } from '@/lib/api';
import {
  Container, Header, HeaderTitleBox, HeaderSubtitle, HeaderSubtitleText, Title, HeaderActions,
  SettingsBtn, NewTaskBtn, SettingsPanel, SettingsBox, SettingsTitle, SettingsText, SettingsForm,
  FormGroup, FormLabel, TimeInput, SaveBtn, TaskList, EmptyState, EmptyStateText, TaskCard,
  PriorityIndicator, ToggleBtn, TaskInfo, TaskTitleText, TaskMeta, CategoryBadge, ScheduledMeta,
  DueMeta, DeleteBtn, ModalOverlay, ModalContent, ModalHeader, ModalTitle, CloseBtn, ModalBody,
  FormBody, ErrorMsg, InputField, GridForm, SelectField, PriorityGroup, PriorityBtn, ModalActions,
  ManualSaveBtn, AiSaveBtn, LoadingSuggestion, SpinnerContainer, SpinnerMsg, ErrorSuggestion,
  ErrorTitle, ErrorText, BackBtn, SuggestionResult, SuggestionCard, SuggestionGlow, SuggestionLabel,
  SuggestionDate, SuggestionTime, SuggestionActions, IgnoreBtn, AcceptBtn,
  KanbanBoard, KanbanColumn, ColumnHeader, ColumnTitle, ColumnCount,
  TaskCardKanban, KanbanPriorityTag, ProgressBarContainer, ProgressBarFill
} from './styles';

export default function PlannerPage() {
  const [tasks, setTasks] = useState([]);
  const [uid, setUid] = useState(null);
  
  const [showSettings, setShowSettings] = useState(false);
  const [workingHours, setWorkingHours] = useState({ start: '08:00', end: '22:00' });
  const [savingSettings, setSavingSettings] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [step, setStep] = useState(1);
  const [isGettingSuggestion, setIsGettingSuggestion] = useState(false);
  const [suggestion, setSuggestion] = useState(null);
  
  const [newTask, setNewTask] = useState({
    title: "",
    category: "Homework",
    priority: "medium",
    estimatedTime: 1,
    dueDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]
  });
  const [taskError, setTaskError] = useState("");

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUid(localStorage.getItem('uid'));
    }
  }, []);

  useEffect(() => {
    if (!uid) return;
    const fetchData = async () => {
      try {
        const studentData = await studentService.getStudent(uid);
        if (studentData.workingHours) {
          setWorkingHours(studentData.workingHours);
        }
        const tasksData = await plannerService.getTasks(uid);
        setTasks(tasksData);
      } catch (error) {
        console.error("Failed to fetch planner data", error);
      }
    };
    fetchData();
  }, [uid]);

  const cycleTaskStatus = async (e, id, currentStatus) => {
    e.stopPropagation();
    if (!uid) return;
    let newStatus = 'in-progress';
    if (currentStatus === 'in-progress') newStatus = 'completed';
    if (currentStatus === 'completed') newStatus = 'todo';
    
    const isCompleted = newStatus === 'completed';
    setTasks(tasks.map(t => t._id === id ? { ...t, status: newStatus, isCompleted } : t));
    
    try {
      await plannerService.updateTask(uid, id, { status: newStatus, isCompleted });
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // allow drop
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (!taskId) return;
    
    const isCompleted = newStatus === 'completed';
    setTasks(tasks.map(t => t._id === taskId ? { ...t, status: newStatus, isCompleted } : t));
    
    try {
      await plannerService.updateTask(uid, taskId, { status: newStatus, isCompleted });
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const handleDeleteTask = async (e, id) => {
    e.stopPropagation();
    if (!uid) return;
    try {
      await plannerService.deleteTask(uid, id);
      setTasks(tasks.filter(t => t._id !== id));
    } catch (error) {
      console.error("Failed to delete task", error);
    }
  };

  const saveWorkingHours = async () => {
    setSavingSettings(true);
    try {
      await studentService.updateWorkingHours(uid, workingHours);
      setShowSettings(false);
    } catch (error) {
      console.error("Failed to update working hours", error);
    } finally {
      setSavingSettings(false);
    }
  };

  const handleGetSuggestion = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) {
      setTaskError("Title is required!");
      return;
    }
    setTaskError("");
    setIsGettingSuggestion(true);
    setStep(2);

    try {
      const res = await plannerService.getScheduleSuggestion(uid, {
        title: newTask.title,
        dueDate: newTask.dueDate,
        priority: newTask.priority,
        estimatedTime: Number(newTask.estimatedTime)
      });
      
      if (res.success) {
        setSuggestion(res);
      } else {
        setSuggestion({ error: res.message });
      }
    } catch (error) {
      setSuggestion({ error: "Failed to connect to the scheduling AI." });
    } finally {
      setIsGettingSuggestion(false);
    }
  };

  const handleAcceptSuggestion = async () => {
    if (!uid) return;
    try {
      const finalTask = await plannerService.addTask(uid, {
        title: newTask.title,
        description: `Category: ${newTask.category}`,
        dueDate: new Date(newTask.dueDate),
        priority: newTask.priority,
        estimatedTime: Number(newTask.estimatedTime),
        scheduledStart: suggestion.suggestedStart,
        scheduledEnd: suggestion.suggestedEnd,
        isCompleted: false
      });
      
      setTasks([...tasks, finalTask].sort((a, b) => new Date(a.scheduledStart) - new Date(b.scheduledStart)));
      closeModal();
    } catch (error) {
      console.error("Failed to add scheduled task", error);
    }
  };

  const handleManualSave = async () => {
    if (!uid) return;
    if (!newTask.title.trim()) return setTaskError("Title is required!");
    try {
      const finalTask = await plannerService.addTask(uid, {
        title: newTask.title,
        description: `Category: ${newTask.category}`,
        dueDate: new Date(newTask.dueDate),
        priority: newTask.priority,
        estimatedTime: Number(newTask.estimatedTime),
        isCompleted: false
      });
      setTasks([...tasks, finalTask]);
      closeModal();
    } catch (error) {
      console.error("Failed to save task manually", error);
    }
  };

  const closeModal = () => {
    setShowForm(false);
    setTimeout(() => {
      setStep(1);
      setSuggestion(null);
      setNewTask({
        title: "", category: "Homework", priority: "medium", estimatedTime: 1, 
        dueDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]
      });
      setTaskError("");
    }, 300);
  };

  const parseCategory = (desc) => {
    if (desc && desc.includes('Category:')) {
      return desc.replace('Category:', '').trim();
    }
    return "Task";
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <Container>
      <Header>
        <HeaderTitleBox>
          <HeaderSubtitle>
            <Zap size={20} color="#FFD700" />
            <HeaderSubtitleText>AI Scheduling</HeaderSubtitleText>
          </HeaderSubtitle>
          <Title>Smart Planner</Title>
        </HeaderTitleBox>
        <HeaderActions>
          <SettingsBtn onClick={() => setShowSettings(!showSettings)}>
            <Settings size={20} />
          </SettingsBtn>
          <NewTaskBtn onClick={() => setShowForm(true)}>
            <Plus size={20} /> New Task
          </NewTaskBtn>
        </HeaderActions>
      </Header>

      <AnimatePresence>
        {showSettings && (
          <SettingsPanel initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <SettingsBox>
              <SettingsTitle>Working Hours</SettingsTitle>
              <SettingsText>Set your preferred working window. The AI will only schedule tasks within this timeframe.</SettingsText>
              
              <SettingsForm>
                <FormGroup>
                  <FormLabel>Start Time</FormLabel>
                  <TimeInput type="time" value={workingHours.start} onChange={e => setWorkingHours({...workingHours, start: e.target.value})} />
                </FormGroup>
                <FormGroup>
                  <FormLabel>End Time</FormLabel>
                  <TimeInput type="time" value={workingHours.end} onChange={e => setWorkingHours({...workingHours, end: e.target.value})} />
                </FormGroup>
                <SaveBtn onClick={saveWorkingHours} disabled={savingSettings}>
                  {savingSettings ? 'Saving...' : 'Save Preferences'}
                </SaveBtn>
              </SettingsForm>
            </SettingsBox>
          </SettingsPanel>
        )}
      </AnimatePresence>

      {tasks.length === 0 ? (
        <EmptyState>
          <Sparkles size={32} color="#444" style={{ marginBottom: '1rem' }} />
          <EmptyStateText>Your schedule is clear. Add a task to let the AI organize your day!</EmptyStateText>
        </EmptyState>
      ) : (
        <KanbanBoard>
          {['todo', 'in-progress', 'completed'].map((colStatus) => {
            const colTasks = tasks.filter(t => {
              if (colStatus === 'todo') return t.status === 'todo' || (!t.status && !t.isCompleted);
              if (colStatus === 'in-progress') return t.status === 'in-progress';
              if (colStatus === 'completed') return t.status === 'completed' || t.isCompleted;
              return false;
            });

            return (
              <KanbanColumn 
                key={colStatus}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, colStatus)}
              >
                <ColumnHeader>
                  <ColumnTitle>
                    <Circle size={14} fill={colStatus === 'todo' ? '#666' : colStatus === 'in-progress' ? '#FFD700' : '#00b8a3'} color="none" />
                    {colStatus === 'todo' ? 'To do' : colStatus === 'in-progress' ? 'In progress' : 'Completed'}
                  </ColumnTitle>
                  <ColumnCount>{colTasks.length}</ColumnCount>
                </ColumnHeader>

                {colTasks.map(task => {
                  let pColor = '#00b8a3';
                  if (task.priority === 'high') pColor = '#FF5252';
                  if (task.priority === 'medium') pColor = '#FFD700';

                  // mock progress based on status and priority
                  let mockProgress = colStatus === 'completed' ? 100 : colStatus === 'in-progress' ? 50 : 0;

                  return (
                    <TaskCardKanban 
                      key={task._id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task._id)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <KanbanPriorityTag $color={pColor}>
                          {task.priority === 'high' ? 'High' : task.priority === 'medium' ? 'Med' : 'Low'}
                        </KanbanPriorityTag>
                        <DueMeta style={{ fontSize: '0.75rem', color: '#666' }}>
                          {task.scheduledStart ? `Sched: ${formatDate(task.scheduledStart)}` : `Due: ${formatDate(task.dueDate)}`}
                        </DueMeta>
                      </div>

                      <TaskTitleText style={{ fontSize: '1.05rem', marginBottom: '0.5rem' }} $isCompleted={task.isCompleted}>
                        {colStatus === 'completed' ? `✓ ${task.title}` : task.title}
                      </TaskTitleText>

                      <div style={{ fontSize: '0.8rem', color: '#888', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{parseCategory(task.description)}</span>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <button 
                            onClick={(e) => cycleTaskStatus(e, task._id, colStatus)}
                            style={{ 
                              background: 'transparent', 
                              border: '1px solid #444', 
                              color: '#fff', 
                              borderRadius: '4px', 
                              padding: '2px 8px', 
                              cursor: 'pointer',
                              fontSize: '0.75rem'
                            }}>
                            {colStatus === 'todo' ? 'Start' : colStatus === 'in-progress' ? 'Complete' : 'Reopen'}
                          </button>
                          <DeleteBtn style={{ padding: 0 }} onClick={(e) => handleDeleteTask(e, task._id)}>
                            <Trash2 size={16} />
                          </DeleteBtn>
                        </div>
                      </div>

                      {colStatus !== 'todo' && (
                        <ProgressBarContainer>
                          <ProgressBarFill $progress={mockProgress} />
                        </ProgressBarContainer>
                      )}
                    </TaskCardKanban>
                  );
                })}
              </KanbanColumn>
            );
          })}
        </KanbanBoard>
      )}

      <AnimatePresence>
        {showForm && (
          <ModalOverlay>
            <ModalContent initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}>
              
              <ModalHeader>
                <ModalTitle>
                  {step === 1 ? 'New Task' : 'Smart Suggestion'}
                </ModalTitle>
                <CloseBtn onClick={closeModal}><X size={24} /></CloseBtn>
              </ModalHeader>

              <ModalBody>
                {step === 1 ? (
                  <FormBody onSubmit={handleGetSuggestion}>
                    {taskError && <ErrorMsg><AlertCircle size={16}/> {taskError}</ErrorMsg>}
                    
                    <FormGroup>
                      <FormLabel>Task Title</FormLabel>
                      <InputField type="text" value={newTask.title} onChange={e => { setNewTask({...newTask, title: e.target.value}); setTaskError(""); }} placeholder="e.g. Complete OS Assignment" />
                    </FormGroup>

                    <GridForm>
                      <FormGroup>
                        <FormLabel>Category</FormLabel>
                        <SelectField value={newTask.category} onChange={e => setNewTask({...newTask, category: e.target.value})}>
                          <option value="Homework">Homework</option>
                          <option value="Project">Project</option>
                          <option value="Reading">Reading</option>
                          <option value="Exam Prep">Exam Prep</option>
                        </SelectField>
                      </FormGroup>
                      <FormGroup>
                        <FormLabel>Due Date</FormLabel>
                        <InputField type="date" value={newTask.dueDate} onChange={e => setNewTask({...newTask, dueDate: e.target.value})} />
                      </FormGroup>
                    </GridForm>

                    <GridForm>
                      <FormGroup>
                        <FormLabel>Priority</FormLabel>
                        <PriorityGroup>
                          {['low', 'medium', 'high'].map(p => (
                            <PriorityBtn key={p} type="button" onClick={() => setNewTask({...newTask, priority: p})} $isActive={newTask.priority === p}>
                              {p}
                            </PriorityBtn>
                          ))}
                        </PriorityGroup>
                      </FormGroup>
                      <FormGroup>
                        <FormLabel>Est. Time (Hours)</FormLabel>
                        <InputField type="number" step="0.5" min="0.5" value={newTask.estimatedTime} onChange={e => setNewTask({...newTask, estimatedTime: e.target.value})} />
                      </FormGroup>
                    </GridForm>

                    <ModalActions>
                      <ManualSaveBtn type="button" onClick={handleManualSave}>
                        Save Manually
                      </ManualSaveBtn>
                      <AiSaveBtn type="submit">
                        <Sparkles size={18} /> Get AI Suggestion
                      </AiSaveBtn>
                    </ModalActions>
                  </FormBody>
                ) : (
                  <LoadingSuggestion>
                    {isGettingSuggestion ? (
                      <SpinnerContainer>
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                          <Sparkles size={40} color="#FFD700" />
                        </motion.div>
                        <SpinnerMsg>Analyzing timetable & finding gaps...</SpinnerMsg>
                      </SpinnerContainer>
                    ) : suggestion?.error ? (
                      <ErrorSuggestion>
                        <AlertCircle size={40} color="#FF5252" style={{ marginBottom: '1rem' }} />
                        <ErrorTitle>Could not schedule</ErrorTitle>
                        <ErrorText>{suggestion.error}</ErrorText>
                        <BackBtn onClick={() => setStep(1)}>Go Back</BackBtn>
                      </ErrorSuggestion>
                    ) : (
                      <SuggestionResult>
                        <SuggestionCard>
                          <SuggestionGlow />
                          
                          <Sparkles size={28} color="#FFD700" style={{ marginBottom: '1rem' }} />
                          <SuggestionLabel>Optimal Slot Found</SuggestionLabel>
                          
                          <SuggestionDate>
                            {formatDate(suggestion.suggestedStart)}
                          </SuggestionDate>
                          <SuggestionTime>
                            {formatTime(suggestion.suggestedStart)} - {formatTime(suggestion.suggestedEnd)}
                          </SuggestionTime>
                        </SuggestionCard>

                        <SuggestionActions>
                          <IgnoreBtn onClick={handleManualSave}>
                            Ignore
                          </IgnoreBtn>
                          <AcceptBtn onClick={handleAcceptSuggestion}>
                            Accept & Schedule <ArrowRight size={18} />
                          </AcceptBtn>
                        </SuggestionActions>
                      </SuggestionResult>
                    )}
                  </LoadingSuggestion>
                )}
              </ModalBody>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </Container>
  );
}
