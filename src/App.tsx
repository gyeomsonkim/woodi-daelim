import React, { useEffect, useState } from 'react';
import styled, { createGlobalStyle, keyframes, css } from 'styled-components';
import { io, Socket } from 'socket.io-client';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import PhotoZoneContainer from './components/PhotoZone/PhotoZoneContainer';
import CountdownOverlay from './components/CountdownOverlay/CountdownOverlay';
import { isBrowserSupported } from './utils/mediaUtils';
import { ERROR_MESSAGES, UI_TEXT } from './utils/constants';

// Global styles
const GlobalStyle = createGlobalStyle`
  /* CSS 리셋 및 기본 설정 */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  *,
  *::before,
  *::after {
    box-sizing: inherit;
  }

  html {
    box-sizing: border-box;
    font-size: 16px;
    line-height: 1.5;
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
  }

  body {
    font-family: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;
    background-color: #000000;
    color: #FFFFFF;
    min-height: 100vh;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  /* 스크롤바 스타일링 */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
  }

  /* 포커스 스타일 */
  *:focus-visible {
    outline: 2px solid #1E88E5;
    outline-offset: 2px;
    border-radius: 2px;
  }

  /* 선택 텍스트 스타일 */
  ::selection {
    background: rgba(30, 136, 229, 0.3);
    color: #FFFFFF;
  }

  ::-moz-selection {
    background: rgba(30, 136, 229, 0.3);
    color: #FFFFFF;
  }

  /* 버튼 기본 스타일 */
  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    background: none;
    padding: 0;
    margin: 0;
    outline: none;
    transition: all 0.3s ease;
  }

  button:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  /* 링크 스타일 */
  a {
    color: #1E88E5;
    text-decoration: none;
    transition: color 0.3s ease;
  }

  a:hover {
    color: #42A5F5;
  }

  /* 이미지 최적화 */
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* 비디오 최적화 */
  video {
    max-width: 100%;
    height: auto;
  }

  /* Canvas 최적화 */
  canvas {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* 유틸리티 클래스 */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .visually-hidden {
    position: absolute !important;
    clip: rect(1px, 1px, 1px, 1px);
    padding: 0 !important;
    border: 0 !important;
    height: 1px !important;
    width: 1px !important;
    overflow: hidden;
  }

  /* 고대비 모드 지원 */
  @media (prefers-contrast: high) {
    body {
      background: #000000;
      color: #FFFFFF;
    }
    
    button {
      border: 2px solid currentColor;
    }
  }

  /* 모션 감소 모드 지원 */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }

  /* 다크모드 지원 (기본이 다크모드이므로 라이트모드 대응) */
  @media (prefers-color-scheme: light) {
    /* 라이트모드에서도 다크 테마 유지 */
    body {
      background-color: #000000;
      color: #FFFFFF;
    }
  }

  /* 프린트 스타일 */
  @media print {
    body {
      background: white !important;
      color: black !important;
    }
    
    * {
      box-shadow: none !important;
      text-shadow: none !important;
    }
  }
`;

// Keyframes
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-20px);
  }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Styled components
