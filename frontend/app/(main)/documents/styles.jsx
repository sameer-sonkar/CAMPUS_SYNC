import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
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

export const UploadBar = styled.div`
  background-color: #0A0A0A;
  border: 1px solid #222;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
  align-items: flex-end;
  flex-wrap: wrap;
`;

export const InputGroup = styled.div`
  flex: 1;
  min-width: 250px;
`;

export const Label = styled.label`
  display: block;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #aaa;
  font-size: 0.9rem;
`;

export const Input = styled.input`
  width: 100%;
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
`;

export const UploadBtn = styled.button`
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #FFD700;
  color: #000;
  border: none;
  border-radius: 12px;
  font-weight: 800;
  font-size: 0.95rem;
  cursor: pointer;
  transition: transform 0.1s;
  opacity: ${props => props.disabled ? 0.7 : 1};

  &:active {
    transform: ${props => props.disabled ? 'none' : 'scale(0.95)'};
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
`;

export const EmptyState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
  background-color: #0A0A0A;
  border: 1px dashed #333;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

export const EmptyStateText = styled.p`
  margin: 0;
  font-size: 1.1rem;
`;

export const DocCard = styled(motion.div)`
  background-color: #0C0C0C;
  border: 1px solid #222;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: all 0.2s ease;

  &:hover {
    border-color: #333;
    transform: translateY(-4px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
`;

export const DeleteBtn = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background-color: rgba(255, 82, 82, 0.8);
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(255, 82, 82, 1);
  }
`;

export const PreviewArea = styled.div`
  height: 160px;
  width: 100%;
  background-color: #050505;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
`;

export const PdfPreview = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: white;
`;

export const PdfLabel = styled.span`
  font-size: 0.8rem;
  font-weight: 700;
`;

export const ImagePreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const NameStrip = styled.div`
  padding: 1rem;
  background-color: #111;
  border-top: 1px solid #222;
  text-align: center;
`;

export const DocNameText = styled.span`
  font-weight: 800;
  font-size: 0.9rem;
  color: #fff;
`;

export const LightboxOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.95);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: zoom-out;
  padding: 2rem;
`;

export const CloseLightboxBtn = styled.button`
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: transparent;
  color: white;
  border: none;
  cursor: pointer;
  z-index: 10000;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

export const IframePreview = styled(motion.iframe)`
  width: 90vw;
  height: 90vh;
  border: none;
  border-radius: 12px;
  background-color: white;
`;

export const ExpandedImage = styled(motion.img)`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 12px;
`;
