import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle, keyframes, css } from 'styled-components';
import { io, Socket } from 'socket.io-client';
import ControlPanel from './components/ControlPanel/ControlPanel';

// Global styles for ControlPanel App
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
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
  }
`;

const pulse = keyframes`
  0% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  background: radial-gradient(ellipse at center, #111111 0%, #000000 100%);
  position: relative;
  overflow: hidden;
`;

const AppContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 20px;
  gap: 0;
`;

const StatusIndicator = styled.div<{ $connected: boolean }>`
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 1000;
`;

const StatusItem = styled.div<{ $connected: boolean; $color: string }>`
  background: ${props => `rgba(${props.$color}, 0.1)`};
  border: ${props => `2px solid ${props.$connected ? '#00ff88' : props.$color === '255, 82, 82' ? '#ff5252' : '#ffa500'}`};
  border-radius: 20px;
  padding: 6px 12px;
  backdrop-filter: blur(10px);
  font-size: 12px;
  font-weight: 500;
  color: ${props => props.$connected ? '#00ff88' : props.$color === '255, 82, 82' ? '#ff5252' : '#ffa500'};
  display: flex;
  align-items: center;
  gap: 6px;
`;

const StatusDot = styled.span<{ $connected: boolean; $color: string }>`
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: ${props => props.$connected ? '#00ff88' : props.$color === '255, 82, 82' ? '#ff5252' : '#ffa500'};
  ${props => props.$connected ? css`animation: ${pulse} 2s infinite;` : 'animation: none;'}
`;

const DeveloperInfo = styled.div`
  position: fixed;
  bottom: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 10px 15px;
  backdrop-filter: blur(10px);
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  z-index: 1000;
`;

const ControlPanelApp: React.FC = () => {
  const [currentFilter, setCurrentFilter] = useState<TFilterType>('none');
  const [isConnected, setIsConnected] = useState(false);
  const [mainDisplayConnected, setMainDisplayConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  // 소켓 연결 및 통신 설정
  useEffect(() => {
    // 페이지 제목 설정
    document.title = '포토존 제어 패널';

    // 소켓 연결
    const newSocket = io('http://localhost:3002');
    setSocket(newSocket);

    // 연결 성공
    newSocket.on('connect', () => {
      console.log('소켓 서버에 연결됨');
      setIsConnected(true);
      // 제어 패널로 등록
      newSocket.emit('register', 'controlPanel');
    });

    // 연결 실패
    newSocket.on('disconnect', () => {
      console.log('소켓 서버 연결 해제됨');
      setIsConnected(false);
      setMainDisplayConnected(false);
    });

    // 연결 상태 업데이트
    newSocket.on('connectionStatus', (status) => {
      setMainDisplayConnected(status.mainDisplayConnected);
      console.log('연결 상태 업데이트:', status);
    });

    // 필터 업데이트 수신
    newSocket.on('filterUpdate', (data) => {
      setCurrentFilter(data.filter);
      console.log('필터 업데이트 수신:', data.filter);
    });

    // 촬영 시작 확인 수신
    newSocket.on('captureStarted', () => {
      console.log('컨트롤 패널: 촬영 시작 확인');
      setIsCapturing(true);
    });

    // 촬영 완료 수신
    newSocket.on('captureFinished', () => {
      console.log('컨트롤 패널: 촬영 완료');
      setIsCapturing(false);
    });

    // 카운트다운 업데이트 수신 (선택적으로 사용)
    newSocket.on('countdownUpdate', (data) => {
      console.log(`컨트롤 패널: 카운트다운 ${data.count}`);
    });

    // 연결 에러 처리
    newSocket.on('connect_error', (error) => {
      console.error('소켓 연결 에러:', error);
      setIsConnected(false);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  // 필터 변경 핸들러
  const handleFilterChange = (filter: TFilterType) => {
    if (socket && isConnected) {
      socket.emit('changeFilter', { filter });
      console.log(`필터 변경 요청 전송: ${filter}`);
    } else {
      console.warn('소켓이 연결되지 않음');
    }
  };

  // 사진 촬영 시작 핸들러
  const handleCapturePhoto = () => {
    if (socket && isConnected && mainDisplayConnected && !isCapturing) {
      socket.emit('startCapture');
      console.log('사진 촬영 시작 요청 전송');
    } else {
      if (!isConnected) {
        console.warn('소켓 서버가 연결되지 않음');
      } else if (!mainDisplayConnected) {
        console.warn('메인 디스플레이가 연결되지 않음');
      } else if (isCapturing) {
        console.warn('이미 촬영 중입니다');
      }
    }
  };

  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <AppContent>
          {/* 연결 상태 표시 */}
          <StatusIndicator $connected={isConnected}>
            {/* 소켓 서버 연결 상태 */}
            <StatusItem $connected={isConnected} $color="255, 82, 82">
              <StatusDot $connected={isConnected} $color="255, 82, 82" />
              {isConnected ? '서버 연결됨' : '서버 연결 끊김'}
            </StatusItem>
            
            {/* 메인 디스플레이 연결 상태 */}
            <StatusItem $connected={mainDisplayConnected} $color="255, 165, 0">
              <StatusDot $connected={mainDisplayConnected} $color="255, 165, 0" />
              {mainDisplayConnected ? '메인 디스플레이 연결됨' : '메인 디스플레이 대기 중'}
            </StatusItem>
          </StatusIndicator>

          <ControlPanel 
            currentFilter={currentFilter}
            onFilterChange={handleFilterChange}
            onCapturePhoto={handleCapturePhoto}
            isCapturing={isCapturing}
          />

          {/* 개발자 정보 */}
          <DeveloperInfo>
            포토존 제어 패널 v1.0
          </DeveloperInfo>
        </AppContent>
      </AppContainer>
    </>
  );
};

export default ControlPanelApp; 