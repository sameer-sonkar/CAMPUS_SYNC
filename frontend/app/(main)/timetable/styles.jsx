import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
  font-family: system-ui, -apple-system, sans-serif;
`;

export const Header = styled.header`
  margin-bottom: 0.5rem;
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 900;
  color: #fff;
  margin: 0 0 0.5rem 0;
`;

export const Subtitle = styled.p`
  color: #888;
  font-size: 1.1rem;
  margin: 0;
`;

export const DaySelector = styled.div`
  display: flex;
  gap: 0.75rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const DayButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  border: 1px solid;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  border-color: ${props => props.$isActive ? '#FFD700' : '#222'};
  background-color: ${props => props.$isActive ? '#FFD700' : '#0A0A0A'};
  color: ${props => props.$isActive ? '#000' : '#888'};
  font-weight: ${props => props.$isActive ? 800 : 600};

  &:hover {
    background-color: ${props => props.$isActive ? '#FFD700' : '#111'};
    border-color: ${props => props.$isActive ? '#FFD700' : '#444'};
    color: ${props => props.$isActive ? '#000' : '#ccc'};
  }
`;

export const ClassList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const LoadingState = styled(motion.div)`
  text-align: center;
  padding: 4rem;
  color: #888;
`;

export const EmptyState = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  color: #888;
  background-color: #0A0A0A;
  border-radius: 16px;
  border: 1px dashed #333;
  gap: 1rem;
`;

export const ClassCard = styled(motion.div)`
  background-color: #0C0C0C;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  
  border: 1px solid #222;
  border-left: 4px solid ${props => props.$color || '#333'};
  box-shadow: ${props => props.$isExpanded ? '0 4px 20px rgba(0, 0, 0, 0.5)' : 'none'};

  &:hover {
    border-color: #444;
    border-left-color: ${props => props.$color || '#444'};
    transform: translateY(-2px);
  }
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 1.5rem;
  gap: 1.5rem;
  flex-wrap: wrap;
  cursor: pointer;
`;

export const TimeBlock = styled.div`
  background-color: #141414;
  border: 1px solid #333;
  padding: 1rem;
  border-radius: 16px;
  text-align: center;
  min-width: 120px;
`;

export const TimeStart = styled.div`
  font-weight: 800;
  color: #fff;
  font-size: 1.1rem;
`;

export const TimeArrow = styled.div`
  font-size: 0.8rem;
  color: #FFD700;
  margin: 0.25rem 0;
`;

export const TimeEnd = styled.div`
  font-weight: 800;
  color: #aaa;
  font-size: 1rem;
`;

export const InfoBlock = styled.div`
  flex: 1;
  min-width: 200px;
`;

export const Badges = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.25rem;
`;

export const CodeBadge = styled.span`
  color: #FFD700;
  font-weight: 800;
  font-size: 0.85rem;
  padding: 0.2rem 0.6rem;
  background-color: rgba(255, 215, 0, 0.12);
  border-radius: 6px;
`;

export const TasksBadge = styled.span`
  color: #00b8a3;
  font-size: 0.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

export const SubjectTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0 0 0.5rem 0;
  color: #fff;
`;

export const MetaInfo = styled.div`
  display: flex;
  gap: 1.5rem;
  color: #888;
  font-size: 0.9rem;
  font-weight: 600;
  flex-wrap: wrap;
`;

export const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

export const AttendanceBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background-color: #141414;
  border: 1px solid #333;
  border-radius: 16px;
`;

export const AttendanceLabel = styled.span`
  font-size: 0.8rem;
  font-weight: 700;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

export const AttendancePercent = styled.span`
  font-size: 1.75rem;
  font-weight: 900;
  color: ${props => props.$percent >= 75 ? '#00b8a3' : props.$percent > 0 ? '#FF5252' : '#fff'};
`;

export const AttendanceFraction = styled.span`
  font-size: 0.85rem;
  color: #666;
  font-weight: 600;
`;

export const WarningTag = styled.div`
  color: ${props => props.$isLow ? '#FF5252' : '#00b8a3'};
  font-size: 0.75rem;
  font-weight: 800;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

export const ChevronBlock = styled.div`
  padding: 0.5rem;
  transition: all 0.2s ease;
  color: ${props => props.$isExpanded ? '#FFD700' : '#666'};
`;

export const ExpandedContentContainer = styled(motion.div)`
  overflow: hidden;
`;

export const ExpandedContent = styled.div`
  padding: 0 1.5rem 1.5rem 1.5rem;
`;

export const ExpandedDivider = styled.div`
  border-top: 1px solid #222;
  padding-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const NotesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

export const NotesCard = styled.div`
  background-color: #141414;
  border: 1px solid #333;
  padding: 1.25rem;
  border-radius: 16px;
`;

export const NotesTitle = styled.h4`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
`;

export const NotesText = styled.p`
  color: #aaa;
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0;
`;

export const TasksList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const TaskItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background-color: #0A0A0A;
  border: 1px solid #222;
  border-radius: 8px;
`;

export const TaskTitle = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${props => props.$isCompleted ? '#666' : '#eee'};
  text-decoration: ${props => props.$isCompleted ? 'line-through' : 'none'};
`;

export const TaskPriority = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: ${props => props.$priority === 'high' ? '#FFD700' : '#888'};
`;

export const ControlsBlock = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const LockedWarning = styled.div`
  display: flex;
  gap: 0.5rem;
  background-color: #141414;
  border: 1px solid #333;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  align-items: center;
`;

export const LockedText = styled.span`
  color: #888;
  font-weight: 700;
  font-size: 0.9rem;
`;

export const MarkedToday = styled.div`
  display: flex;
  gap: 1rem;
  background-color: rgba(0, 184, 163, 0.08);
  border: 1px solid rgba(0, 184, 163, 0.25);
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  align-items: center;
`;

export const MarkedText = styled.span`
  color: #00b8a3;
  font-weight: 800;
`;

export const UndoButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid #333;
  background-color: #111;
  color: #fff;
  cursor: pointer;
  font-weight: 700;
  transition: all 0.2s ease;

  &:hover {
    background-color: #222;
    border-color: #555;
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

export const PresentButton = styled.button`
  padding: 0.75rem 2rem;
  border-radius: 12px;
  border: none;
  background-color: #00b8a3;
  color: #000;
  cursor: pointer;
  font-weight: 800;
  font-size: 0.95rem;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 184, 163, 0.2);
  }
`;

export const AbsentButton = styled.button`
  padding: 0.75rem 2rem;
  border-radius: 12px;
  border: none;
  background-color: #FF5252;
  color: #fff;
  cursor: pointer;
  font-weight: 800;
  font-size: 0.95rem;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 82, 82, 0.2);
  }
`;
