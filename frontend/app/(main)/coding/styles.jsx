import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
  font-family: system-ui, -apple-system, sans-serif;
`;

export const LoadingContainer = styled.div`
  padding: 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: #888;
`;

export const LoadingText = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
`;

export const HeroSection = styled.div`
  position: relative;
  overflow: hidden;
  padding: 3.5rem 2.5rem;
  background-color: #0A0A0A;
  border: 1px solid #222;
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
`;

export const HeroBgPattern = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.15;
  background-image: linear-gradient(#444 1px, transparent 1px), linear-gradient(90deg, #444 1px, transparent 1px);
  background-size: 40px 40px;
`;

export const HeroBgGlow = styled.div`
  position: absolute;
  top: -60%;
  left: -10%;
  width: 60%;
  height: 200%;
  background: radial-gradient(circle, rgba(49, 140, 231, 0.12) 0%, transparent 70%);
  pointer-events: none;
`;

export const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 2.5rem;
`;

export const HeroTextCol = styled.div`
  flex: 1;
  min-width: 300px;
`;

export const HeroBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  padding: 0.4rem 1rem 0.4rem 0.4rem;
  background-color: rgba(255, 255, 255, 0.03);
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.08);
`;

export const HeroBadgeIcon = styled.div`
  padding: 0.4rem;
  background-color: #318CE7;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const HeroBadgeText = styled.span`
  font-size: 0.85rem;
  color: #ccc;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 600;
`;

export const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  margin: 0 0 0.75rem 0;
  background: linear-gradient(135deg, #ffffff 0%, #a0a0a0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -1.5px;
  line-height: 1.1;
`;

export const HeroSubtitle = styled.p`
  color: #888;
  font-size: 1.15rem;
  margin: 0;
  max-width: 550px;
  line-height: 1.6;
  font-weight: 400;
`;

export const StreakCard = styled(motion.div)`
  background-color: rgba(0, 0, 0, 0.5);
  padding: 1.5rem 2.5rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 82, 82, 0.2);
  backdrop-filter: blur(10px);
  text-align: center;
  box-shadow: 0 10px 30px rgba(255, 82, 82, 0.1);
`;

export const StreakValue = styled.div`
  font-size: 3rem;
  font-weight: 800;
  color: #FF5252;
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  line-height: 1;
`;

export const StreakLabel = styled.div`
  font-size: 0.85rem;
  color: #FF5252;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-weight: 700;
  opacity: 0.8;
`;

export const TabNav = styled.div`
  display: flex;
  gap: 0.5rem;
  background-color: rgba(0, 0, 0, 0.4);
  padding: 0.5rem;
  border-radius: 16px;
  border: 1px solid #222;
  width: fit-content;
  margin: 0 auto 1rem auto;
`;

export const TabButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: transparent;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  position: relative;
  z-index: 1;
  font-size: 0.95rem;
  transition: color 0.2s;

  color: ${props => props.$isActive ? '#fff' : '#888'};
  font-weight: ${props => props.$isActive ? 600 : 500};

  &:hover {
    color: ${props => props.$isActive ? '#fff' : '#bbb'};
  }
`;

export const ActiveTabPill = styled(motion.div)`
  position: absolute;
  inset: 0;
  background-color: #222;
  border-radius: 12px;
  z-index: -1;
  border: 1px solid #333;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
`;

export const TrackerGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
`;

export const Col = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const SuggestionCard = styled.div`
  padding: 1.5rem;
  background-color: #141414;
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(255, 215, 0, 0.05);
`;

export const SuggestionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #FFD700;
  margin-bottom: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 1px;
`;

export const SuggestionTitle = styled.h3`
  font-size: 1.5rem;
  color: #fff;
  font-weight: 800;
  margin: 0 0 0.5rem 0;
`;

export const SuggestionTags = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

export const DiffBadge = styled.span`
  font-size: 0.85rem;
  color: #00b8a3;
  background-color: rgba(0, 184, 163, 0.15);
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  font-weight: 700;
`;

export const TopicBadge = styled.span`
  font-size: 0.85rem;
  color: #888;
  background-color: #222;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  font-weight: 600;
`;

export const SolveBtn = styled.button`
  width: 100%;
  padding: 0.85rem;
  background-color: #FFD700;
  color: #000;
  border: none;
  border-radius: 10px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #E5A91A;
    transform: translateY(-2px);
  }
