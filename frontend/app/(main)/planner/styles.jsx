import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 900px;
  margin: 0 auto;
  padding: 1rem;
  font-family: system-ui, -apple-system, sans-serif;
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-bottom: 1px solid #222;
  padding-bottom: 1.5rem;
`;

export const HeaderTitleBox = styled.div`
  display: flex;
  flex-direction: column;
`;

export const HeaderSubtitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

export const HeaderSubtitleText = styled.span`
  font-size: 0.85rem;
  color: #FFD700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-weight: 700;
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0;
  color: #fff;
  letter-spacing: -1px;
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 1rem;
`;

export const SettingsBtn = styled.button`
  padding: 0.75rem;
  background-color: #111;
  color: #fff;
  border: 1px solid #333;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background-color: #222;
    border-color: #444;
  }
`;

export const NewTaskBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #FFD700;
  color: #000;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: transform 0.1s;

  &:active {
    transform: scale(0.95);
  }
`;

export const SettingsPanel = styled(motion.div)`
  overflow: hidden;
`;

export const SettingsBox = styled.div`
  background-color: #111;
  border: 1px solid #222;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1rem;
`;

export const SettingsTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 1rem 0;
`;

export const SettingsText = styled.p`
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
`;

export const SettingsForm = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
  flex-wrap: wrap;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const FormLabel = styled.label`
  font-size: 0.85rem;
  color: #aaa;
  font-weight: 600;
`;

export const TimeInput = styled.input`
  background-color: #0A0A0A;
  border: 1px solid #333;
  color: #fff;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  outline: none;
  
  &:focus {
    border-color: #FFD700;
  }
`;

export const SaveBtn = styled.button`
  margin-top: auto;
  padding: 0.75rem 1.5rem;
  background-color: #222;
  color: #fff;
  border: 1px solid #444;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #333;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export const TaskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const EmptyState = styled.div`
  padding: 4rem;
  text-align: center;
  color: #666;
  border: 1px dashed #333;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const EmptyStateText = styled.p`
  font-size: 1.1rem;
  margin: 0;
`;

export const TaskCard = styled(motion.div)`
  display: flex;
  align-items: center;
  padding: 1.25rem 1.5rem;
  background-color: #0C0C0C;
  border-radius: 16px;
  gap: 1.25rem;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;

  border: 1px solid ${props => props.$isHighPriority && !props.$isCompleted ? '#FFD70030' : '#222'};
  opacity: ${props => props.$isCompleted ? 0.5 : 1};

  &:hover {
    border-color: ${props => props.$isCompleted ? '#222' : '#444'};
  }
`;

export const PriorityIndicator = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background-color: #FFD700;
`;

export const ToggleBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  color: ${props => props.$isCompleted ? '#00b8a3' : '#555'};
  transition: color 0.2s;

  &:hover {
    color: ${props => props.$isCompleted ? '#009688' : '#FFD700'};
  }
`;

export const TaskInfo = styled.div`
  flex: 1;
`;

export const TaskTitleText = styled.h3`
  font-size: 1.15rem;
  font-weight: 700;
  margin: 0 0 0.4rem 0;
  color: ${props => props.$isCompleted ? '#888' : '#fff'};
  text-decoration: ${props => props.$isCompleted ? 'line-through' : 'none'};
`;

export const TaskMeta = styled.div`
  display: flex;
  gap: 1.25rem;
  font-size: 0.85rem;
  color: #888;
  font-weight: 600;
  align-items: center;
  flex-wrap: wrap;
`;

export const CategoryBadge = styled.span`
  color: #aaa;
  background-color: #222;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
`;

export const ScheduledMeta = styled.span`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: #FFD700;
`;

export const DueMeta = styled.span`
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

export const DeleteBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #444;
  padding: 0.5rem;
  display: flex;
  transition: color 0.2s;

  &:hover {
    color: #FF5252;
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0,0,0,0.8);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  padding: 1rem;
`;

export const ModalContent = styled(motion.div)`
  background-color: #0A0A0A;
  border: 1px solid #333;
  border-radius: 24px;
  width: 100%;
  max-width: 500px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
`;

export const ModalHeader = styled.div`
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #222;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 800;
  color: #fff;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const CloseBtn = styled.button`
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  display: flex;

  &:hover {
    color: #fff;
  }
`;

export const ModalBody = styled.div`
  padding: 2rem;
`;

export const FormBody = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const ErrorMsg = styled.div`
  color: #FF5252;
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

export const InputField = styled.input`
  padding: 1rem;
  background-color: #141414;
  border: 1px solid #333;
  color: #fff;
  border-radius: 12px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #FFD700;
  }
`;

export const GridForm = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

export const SelectField = styled.select`
  padding: 1rem;
  background-color: #141414;
  border: 1px solid #333;
  color: #fff;
  border-radius: 12px;
  font-size: 0.95rem;
  outline: none;
  appearance: none;
  cursor: pointer;

  &:focus {
    border-color: #FFD700;
  }
`;

