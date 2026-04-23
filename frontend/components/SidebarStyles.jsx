import styled from 'styled-components';
import { motion } from 'framer-motion';
import Link from 'next/link';

export const SidebarContainer = styled.div`
  width: 260px;
  height: 100vh;
  background-color: var(--surface);
  border-right: 1px solid rgba(0, 0, 0, 0.05);
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;

  @media (prefers-color-scheme: dark) {
    border-right: 1px solid rgba(255, 255, 255, 0.05);
  }
`;

export const BrandContainer = styled.div`
  padding: 0 1rem;
  margin-bottom: 3rem;
`;

export const BrandTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--text-main);
  margin: 0;
`;

export const BrandAccent = styled.span`
  color: var(--primary-dark);
`;

export const NavMenu = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const NavLinkContainer = styled(Link)`
  text-decoration: none;
`;

export const NavItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem 1rem;
  border-radius: 12px;
  background-color: ${props => props.$isActive ? 'var(--primary)' : 'transparent'};
  color: ${props => props.$isActive ? '#1A1D20' : 'var(--text-muted)'};
  font-weight: ${props => props.$isActive ? 700 : 600};
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    background-color: ${props => props.$isActive ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)'};
    color: ${props => props.$isActive ? '#1A1D20' : 'var(--text-main)'};
    transform: ${props => props.$isActive ? 'none' : 'translateX(4px)'};
  }
`;

export const ActiveIndicator = styled(motion.div)`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: var(--primary);
  border-radius: 12px;
  z-index: -1;
`;

export const FooterContainer = styled.div`
  margin-top: auto;
  padding: 1rem;
`;

export const SignOutButton = styled.div`
  color: var(--danger);
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0.875rem 1rem;
  border-radius: 12px;

  &:hover {
    background-color: rgba(255, 82, 82, 0.1);
    transform: translateX(4px);
  }
`;