`;

export const LogFormCard = styled.div`
  padding: 2rem;
  background-color: #0A0A0A;
  border: 1px solid #222;
  border-radius: 20px;
`;

export const LogFormHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #fff;
  margin-bottom: 1.5rem;
`;

export const LogFormTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 800;
  margin: 0;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const InputRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.5rem;
`;

export const Input = styled.input`
  padding: 0.85rem 1rem;
  background-color: #141414;
  border: 1px solid #333;
  color: #fff;
  border-radius: 8px;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: #FFD700;
  }
`;

export const Select = styled.select`
  padding: 0.85rem 1rem;
  background-color: #141414;
  border: 1px solid #333;
  color: #fff;
  border-radius: 8px;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: #FFD700;
  }
`;

export const SubmitBtn = styled.button`
  padding: 1rem;
  background-color: #00b8a3;
  color: #000;
  border: none;
  border-radius: 10px;
  font-weight: 800;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: #009688;
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

export const StatCardLarge = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background-color: #141414;
  border: 1px solid #222;
  border-radius: 20px;
`;

export const StatLabelLarge = styled.div`
  font-size: 0.85rem;
  color: #888;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

export const StatValueLarge = styled.div`
  font-size: 3rem;
  font-weight: 900;
  color: #fff;
  line-height: 1;
`;

export const StatIconLarge = styled.div`
  padding: 1.5rem;
  background-color: #0A0A0A;
  border-radius: 50%;
  border: 1px solid #333;
`;

export const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
`;

export const ChartCardPie = styled.div`
  padding: 1.5rem;
  background-color: #0A0A0A;
  border: 1px solid #222;
  border-radius: 20px;
  height: 250px;
  display: flex;
  flex-direction: column;
`;

export const ChartCardBar = styled.div`
  padding: 1.5rem;
  background-color: #0A0A0A;
  border: 1px solid #222;
  border-radius: 20px;
  height: 300px;
  display: flex;
  flex-direction: column;
`;

export const CardTitle = styled.h4`
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
`;

export const ChartEmpty = styled.div`
  color: #666;
  text-align: center;
  margin-top: 3rem;
`;

export const RecentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const RecentItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background-color: #141414;
  border: 1px solid #333;
  border-radius: 8px;
`;

export const RecentTitle = styled.div`
  color: #fff;
  font-size: 0.95rem;
  font-weight: 600;
`;

export const RecentMeta = styled.div`
  color: #888;
  font-size: 0.8rem;
`;

export const RecentDiff = styled.div`
  font-size: 0.8rem;
  font-weight: 700;
  color: ${props => props.$diff === 'Easy' ? '#00b8a3' : props.$diff === 'Medium' ? '#FFD700' : '#FF5252'};
`;

export const ChallengesGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 2rem;
`;

export const PlatformCard = styled.div`
  background-color: #0C0C0C;
  border: 1px solid #222;
  border-top: 4px solid ${props => props.$color};
  border-radius: 20px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
`;

export const PlatformGlow = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 150px;
  background: radial-gradient(ellipse at top, ${props => props.$color}15 0%, transparent 70%);
  pointer-events: none;
`;

export const PlatformHeader = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

export const PlatformTitleBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const PlatformIconWrap = styled.div`
  padding: 0.6rem;
  border-radius: 10px;
  background-color: ${props => props.$bgColor};
`;

export const PlatformName = styled.h2`
  font-size: 1.35rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
  letter-spacing: -0.5px;
`;

export const StreakPill = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: rgba(255, 82, 82, 0.1);
  border: 1px solid rgba(255, 82, 82, 0.2);
  color: #FF5252;
  padding: 0.4rem 1rem;
  border-radius: 30px;
  font-size: 0.9rem;
  font-weight: 700;
`;

export const MsgAlert = styled(motion.div)`
  position: relative;
  z-index: 1;
  padding: 1rem;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: ${props => props.$isError ? 'rgba(255, 82, 82, 0.1)' : 'rgba(0, 184, 163, 0.1)'};
  color: ${props => props.$isError ? '#FF5252' : '#00b8a3'};
  border: 1px solid ${props => props.$isError ? 'rgba(255, 82, 82, 0.2)' : 'rgba(0, 184, 163, 0.2)'};
`;

export const UnlinkedBox = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-top: auto;
  background-color: #141414;
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px solid #222;
`;

export const UnlinkedText = styled.p`
  color: #888;
  font-size: 0.95rem;
  margin: 0;
  font-weight: 500;
`;

