import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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
  font-size: 2rem;
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

export const ProfileCard = styled(motion.div)`
  background-color: #0A0A0A;
  border: 1px solid #222;
  border-radius: 20px;
  padding: 2.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
`;

export const AvatarWrapper = styled.div`
  position: relative;
`;

export const ProfileImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #FFD700;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.15);
`;

export const InitialsAvatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #FFD700;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 900;
  color: #000;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.15);
`;

export const EditAvatarBtn = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: #222;
  padding: 0.5rem;
  border-radius: 50%;
  border: 2px solid #000;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
    background-color: #333;
  }
`;

export const InfoSection = styled.div`
  text-align: center;
  width: 100%;
`;

export const NameText = styled.h2`
  font-size: 1.75rem;
  font-weight: 800;
  color: #fff;
  margin: 0 0 0.5rem 0;
`;

export const EmailText = styled.p`
  color: #888;
  font-weight: 600;
  margin: 0;
`;

export const InputLarge = styled.input`
  font-size: 1.5rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 0.5rem;
  width: 100%;
  padding: 0.75rem;
  background-color: #141414;
  border: 1px solid #333;
  color: #fff;
  border-radius: 12px;
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #FFD700;
  }
`;

export const DetailsList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`;

export const DetailItem = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem 1.25rem;
  background-color: #111;
  border: 1px solid #222;
  border-radius: 16px;
  gap: 1rem;
  transition: all 0.2s ease;

  &:hover {
    border-color: #333;
    transform: translateY(-2px);
  }
`;

export const DetailContent = styled.div`
  flex: 1;
`;

export const DetailLabel = styled.div`
  font-size: 0.8rem;
  color: #888;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.25rem;
`;

export const DetailValue = styled.div`
  font-weight: 800;
  color: #fff;
  font-size: 1.05rem;
`;

export const InputSmall = styled.input`
  padding: 0.6rem 0.8rem;
  background-color: #1A1A1A;
  border: 1px solid #333;
  color: #fff;
  border-radius: 8px;
  outline: none;
  width: 100%;
  font-size: 0.95rem;

  &:focus {
    border-color: #FFD700;
  }
`;

export const SelectSmall = styled.select`
  padding: 0.6rem 0.8rem;
  background-color: #1A1A1A;
  border: 1px solid #333;
  color: #fff;
  border-radius: 8px;
  outline: none;
  width: 100%;
  font-size: 0.95rem;
  appearance: none;
  cursor: pointer;

  &:focus {
    border-color: #FFD700;
  }
`;

export const ActionGroup = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
  margin-top: 1rem;
`;

export const PrimaryBtn = styled.button`
  flex: 1;
  padding: 1rem;
  background-color: #FFD700;
  color: #000;
  border: none;
  border-radius: 12px;
  font-weight: 800;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.1s;
  opacity: ${props => props.disabled ? 0.7 : 1};

  &:active {
    transform: ${props => props.disabled ? 'none' : 'scale(0.97)'};
  }
`;

export const SecondaryBtn = styled.button`
  flex: 1;
  padding: 1rem;
  background-color: transparent;
  color: #fff;
  border: 1px solid #333;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #1A1A1A;
    border-color: #444;
  }
`;
