import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 800px;
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

export const Card = styled(motion.div)`
  background-color: #0A0A0A;
  border: 1px solid #222;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
  color: #FFD700;
`;

export const CardTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 800;
  margin: 0;
  color: #fff;
`;

export const CourseList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const CourseRow = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
`;

export const Input = styled.input`
  padding: 1rem;
  background-color: #141414;
  border: 1px solid #333;
  color: #fff;
  border-radius: 12px;
  outline: none;
  font-size: 0.95rem;
  transition: all 0.2s ease;

  &:focus {
    border-color: #FFD700;
  }

  &:read-only {
    background-color: #0C0C0C;
    border-color: #222;
    color: #aaa;
  }
`;

export const Select = styled.select`
  padding: 1rem;
  background-color: #141414;
  border: 1px solid #333;
  color: #fff;
  border-radius: 12px;
  outline: none;
  font-size: 0.95rem;
  cursor: pointer;
  appearance: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: #FFD700;
  }
`;

export const ResultBox = styled.div`
  margin-top: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background-color: #111;
  border: 1px solid #333;
  border-radius: 16px;
  flex-wrap: wrap;
  gap: 1.5rem;
`;

export const ResultLabel = styled.div`
  font-size: 0.9rem;
  color: #888;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

export const ResultValue = styled.div`
  font-size: 3rem;
  font-weight: 900;
  color: #FFD700;
  line-height: 1;
  margin-top: 0.5rem;
`;

export const SaveBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background-color: #FFD700;
  color: #000;
  border: none;
  border-radius: 12px;
  font-weight: 800;
  font-size: 0.95rem;
  cursor: pointer;
  transition: transform 0.1s;

  &:active {
    transform: scale(0.95);
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #666;
  text-align: center;
  border: 1px dashed #333;
  border-radius: 16px;
  background-color: #0A0A0A;
  gap: 1rem;
`;

export const EmptyStateText = styled.p`
  margin: 0;
  font-size: 1.1rem;
`;

// Admin Curriculum Builder Styles
export const AdminPanel = styled(motion.div)`
  background-color: #0A0A0A;
  border: 1px solid #FFD700;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(255, 215, 0, 0.05);
  margin-bottom: 2rem;
`;

export const AdminHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  color: #FFD700;
`;

export const ConfigRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

export const ConfigGroup = styled.div`
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

export const BuilderList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

export const BuilderRow = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
  background-color: #111;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid #222;
`;

export const SmallInput = styled(Input)`
  padding: 0.75rem;
`;

export const SmallSelect = styled(Select)`
  padding: 0.75rem;
`;

export const DeleteBtn = styled.button`
  padding: 0.75rem;
  background-color: rgba(255, 82, 82, 0.1);
  color: #FF5252;
  border: 1px solid rgba(255, 82, 82, 0.2);
  border-radius: 8px;
  cursor: pointer;
  align-self: flex-end;
  font-weight: 700;
  transition: all 0.2s ease;

  &:hover {
    background-color: #FF5252;
    color: white;
  }
`;

export const AddBtn = styled.button`
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

// Past Semesters Styles
export const PastSemsCard = styled(Card)`
  margin-top: 2rem;
  background-color: #0d0d0d;
`;

export const PastSemRow = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  background-color: #141414;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid #222;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
`;

export const PastLabel = styled.div`
  color: #888;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
`;

export const PastValue = styled.div`
  color: #fff;
  font-size: 1.1rem;
  font-weight: 800;
`;

export const FormCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: #111;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px dashed #333;
  margin-top: 1.5rem;
`;

export const CpiBox = styled(ResultBox)`
  background-color: #1a1a1a;
  border-color: #FFD700;
`;