const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  background: radial-gradient(ellipse at center, #111111 0%, #000000 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 50%, rgba(30, 136, 229, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(30, 136, 229, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 40% 80%, rgba(30, 136, 229, 0.04) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }

  & > * {
    position: relative;
    z-index: 1;
  }

  @media (prefers-contrast: high) {
    &::before {
      display: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    &::before {
      animation: none;
    }
  }

  @media print {
    &::before {
      display: none !important;
    }
  }
`;

const AppContent = styled.div<{ $fadeIn?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 20px;
  gap: 0;

  ${props => props.$fadeIn && css`animation: ${fadeIn} 0.5s ease-in-out;`}

  @media (max-width: 768px) {
    padding: 15px;
    max-width: 100%;
  }

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 20px;
`;

const LoadingSpinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid rgba(255, 255, 255, 0.2);
  border-top: 4px solid #FFFFFF;
  border-radius: 50%;
  ${css`animation: ${spin} 1s linear infinite;`}
`;

const LoadingText = styled.p`
  color: #FFFFFF;
  font-size: 16px;
  opacity: 0.9;
`;

const UnsupportedContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 60px 20px;
  max-width: 600px;
  margin: 0 auto;
`;

const UnsupportedIcon = styled.div`
  font-size: 64px;
  margin-bottom: 24px;
  opacity: 0.7;
`;

const UnsupportedTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #FF5252;
  margin-bottom: 16px;
  line-height: 1.4;
`;

const UnsupportedDescription = styled.p`
  font-size: 16px;
  color: #E0E0E0;
  line-height: 1.6;
  margin-bottom: 32px;
`;

const BrowserList = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  text-align: left;
`;

const BrowserListTitle = styled.h3`
  font-size: 16px;
  font-weight: 500;
  color: #FFFFFF;
  margin-bottom: 12px;
`;

const BrowserListItems = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  color: #E0E0E0;
  font-size: 14px;
  line-height: 1.8;

  li {
    margin: 0;
  }
`;

const MainContent = styled.main`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const FilterIndicator = styled.div`
  position: fixed;
  top: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: #ffffff;
  padding: 12px 20px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 500;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const App: React.FC = () => {
  const [browserSupported, setBrowserSupported] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentFilter, setCurrentFilter] = useState<TFilterType>('none');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const [captureCallback, setCaptureCallback] = useState<(() => void) | null>(null);

  // 브라우저 지원 확인
  useEffect(() => {
    const checkBrowserSupport = () => {
      const supported = isBrowserSupported();
      setBrowserSupported(supported);
      setIsLoading(false);
    };

    // DOM이 완전히 로드된 후 확인
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', checkBrowserSupport);
    } else {
      checkBrowserSupport();
    }

    return () => {
      document.removeEventListener('DOMContentLoaded', checkBrowserSupport);
    };
  }, []);

  // 페이지 제목 설정
  useEffect(() => {
    document.title = UI_TEXT.HEADER_TITLE;
  }, []);

  // 소켓 연결 및 통신 설정
  useEffect(() => {
    // 소켓 연결
    const newSocket = io('http://localhost:3002');
    setSocket(newSocket);

    // 연결 성공
    newSocket.on('connect', () => {
      console.log('메인 디스플레이: 소켓 서버에 연결됨');
      setSocketConnected(true);
      // 메인 디스플레이로 등록
      newSocket.emit('register', 'mainDisplay');
    });

    // 연결 실패
    newSocket.on('disconnect', () => {
      console.log('메인 디스플레이: 소켓 서버 연결 해제됨');
      setSocketConnected(false);
    });

    // 필터 업데이트 수신
    newSocket.on('filterUpdate', (data) => {
      setCurrentFilter(data.filter);
      console.log(`메인 디스플레이: 필터 적용됨 - ${data.filter}`);
    });

    // 카운트다운 시작 수신
    newSocket.on('startCountdown', () => {
      console.log('메인 디스플레이: 카운트다운 시작');
      setIsCountdownActive(true);
    });

    // 연결 에러 처리
    newSocket.on('connect_error', (error) => {
      console.error('메인 디스플레이: 소켓 연결 에러:', error);
      setSocketConnected(false);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  // 카운트다운 틱 핸들러
  const handleCountdownTick = (count: number) => {
    if (socket && socketConnected) {
      socket.emit('countdownTick', { count });
    }
  };

  // 카운트다운 완료 핸들러
  const handleCountdownComplete = () => {
    console.log('메인 디스플레이: 카운트다운 완료, 사진 촬영 시작');
    setIsCountdownActive(false);
    
    // 사진 촬영 실행
    if (captureCallback) {
      captureCallback();
    }
    
    // 촬영 완료 이벤트 전송
    if (socket && socketConnected) {
      socket.emit('captureComplete');
    }
  };

  // PhotoZoneContainer에서 사진 촬영 콜백 설정
  const setCaptureFunction = (captureFunc: () => void) => {
    setCaptureCallback(() => captureFunc);
  };

  const getFilterEmoji = (filter: TFilterType) => {
    switch (filter) {
      case 'flower': return '🌸';
      case 'space': return '🌌';
      case 'forest': return '🌲';
      default: return '';
    }
  };

  const getFilterName = (filter: TFilterType) => {
    switch (filter) {
      case 'flower': return '꽃 필터';
      case 'space': return '우주 필터';
      case 'forest': return '숲 필터';
      default: return '';
    }
  };

  // 로딩 중
  if (isLoading) {
    return (
      <>
        <GlobalStyle />
        <AppContainer>
          <AppContent>
            <LoadingContainer>
              <LoadingSpinner />
              <LoadingText>포토존을 준비하는 중...</LoadingText>
            </LoadingContainer>
          </AppContent>
        </AppContainer>
      </>
    );
  }

  // 브라우저 미지원
  if (browserSupported === false) {
    return (
      <>
        <GlobalStyle />
        <AppContainer>
          <AppContent>
            <Header />
            
            <UnsupportedContainer>
              <UnsupportedIcon>🚫</UnsupportedIcon>
              
              <UnsupportedTitle>지원되지 않는 브라우저</UnsupportedTitle>
              
              <UnsupportedDescription>
                {ERROR_MESSAGES.UNSUPPORTED_BROWSER}
              </UnsupportedDescription>
              
              <BrowserList>
                <BrowserListTitle>권장 브라우저:</BrowserListTitle>
                <BrowserListItems>
                  <li>• Google Chrome (최신 버전)</li>
                  <li>• Mozilla Firefox (최신 버전)</li>
                  <li>• Microsoft Edge (최신 버전)</li>
                  <li>• Safari 14+ (macOS/iOS)</li>
                </BrowserListItems>
              </BrowserList>
            </UnsupportedContainer>
          </AppContent>
        </AppContainer>
      </>
    );
  }

  // 정상 렌더링
  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <AppContent $fadeIn>
          <Header />
          
          <MainContent>
            <PhotoZoneContainer 
              currentFilter={currentFilter} 
              onSetCaptureFunction={setCaptureFunction}
            />
          </MainContent>
          
          {/* 현재 적용된 필터 표시 */}
          {currentFilter !== 'none' && (
            <FilterIndicator>
              <span>{getFilterEmoji(currentFilter)}</span>
              <span>{getFilterName(currentFilter)} 적용 중</span>
            </FilterIndicator>
          )}
          
          <Footer />
        </AppContent>
        
        {/* 접근성을 위한 숨겨진 설명 */}
        <div className="sr-only">
          <p>
            대림대학교 포토존 웹 애플리케이션입니다. 
            카메라를 사용하여 실시간으로 배경을 제거한 사진을 촬영할 수 있습니다.
            카메라 접근 권한이 필요하며, 밝은 환경에서 더 좋은 결과를 얻을 수 있습니다.
          </p>
        </div>
      </AppContainer>
      
      {/* 카운트다운 오버레이 - AppContainer 외부에 위치 */}
      <CountdownOverlay
        isActive={isCountdownActive}
        onComplete={handleCountdownComplete}
        onTick={handleCountdownTick}
      />
    </>
  );
};

export default App;