export const LinkRow = styled.div`
  display: flex;
  gap: 0.75rem;
`;

export const LinkBtn = styled.button`
  padding: 0 1.5rem;
  background-color: ${props => props.$color};
  color: #000;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: transform 0.1s;

  &:active {
    transform: scale(0.97);
  }
`;

export const ChallengeBox = styled.div`
  position: relative;
  z-index: 1;
  background-color: #141414;
  padding: 1.75rem;
  border-radius: 16px;
  margin-top: auto;
  display: flex;
  flex-direction: column;
  transition: all 0.3s;
  border: 1px solid ${props => props.$isSolved ? '#00b8a3' : '#222'};
`;

export const ChallengeHeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

export const ChallengeLabel = styled.span`
  font-size: 0.8rem;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
`;

export const SolvedBadge = styled.span`
  background-color: #00b8a3;
  color: #000;
  font-size: 0.75rem;
  font-weight: 800;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

export const ChallengeName = styled.h3`
  font-size: 1.35rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 0.75rem 0;
  line-height: 1.4;
`;

export const DiffPill = styled.span`
  display: inline-flex;
  padding: 0.3rem 0.8rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  background-color: ${props => props.$color}15;
  color: ${props => props.$color};
  border: 1px solid ${props => props.$color}30;
`;

export const ChallengeBtns = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

export const BtnSolveLink = styled.button`
  width: 100%;
  padding: 0.85rem;
  background-color: #222;
  color: #fff;
  border: 1px solid #333;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  transition: background 0.2s;

  &:hover {
    background-color: #2A2A2A;
  }
`;

export const BtnVerify = styled.button`
  flex: 1;
  padding: 0.85rem;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
  
  background-color: ${props => props.$isSolved ? '#222' : '#fff'};
  color: ${props => props.$isSolved ? '#00b8a3' : '#000'};
  border: ${props => props.$isSolved ? '1px solid #00b8a3' : 'none'};
  cursor: ${props => props.$isSolved ? 'default' : 'pointer'};
  opacity: ${props => props.$isVerifying ? 0.7 : 1};

  &:active {
    transform: ${props => props.$isSolved ? 'none' : 'scale(0.97)'};
  }
`;

export const ContestsCard = styled.div`
  background-color: #0C0C0C;
  border: 1px solid #222;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
`;

export const ContestsHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #222;
`;

export const ContestsIconWrap = styled.div`
  padding: 0.75rem;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
`;

export const ContestsTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 0.25rem 0;
`;

export const ContestsSubtitle = styled.p`
  color: #888;
  margin: 0;
  font-size: 0.95rem;
`;

export const ContestsMsg = styled.div`
  padding: 4rem;
  text-align: center;
  color: #666;
  font-size: 1.1rem;
  font-weight: 500;
`;

export const ContestsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const ContestItem = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background-color: #141414;
  border-radius: 12px;
  border: 1px solid #222;
  transition: border-color 0.2s;
  cursor: default;

  &:hover {
    border-color: #333;
  }
`;

export const ContestLeft = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
`;

export const ContestDateBox = styled.div`
  text-align: center;
  background-color: #0A0A0A;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  min-width: 70px;
  border: 1px solid #222;
`;

export const ContestMonth = styled.div`
  font-size: 0.8rem;
  color: #888;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 0.2rem;
`;

export const ContestDate = styled.div`
  font-size: 1.5rem;
  color: #fff;
  font-weight: 800;
`;

export const ContestPlatform = styled.div`
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.35rem;
  color: ${props => props.$color};
`;

export const ContestName = styled.h3`
  font-size: 1.15rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 0.35rem 0;
`;

export const ContestMeta = styled.div`
  color: #888;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const BtnRegister = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #fff;
  color: #000;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: transform 0.1s;

  &:active {
    transform: scale(0.95);
  }
`;

export const StudyGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
`;

export const StudyCard = styled.div`
  background-color: #0C0C0C;
  border: 1px solid #222;
  border-radius: 16px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: 100%;
  transition: all 0.3s;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);

  &:hover {
    border-color: #444;
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
  }
`;

export const StudyIconWrap = styled.div`
  padding: 1rem;
  background-color: #141414;
  border-radius: 12px;
  display: inline-flex;
  align-self: flex-start;
  border: 1px solid #333;
`;

export const StudyMeta = styled.div`
  font-size: 0.8rem;
  font-weight: 700;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.5rem;
`;

export const StudyTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
  line-height: 1.4;
`;