export const PriorityGroup = styled.div`
  display: flex;
  gap: 0.25rem;
  background-color: #141414;
  padding: 0.25rem;
  border-radius: 12px;
  border: 1px solid #333;
`;

export const PriorityBtn = styled.button`
  flex: 1;
  padding: 0.6rem 0;
  border: none;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: capitalize;
  cursor: pointer;
  background-color: ${props => props.$isActive ? '#333' : 'transparent'};
  color: ${props => props.$isActive ? '#fff' : '#888'};

  &:hover {
    color: #fff;
  }
`;

export const ModalActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

export const ManualSaveBtn = styled.button`
  flex: 1;
  padding: 1rem;
  background-color: transparent;
  color: #fff;
  border: 1px solid #333;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #141414;
  }
`;

export const AiSaveBtn = styled.button`
  flex: 2;
  padding: 1rem;
  background-color: #FFD700;
  color: #000;
  border: none;
  border-radius: 12px;
  font-weight: 800;
  font-size: 0.95rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  transition: transform 0.1s;

  &:active {
    transform: scale(0.98);
  }
`;

export const LoadingSuggestion = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
  text-align: center;
`;

export const SpinnerContainer = styled.div`
  padding: 3rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

export const SpinnerMsg = styled.p`
  color: #aaa;
  font-size: 1rem;
  font-weight: 500;
`;

export const ErrorSuggestion = styled.div`
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

export const ErrorTitle = styled.h3`
  color: #fff;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

export const ErrorText = styled.p`
  color: #888;
  margin-bottom: 2rem;
`;

export const BackBtn = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #444;
  }
`;

export const SuggestionResult = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
  text-align: center;
  width: 100%;
`;

export const SuggestionCard = styled.div`
  padding: 2rem;
  background-color: #141414;
  border: 1px solid #FFD70040;
  border-radius: 20px;
  width: 100%;
  position: relative;
  overflow: hidden;
`;

export const SuggestionGlow = styled.div`
  position: absolute;
  top: -50%;
  left: -50%;
  right: -50%;
  bottom: -50%;
  background: radial-gradient(circle, #FFD70010 0%, transparent 60%);
  pointer-events: none;
`;

export const SuggestionLabel = styled.div`
  font-size: 0.9rem;
  color: #FFD700;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

export const SuggestionDate = styled.h3`
  font-size: 1.5rem;
  color: #fff;
  font-weight: 800;
  margin: 0 0 0.5rem 0;
  position: relative;
  z-index: 1;
`;

export const SuggestionTime = styled.div`
  font-size: 2rem;
  color: #fff;
  font-weight: 900;
  font-family: monospace;
  position: relative;
  z-index: 1;
`;

export const SuggestionActions = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
  margin-top: 1rem;
`;

export const IgnoreBtn = styled.button`
  flex: 1;
  padding: 1rem;
  background-color: transparent;
  color: #888;
  border: 1px solid #333;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: #1a1a1a;
  }
`;

export const AcceptBtn = styled.button`
  flex: 2;
  padding: 1rem;
  background-color: #FFD700;
  color: #000;
  border: none;
  border-radius: 12px;
  font-weight: 800;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;

  &:active {
    transform: scale(0.98);
  }
`;

export const KanbanBoard = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  align-items: start;
`;

export const KanbanColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 200px;
  padding-bottom: 2rem;
  border-radius: 12px;
  background-color: ${props => props.$isOver ? 'rgba(255, 255, 255, 0.02)' : 'transparent'};
  transition: background-color 0.2s;
`;

export const ColumnHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  padding: 0 0.5rem;
`;

export const ColumnTitle = styled.h3`
  font-size: 0.95rem;
  font-weight: 700;
  color: #aaa;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
`;

export const ColumnCount = styled.span`
  font-size: 0.85rem;
  color: #666;
  font-weight: 600;
`;

export const TaskCardKanban = styled.div`
  background-color: #111;
  border: 1px solid #222;
  border-radius: 12px;
  padding: 1.25rem;
  cursor: grab;
  transition: all 0.2s ease;
  position: relative;
  
  &:active {
    cursor: grabbing;
  }

  &:hover {
    border-color: #444;
    transform: translateY(-2px);
  }
`;

export const KanbanPriorityTag = styled.span`
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  border: 1px solid ${props => props.$color};
  color: ${props => props.$color};
`;

export const ProgressBarContainer = styled.div`
  height: 4px;
  background-color: #222;
  border-radius: 2px;
  margin-top: 1rem;
  overflow: hidden;
`;

export const ProgressBarFill = styled.div`
  height: 100%;
  background-color: #FFD700;
  width: ${props => props.$progress || 0}%;
`;
