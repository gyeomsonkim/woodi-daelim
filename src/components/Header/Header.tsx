import React from 'react';
import styled from 'styled-components';
import { UI_TEXT } from '../../utils/constants';

interface HeaderProps {
  className?: string;
}

const HeaderContainer = styled.header`
  width: 100%;
  text-align: center;
  margin-bottom: 40px;
  z-index: 10;
  padding: 20px 0;

  @media (max-width: 768px) {
    margin-bottom: 30px;
    padding: 15px 0;
  }

  @media (max-width: 480px) {
    margin-bottom: 20px;
    padding: 10px 0;
  }
`;

const Title = styled.h1`
  font-family: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 32px;
  font-weight: 700;
  color: #FFFFFF;
  margin: 0;
  padding: 0;
  letter-spacing: -0.5px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  position: relative;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    text-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
  }

  @media (max-width: 768px) {
    font-size: 24px;
    letter-spacing: -0.3px;
  }

  @media (max-width: 480px) {
    font-size: 20px;
    letter-spacing: -0.2px;
  }

  @media (prefers-color-scheme: dark) {
    color: #FFFFFF;
  }

  @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;

const Divider = styled.div`
  margin-top: 12px;
  width: 80px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #FFFFFF, transparent);
  margin-left: auto;
  margin-right: auto;
  border-radius: 1px;
  opacity: 0.8;

  @media (max-width: 768px) {
    width: 60px;
    height: 1.5px;
    margin-top: 8px;
  }

  @media (max-width: 480px) {
    width: 50px;
    height: 1px;
    margin-top: 6px;
  }

  @media (prefers-color-scheme: dark) {
    background: linear-gradient(90deg, transparent, #FFFFFF, transparent);
  }
`;

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <HeaderContainer className={className}>
      <Title>
        {UI_TEXT.HEADER_TITLE}
      </Title>
      <Divider />
    </HeaderContainer>
  );
};

export default Header;