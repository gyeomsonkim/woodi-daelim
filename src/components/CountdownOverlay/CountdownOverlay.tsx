import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

interface CountdownOverlayProps {
  isActive: boolean;
  onComplete: () => void;
  onTick?: (count: number) => void;
}

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
    backdrop-filter: blur(0px);
  }
  to {
    opacity: 1;
    transform: scale(1);
    backdrop-filter: blur(2px);
  }
`;

const bounceIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.05);
  }
  100% {
    opacity: 0.8;
    transform: scale(1);
  }
`;

const flashOut = keyframes`
  0% {
    opacity: 0.6;
    transform: scale(1);
    background: rgba(255, 255, 255, 0.6);
  }
  50% {
    opacity: 0.4;
    transform: scale(1.1);
    background: rgba(255, 255, 255, 0.4);
  }
  100% {
    opacity: 0;
    transform: scale(1.2);
    background: rgba(255, 255, 255, 0);
  }
`;

const Overlay = styled.div<{ $show: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  display: ${props => props.$show ? 'flex' : 'none'};
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  backdrop-filter: blur(2px);
  animation: ${fadeIn} 0.3s ease-out;
  pointer-events: none;
`;

const CountdownContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: rgba(255, 255, 255, 0.05);

  padding: clamp(2rem, 4vw, 6rem) clamp(2.5rem, 5vw, 8rem);
  backdrop-filter: blur(5px);

  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  
  /* 모바일 세로 */
  @media (max-width: 767px) {
    padding: clamp(1.5rem, 6vw, 3rem);
    border-radius: 15px;
  }
  
  /* 태블릿 */
  @media (min-width: 768px) and (max-width: 1023px) {
    padding: clamp(2rem, 4vw, 4rem) clamp(3rem, 6vw, 6rem);
    border-radius: 20px;
  }
  
  /* 4K UHD */
  @media (min-width: 3840px) {
    border-radius: 40px;
    backdrop-filter: blur(8px);
    box-shadow: 0 16px 64px rgba(0, 0, 0, 0.4);
  }
`;

const CountdownNumber = styled.div<{ $isActive: boolean }>`
  font-size: clamp(8rem, 15vw, 24rem);
  font-weight: 900;
  color: rgba(255, 255, 255, 0.8);
  text-shadow: 
    0 0 30px rgba(255, 255, 255, 0.4),
    0 0 50px rgba(255, 255, 255, 0.2),
    0 0 80px rgba(255, 255, 255, 0.1);
  margin: 0;
  animation: ${props => props.$isActive ? bounceIn : 'none'} 0.6s ease-out;
  mix-blend-mode: overlay;
  line-height: 1;
  
  /* 모바일 세로 (320px - 767px) */
  @media (max-width: 767px) {
    font-size: clamp(4rem, 20vw, 8rem);
  }
  
  /* 태블릿 세로 (768px - 1023px) */
  @media (min-width: 768px) and (max-width: 1023px) {
    font-size: clamp(8rem, 12vw, 12rem);
  }
  
  /* 데스크톱 (1024px - 1919px) */
  @media (min-width: 1024px) and (max-width: 1919px) {
    font-size: clamp(10rem, 10vw, 16rem);
  }
  
  /* FHD (1920px - 2559px) */
  @media (min-width: 1920px) and (max-width: 2559px) {
    font-size: clamp(14rem, 8vw, 20rem);
  }
  
  /* QHD (2560px - 3839px) */
  @media (min-width: 2560px) and (max-width: 3839px) {
    font-size: clamp(18rem, 7vw, 24rem);
  }
  
  /* 4K UHD (3840px+) */
  @media (min-width: 3840px) {
    font-size: clamp(20rem, 6vw, 28rem);
    text-shadow: 
      0 0 40px rgba(255, 255, 255, 0.5),
      0 0 70px rgba(255, 255, 255, 0.3),
      0 0 100px rgba(255, 255, 255, 0.2);
  }
`;


const FlashOverlay = styled.div<{ $show: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(255, 255, 255, 0.6);
  display: ${props => props.$show ? 'block' : 'none'};
  z-index: 100000;
  animation: ${flashOut} 0.5s ease-out;
  mix-blend-mode: soft-light;
  pointer-events: none;
`;

const CountdownOverlay: React.FC<CountdownOverlayProps> = ({ 
  isActive, 
  onComplete, 
  onTick 
}) => {
  const [count, setCount] = useState(5);
  const [showFlash, setShowFlash] = useState(false);
  const [currentNumber, setCurrentNumber] = useState(5);

  useEffect(() => {
    if (isActive) {
      setCount(5);
      setCurrentNumber(5);
      setShowFlash(false);
      
      const countdown = setInterval(() => {
        setCount(prev => {
          const newCount = prev - 1;
          
          if (newCount > 0) {
            setCurrentNumber(newCount);
            onTick?.(newCount);
            return newCount;
          } else {
            // 카운트다운 완료 - 플래시 효과
            setShowFlash(true);
            clearInterval(countdown);
            
            // 플래시 효과 후 완료 콜백 호출
            setTimeout(() => {
              onComplete();
              setShowFlash(false);
            }, 500);
            
            return 0;
          }
        });
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [isActive, onComplete, onTick]);

  if (!isActive) return null;

  return (
    <>
      <Overlay $show={isActive && count > 0}>
     
          <CountdownNumber $isActive={count > 0}>
            {currentNumber}
          </CountdownNumber>
  
      </Overlay>
      
      <FlashOverlay $show={showFlash} />
    </>
  );
};

export default CountdownOverlay;