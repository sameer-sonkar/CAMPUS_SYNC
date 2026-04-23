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
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 900;
  color: #fff;
  margin: 0;
  letter-spacing: -1px;
`;

export const Subtitle = styled.p`
  color: #888;
  font-size: 1.1rem;
  margin: 0;
`;

export const ConfigPanel = styled(motion.div)`
  background-color: #0A0A0A;
  border: 1px solid #222;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
  align-items: flex-end;
  flex-wrap: wrap;
`;

export const FormGroup = styled.div`
  flex: 1;
  min-width: 200px;
`;

export const Label = styled.label`
  display: block;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #aaa;
  font-size: 0.9rem;
`;

export const Select = styled.select`
  width: 100%;
  padding: 1rem;
  background-color: #141414;
  border: 1px solid #333;
  color: #fff;
  border-radius: 12px;
  outline: none;
  font-size: 0.95rem;
  appearance: none;
  cursor: pointer;

  &:focus {
    border-color: #FFD700;
  }
`;

export const LoadBtn = styled.button`
  padding: 0.8rem 1.5rem;
  font-weight: 700;
  background-color: #111;
  color: #fff;
  border: 1px solid #333;
  border-radius: 8px;
  cursor: pointer;
  height: 50px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #222;
  }
`;

export const BuilderPanel = styled.div`
  background-color: #0A0A0A;
  border: 1px solid #222;
  border-radius: 20px;
  padding: 2rem;
`;

export const BuilderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

export const BuilderTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0;
  color: #fff;
`;

export const TargetBadge = styled.div`
  font-weight: 600;
  color: #FFD700;
  background-color: rgba(255, 215, 0, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 215, 0, 0.2);
`;

export const DaysTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;

  &::-webkit-scrollbar {
    height: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #333;
    border-radius: 4px;
  }
`;

export const DayBtn = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: none;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  background-color: ${props => props.$isActive ? '#FFD700' : '#111'};
  color: ${props => props.$isActive ? '#000' : '#888'};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.$isActive ? '#FFD700' : '#222'};
    color: ${props => props.$isActive ? '#000' : '#fff'};
  }
`;

export const ClassesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const EmptyDay = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
  background-color: #050505;
  border: 1px dashed #333;
  border-radius: 12px;
`;

export const ClassRow = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  background-color: #111;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid #222;
  flex-wrap: wrap;
`;

export const InputSmall = styled.input`
  padding: 0.75rem;
  background-color: #1A1A1A;
  border: 1px solid #333;
  color: #fff;
  border-radius: 8px;
  outline: none;
  width: 100%;

  &:focus {
    border-color: #FFD700;
  }
`;

export const DeleteBtn = styled.button`
  padding: 0.75rem;
  background-color: rgba(255, 82, 82, 0.1);
  color: #FF5252;
  border: 1px solid rgba(255, 82, 82, 0.2);
  border-radius: 8px;
  cursor: pointer;
  align-self: flex-end;
  height: 42px;
  font-weight: 700;
  transition: all 0.2s ease;

  &:hover {
    background-color: #FF5252;
    color: white;
  }
`;

export const AddClassBtn = styled.button`
  margin-top: 1.5rem;
  width: 100%;
  padding: 1rem;
  background-color: #111;
  border: 2px dashed #333;
  border-radius: 12px;
  color: #888;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #1a1a1a;
    border-color: #555;
    color: #fff;
  }
`;

export const PublishBtn = styled.button`
  padding: 1.25rem;
  font-size: 1.1rem;
  margin-top: 1rem;
  background-color: #FFD700;
  color: #000;
  border: none;
  border-radius: 12px;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.1s ease;

  &:active {
    transform: scale(0.98);
  }
`;
