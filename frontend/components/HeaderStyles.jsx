import styled from 'styled-components';
import Link from 'next/link';
import { motion } from 'framer-motion';

export const HeaderLink = styled(Link)`
  text-decoration: none;
`;

export const ProfileWrapper = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 30px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
`;

export const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--primary);
  transition: transform 0.2s ease;

  ${ProfileWrapper}:hover & {
    transform: scale(1.05);
  }
`;

export const InitialsAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  color: #1A1D20;
  transition: transform 0.2s ease;

  ${ProfileWrapper}:hover & {
    transform: scale(1.05);
  }
`;
