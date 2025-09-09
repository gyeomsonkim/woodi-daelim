import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { UI_TEXT } from '../../utils/constants';

interface FooterProps {
  className?: string;
  showPerformanceInfo?: boolean;
  fps?: number;
}

const fadeInUp = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 0.9;
    transform: translateY(0);
  }
`;

const FooterContainer = styled.footer`
  width: 100%;
  max-width: 1200px;
  margin-top: 16px;
  padding: 20px;
  text-align: center;

  @media (min-width: 1920px) {
    max-width: 1400px;
    margin-top: 12px;
    margin-bottom: 20px;
    padding: 24px;
  }

  @media (max-width: 768px) {
    margin-top: 24px;
    padding: 16px;
  }

  @media (max-width: 480px) {
    margin-top: 20px;
    padding: 12px;
  }
`;

const Content = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const Description = styled.p`
  font-family: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: #E0E0E0;
  line-height: 1.7;
  margin: 0;
  padding: 0 16px;
  text-align: center;
  opacity: 0.9;
  letter-spacing: -0.2px;
  ${css`animation: ${fadeInUp} 1s ease-in-out;`}
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 1;
  }

  &::selection {
    background: rgba(30, 136, 229, 0.3);
    color: #FFFFFF;
  }

  &::-moz-selection {
    background: rgba(30, 136, 229, 0.3);
    color: #FFFFFF;
  }

  &:focus-visible {
    outline: 2px solid #1E88E5;
    outline-offset: 4px;
    border-radius: 4px;
  }

  @media (min-width: 1920px) {
    font-size: 18px;
    line-height: 1.8;
    opacity: 0.95;
  }

  @media (max-width: 768px) {
    font-size: 14px;
    line-height: 1.6;
    padding: 0 12px;
  }

  @media (max-width: 480px) {
    font-size: 13px;
    line-height: 1.5;
    padding: 0 8px;
  }

  @media (prefers-color-scheme: dark) {
    color: #E0E0E0;
  }

  @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const PerformanceInfo = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.8);
  color: #FFFFFF;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  z-index: 100;
  pointer-events: none;

  @media (max-width: 768px) {
    bottom: 16px;
    right: 16px;
    font-size: 10px;
    padding: 6px 8px;
  }

  @media (max-width: 480px) {
    bottom: 12px;
    right: 12px;
    font-size: 9px;
    padding: 4px 6px;
  }

  @media (prefers-color-scheme: dark) {
    background: rgba(0, 0, 0, 0.9);
    border-color: rgba(255, 255, 255, 0.15);
  }
`;

const Footer: React.FC<FooterProps> = ({ 
  className,
  showPerformanceInfo = false,
  fps = 0
}) => {
  return (
    <FooterContainer className={className}>
      <Content>
        <Description>
          {UI_TEXT.DESCRIPTION.split('\n').map((line, index) => (
            <React.Fragment key={index}>
              {line}
              {index < UI_TEXT.DESCRIPTION.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </Description>
        
        {showPerformanceInfo && process.env.NODE_ENV === 'development' && (
          <PerformanceInfo>
            <span>FPS: {fps}</span>
          </PerformanceInfo>
        )}
      </Content>
    </FooterContainer>
  );
};

export default Footer;