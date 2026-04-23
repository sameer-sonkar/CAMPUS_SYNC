import styled from 'styled-components';

export const LayoutWrapper = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
  background-color: var(--background);
`;

export const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
`;

export const HeaderBar = styled.header`
  height: 80px;
  background-color: var(--surface);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  padding: 0 2rem;
  justify-content: flex-end;
  
  @media (prefers-color-scheme: dark) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
`;

export const PageScrollArea = styled.main`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  position: relative;

  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #333;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;
