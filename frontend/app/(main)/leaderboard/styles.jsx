import styled, { keyframes, css } from 'styled-components';
import { motion } from 'framer-motion';

const glowPulse = keyframes`
  0% { box-shadow: 0 0 15px rgba(255, 215, 0, 0.2); }
  50% { box-shadow: 0 0 30px rgba(255, 215, 0, 0.5); }
  100% { box-shadow: 0 0 15px rgba(255, 215, 0, 0.2); }
`;

export const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  color: #fff;
`;

export const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

export const Title = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

export const Subtitle = styled.p`
  color: #888;
  font-size: 1.2rem;
  margin-top: 0.5rem;
`;

export const PodiumContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 1rem;
  margin-bottom: 5rem;
  height: 450px;
`;

export const PodiumSlot = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 250px;
`;

export const PodiumAvatar = styled.div`
  width: ${props => props.$rank === 1 ? '100px' : '80px'};
  height: ${props => props.$rank === 1 ? '100px' : '80px'};
  border-radius: 50%;
  background-color: #222;
  border: 4px solid ${props => 
    props.$rank === 1 ? '#FFD700' : 
    props.$rank === 2 ? '#C0C0C0' : '#CD7F32'};
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  overflow: hidden;
  position: relative;
  
  ${props => props.$rank === 1 && css`animation: ${glowPulse} 2s infinite;`}
`;

export const PodiumPillar = styled(motion.div)`
  width: 100%;
  background: ${props => 
    props.$rank === 1 ? 'linear-gradient(180deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 215, 0, 0.05) 100%)' : 
    props.$rank === 2 ? 'linear-gradient(180deg, rgba(192, 192, 192, 0.2) 0%, rgba(192, 192, 192, 0.05) 100%)' : 
    'linear-gradient(180deg, rgba(205, 127, 50, 0.2) 0%, rgba(205, 127, 50, 0.05) 100%)'};
  border-top: 4px solid ${props => 
    props.$rank === 1 ? '#FFD700' : 
    props.$rank === 2 ? '#C0C0C0' : '#CD7F32'};
  border-radius: 12px 12px 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 1.5rem;
`;

export const PillarRank = styled.h2`
  font-size: 3rem;
  font-weight: 900;
  margin: 0;
  color: ${props => 
    props.$rank === 1 ? '#FFD700' : 
    props.$rank === 2 ? '#C0C0C0' : '#CD7F32'};
  opacity: 0.8;
`;

export const PlayerName = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  text-align: center;
`;

export const PlayerScore = styled.div`
  font-size: 1.5rem;
  font-weight: 800;
  color: #FFD700;
  margin-bottom: 0.5rem;
`;

export const PlayerStats = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  text-align: center;
  color: #888;
  font-size: 0.85rem;
`;

export const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 800px;
  margin: 0 auto;
`;

export const ListItem = styled(motion.div)`
  background: rgba(20, 20, 20, 0.5);
  border: 1px solid #222;
  border-radius: 12px;
  padding: 1.5rem 2rem;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #444;
    transform: translateY(-2px);
    background: rgba(30, 30, 30, 0.8);
  }
`;

export const ListRank = styled.div`
  font-size: 1.5rem;
  font-weight: 800;
  color: #666;
  width: 50px;
`;

export const ListInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const ListName = styled.h4`
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
`;

export const ListBranch = styled.span`
  font-size: 0.85rem;
  color: #888;
`;

export const ListScoreBox = styled.div`
  text-align: right;
  margin-left: auto;
  min-width: 80px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

export const ListScore = styled.div`
  font-size: 1.5rem;
  font-weight: 800;
  color: #FFD700;
`;

export const ListStats = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-left: 2rem;
  color: #888;
  font-size: 0.9rem;
`;

export const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
`;

export const LoadingContainer = styled.div`
  height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFD700;
  font-size: 1.2rem;
  font-weight: 600;
`;
