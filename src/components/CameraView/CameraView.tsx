import React, { useRef, useEffect, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { FilterType } from '../ControlPanel/ControlPanel';

interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  className?: string;
  currentFilter?: FilterType;
}

// Keyframes
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
`;

const floatFlower = keyframes`
  0%, 100% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.7;
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
    opacity: 1;
  }
`;

const twinkle = keyframes`
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
`;

const sway = keyframes`
  0%, 100% {
    transform: translateX(0) rotate(0deg);
  }
  25% {
    transform: translateX(-10px) rotate(-2deg);
  }
  75% {
    transform: translateX(10px) rotate(2deg);
  }
`;

const drift = keyframes`
  0%, 100% {
    transform: translateX(0) translateY(0);
    opacity: 0.6;
  }
  25% {
    transform: translateX(-15px) translateY(-10px);
    opacity: 0.8;
  }
  50% {
    transform: translateX(0) translateY(-20px);
    opacity: 1;
  }
  75% {
    transform: translateX(15px) translateY(-10px);
    opacity: 0.8;
  }
`;

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

interface VideoProps {
  $filterType: FilterType;
}

const Video = styled.video<VideoProps>`
  width: 100%;
  max-width: 1200px;
  height: auto;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
  background: #000000;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  object-fit: cover;

  /* Filter effects */
  ${props => props.$filterType === 'flower' && css`
    filter: hue-rotate(10deg) saturate(1.2) brightness(1.1);
  `}
  
  ${props => props.$filterType === 'space' && css`
    filter: hue-rotate(240deg) saturate(1.3) contrast(1.1);
  `}
  
  ${props => props.$filterType === 'forest' && css`
    filter: hue-rotate(90deg) saturate(1.1) brightness(0.95);
  `}

  &:hover {
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: 
      0 12px 48px rgba(0, 0, 0, 0.6),
      0 0 0 1px rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }

  &:focus-visible {
    outline: 2px solid #1E88E5;
    outline-offset: 2px;
  }

  @media (min-width: 1920px) {
    max-width: 1400px;
    border-radius: 20px;
    border-width: 3px;
    box-shadow: 
      0 12px 48px rgba(0, 0, 0, 0.5),
      0 0 0 1px rgba(255, 255, 255, 0.08);
  }

  @media (max-width: 768px) {
    border-radius: 12px;
    border-width: 1px;
    max-width: 100%;
    margin: 0 10px;
  }

  @media (max-width: 480px) {
    border-radius: 8px;
    margin: 0 10px;
  }

  @media (prefers-color-scheme: dark) {
    border-color: rgba(255, 255, 255, 0.15);

    &:hover {
      border-color: rgba(255, 255, 255, 0.25);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &:hover {
      transform: none;
    }
  }
`;

interface FilterOverlayProps {
  $filterType: FilterType;
}

const FilterOverlay = styled.div<FilterOverlayProps>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 5;
  border-radius: 16px;
  overflow: hidden;

  ${props => props.$filterType === 'flower' && css`
    background: linear-gradient(
      45deg,
      rgba(255, 182, 193, 0.1) 0%,
      rgba(255, 105, 180, 0.1) 50%,
      rgba(255, 20, 147, 0.1) 100%
    );
  `}

  ${props => props.$filterType === 'space' && css`
    background: linear-gradient(
      135deg,
      rgba(25, 25, 112, 0.15) 0%,
      rgba(72, 61, 139, 0.15) 50%,
      rgba(138, 43, 226, 0.15) 100%
    );
  `}

  ${props => props.$filterType === 'forest' && css`
    background: linear-gradient(
      180deg,
      rgba(34, 139, 34, 0.1) 0%,
      rgba(46, 125, 50, 0.1) 50%,
      rgba(27, 94, 32, 0.1) 100%
    );
  `}
`;

const FilterElements = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const FloatingEmoji = styled.span<{ $index: number; $filterType: FilterType }>`
  position: absolute;
  
  /* Flower filter positions and animations */
  ${props => props.$filterType === 'flower' && props.$index === 1 && css`
    top: 10%;
    left: 10%;
    font-size: 2rem;
    animation: ${floatFlower} 6s ease-in-out infinite;
  `}

  ${props => props.$filterType === 'flower' && props.$index === 2 && css`
    top: 20%;
    right: 15%;
    font-size: 1.5rem;
    animation: ${floatFlower} 8s ease-in-out infinite reverse;
  `}

  ${props => props.$filterType === 'flower' && props.$index === 3 && css`
    bottom: 15%;
    left: 20%;
    font-size: 1.8rem;
    animation: ${floatFlower} 7s ease-in-out infinite;
  `}

  ${props => props.$filterType === 'flower' && props.$index === 4 && css`
    bottom: 25%;
    right: 10%;
    font-size: 1.3rem;
    animation: ${floatFlower} 9s ease-in-out infinite reverse;
  `}

  /* Space filter positions and animations */
  ${props => props.$filterType === 'space' && props.$index === 1 && css`
    top: 15%;
    left: 20%;
    font-size: 1.5rem;
    animation: ${twinkle} 3s ease-in-out infinite;
  `}

  ${props => props.$filterType === 'space' && props.$index === 2 && css`
    top: 30%;
    right: 25%;
    font-size: 1.2rem;
    animation: ${twinkle} 4s ease-in-out infinite reverse;
  `}

  ${props => props.$filterType === 'space' && props.$index === 3 && css`
    bottom: 20%;
    left: 15%;
    font-size: 1.8rem;
    animation: ${twinkle} 5s ease-in-out infinite;
  `}

  ${props => props.$filterType === 'space' && props.$index === 4 && css`
    bottom: 35%;
    right: 20%;
    font-size: 1.3rem;
    animation: ${twinkle} 3.5s ease-in-out infinite reverse;
  `}

  /* Forest filter positions and animations */
  ${props => props.$filterType === 'forest' && props.$index === 1 && css`
    bottom: 10%;
    left: 10%;
    font-size: 2.5rem;
    animation: ${sway} 8s ease-in-out infinite;
  `}

  ${props => props.$filterType === 'forest' && props.$index === 2 && css`
    bottom: 15%;
    right: 20%;
    font-size: 2rem;
    animation: ${sway} 6s ease-in-out infinite reverse;
  `}

  ${props => props.$filterType === 'forest' && props.$index === 3 && css`
    top: 20%;
    left: 30%;
    font-size: 1.2rem;
    animation: ${drift} 10s ease-in-out infinite;
  `}

  ${props => props.$filterType === 'forest' && props.$index === 4 && css`
    top: 25%;
    right: 30%;
    font-size: 1.5rem;
    animation: ${drift} 12s ease-in-out infinite reverse;
  `}
`;

const ProcessingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  backdrop-filter: blur(2px);
`;

const ProcessingSpinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid #FFFFFF;
  border-radius: 50%;
  ${css`animation: ${spin} 1s linear infinite;`}
`;

const DebugInfo = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.7);
  color: #FFFFFF;
  font-size: 10px;
  font-family: 'Courier New', monospace;
  padding: 4px 8px;
  border-radius: 4px;
  z-index: 20;
  pointer-events: none;
`;

const CameraView: React.FC<CameraViewProps> = ({
  videoRef,
  className,
  currentFilter = 'none'
}) => {
  const getFilterEmojis = (filterType: FilterType) => {
    switch (filterType) {
      case 'flower':
        return ['🌸', '🌺', '🌻', '🌷'];
      case 'space':
        return ['⭐', '✨', '🌟', '💫'];
      case 'forest':
        return ['🌲', '🌳', '🍃', '🦋'];
      default:
        return [];
    }
  };

  return (
    <Container className={className}>
      {/* 카메라 비디오 */}
      <Video
        ref={videoRef}
        $filterType={currentFilter}
        playsInline
        muted
        autoPlay
      />
      
      {/* 필터 오버레이 */}
      {currentFilter !== 'none' && (
        <FilterOverlay $filterType={currentFilter}>
          <FilterElements>
            {getFilterEmojis(currentFilter).map((emoji, index) => (
              <FloatingEmoji 
                key={index}
                $index={index + 1}
                $filterType={currentFilter}
              >
                {emoji}
              </FloatingEmoji>
            ))}
          </FilterElements>
        </FilterOverlay>
      )}
    </Container>
  );
};

export default CameraView;