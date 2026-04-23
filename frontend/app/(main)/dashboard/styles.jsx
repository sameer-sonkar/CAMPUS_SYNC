import styled from 'styled-components';
import { motion } from 'framer-motion';

export const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  font-family: system-ui, -apple-system, sans-serif;
  color: var(--text-main);
`;

export const Header = styled.header`
  margin-bottom: 1rem;
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0 0 0.5rem 0;
  color: #fff;
`;

export const Subtitle = styled.p`
  color: #888;
  font-size: 1.1rem;
  margin: 0;
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #FFD700;
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0;
`;

export const SectionTitleWhite = styled.h2`
  color: #fff;
  font-size: 1.25rem;
  font-weight: 800;
  margin: 0;
`;

export const LoadingContainer = styled.div`
  padding: 3rem;
  text-align: center;
  background-color: #0C0C0C;
  border-radius: 16px;
  border: 1px solid #222;
  color: #888;
`;

export const GridStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

export const StatCard = styled.div`
  padding: 1.5rem;
  background-color: #0A0A0A;
  border: 1px solid #222;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: #333;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }
`;

export const IconWrapper = styled.div`
  padding: 1rem;
  background-color: #111;
  border-radius: 50%;
  border: 1px solid #333;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StatLabel = styled.div`
  font-size: 0.85rem;
  color: #888;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

export const StatValue = styled.div`
  font-size: 2rem;
  color: #fff;
  font-weight: 800;
`;

export const GridCharts = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
`;

export const ChartCard = styled.div`
  padding: 1.5rem;
  background-color: #0A0A0A;
  border: 1px solid #222;
  border-radius: 16px;
  height: 350px;
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease;

  &:hover {
    border-color: #333;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }
`;

export const ChartCardTitle = styled.h3`
  font-size: 1rem;
  color: #fff;
  font-weight: 700;
  margin: 0 0 1.5rem 0;
  display: flex;
  justify-content: space-between;
`;

export const ChartSubtitle = styled.span`
  font-size: 0.8rem;
  color: #888;
  font-weight: 500;
`;

export const ChartContainerWrapper = styled.div`
  flex: 1;
  width: 100%;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const HeatmapCard = styled.div`
  padding: 1.5rem;
  background-color: #0A0A0A;
  border: 1px solid #222;
  border-radius: 16px;
  height: 250px;
  display: flex;
  flex-direction: column;
`;

export const Divider = styled.div`
  border-top: 1px solid #222;
  margin: 1rem 0;
`;

export const GridWidgets = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

export const Widget = styled.div`
  padding: 1.5rem;
  background-color: #0C0C0C;
  border: 1px solid #222;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease;

  &:hover {
    border-color: #333;
  }
`;

export const WidgetHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  color: #888;
  width: 100%;
`;

export const ScrollArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
  overflow-y: auto;
  max-height: 350px;
  padding-right: 0.5rem;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #333;
    border-radius: 4px;
  }
`;

export const EmptyStateContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #666;
  text-align: center;
  height: 100%;
  gap: 1rem;
`;

export const ClassItem = styled(motion.div)`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background-color: #141414;
  border: 1px solid #222;
  border-left: 4px solid ${props => props.$color || '#FFD700'};
  border-radius: 12px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #1a1a1a;
    border-color: #333;
    transform: translateX(2px);
  }
`;

export const TimeColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 80px;
  padding-right: 1rem;
  border-right: 1px solid #333;
`;

export const TimeStart = styled.span`
  color: #fff;
  font-weight: 800;
  font-size: 0.9rem;
`;

export const TimeEnd = styled.span`
  color: #666;
  font-size: 0.75rem;
  font-weight: 600;
`;

export const ClassDetails = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const ClassCode = styled.span`
  color: #FFD700;
  font-size: 0.75rem;
  font-weight: 800;
`;

export const ClassName = styled.span`
  color: #fff;
  font-weight: 700;
  font-size: 0.95rem;
  margin: 0.2rem 0;
`;

export const ClassRoom = styled.span`
  color: #888;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

export const FocusWidget = styled.div`
  padding: 2rem;
  background-color: #0C0C0C;
  border: 1px solid #222;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const TimerCircle = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #050505;
  box-shadow: inset 0 4px 10px rgba(0,0,0,0.5);
`;

export const TimerSvg = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

export const TimerText = styled.span`
  font-size: 3.5rem;
  font-weight: 900;
  font-family: monospace;
  color: #fff;
`;

export const TimerControls = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

export const PlayButton = styled.button`
  padding: 1rem;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  background-color: ${props => props.$isActive ? '#FF5252' : '#FFD700'};

  &:hover {
    transform: scale(1.05);
  }
`;

export const ResetButton = styled.button`
  padding: 1rem 1.5rem;
  background-color: #111;
  color: #fff;
  border: 1px solid #333;
  border-radius: 30px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #222;
  }
`;

export const MinuteOptions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
`;

export const MinuteButton = styled.button`
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: 1px solid #333;
  cursor: pointer;
  font-weight: 700;
  transition: all 0.2s ease;
  background-color: ${props => props.$isActive ? '#FFD700' : 'transparent'};
  color: ${props => props.$isActive ? '#000' : '#888'};

  &:hover {
    background-color: ${props => props.$isActive ? '#FFD700' : '#222'};
    color: ${props => props.$isActive ? '#000' : '#fff'};
  }
`;

export const ListItem = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #141414;
  border: 1px solid #222;
  border-radius: 12px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #1a1a1a;
    border-color: #333;
  }
`;

export const ItemTitle = styled.h4`
  font-weight: 700;
  font-size: 0.95rem;
  margin: 0 0 0.25rem 0;
  color: #fff;
`;

export const ItemSubtitle = styled.span`
  font-size: 0.8rem;
  color: ${props => props.$isUrgent ? '#FF5252' : '#888'};
  font-weight: 600;
`;

export const OutlineButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  font-weight: 800;
  background-color: transparent;
  color: #fff;
  border: 1px solid #333;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #222;
    border-color: #444;
  }
`;

export const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #FF5252;
  }
`;

export const FormContainer = styled.form`
  display: flex;
  gap: 0.5rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
  position: relative;
`;

export const ErrorMsg = styled.div`
  position: absolute;
  top: -1.5rem;
  left: 0.5rem;
  color: #FF5252;
  font-size: 0.8rem;
  font-weight: 700;
`;

export const InputField = styled.input`
  padding: 0.85rem;
  background-color: #141414;
  border: 1px solid #333;
  color: #fff;
  border-radius: 8px;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: #FFD700;
    box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.2);
  }
`;

export const SubmitButton = styled.button`
  padding: 0.85rem;
  background-color: #FFD700;
  color: #000;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.05);
    background-color: #E5A91A;
  }
`;
