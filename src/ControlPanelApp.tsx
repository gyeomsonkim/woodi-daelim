import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import ControlPanel, { FilterType } from './components/ControlPanel/ControlPanel';
import './App.css';

const ControlPanelApp: React.FC = () => {
  const [currentFilter, setCurrentFilter] = useState<FilterType>('none');
  const [isConnected, setIsConnected] = useState(false);
  const [mainDisplayConnected, setMainDisplayConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

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
  const handleFilterChange = (filter: FilterType) => {
    if (socket && isConnected) {
      socket.emit('changeFilter', { filter });
      console.log(`필터 변경 요청 전송: ${filter}`);
    } else {
      console.warn('소켓이 연결되지 않음');
    }
  };

  return (
    <div className="App">
      <div className="app-content">
        {/* 연결 상태 표시 */}
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          zIndex: 1000
        }}>
          {/* 소켓 서버 연결 상태 */}
          <div style={{
            background: isConnected 
              ? 'rgba(0, 255, 136, 0.1)' 
              : 'rgba(255, 82, 82, 0.1)',
            border: `2px solid ${isConnected ? '#00ff88' : '#ff5252'}`,
            borderRadius: '20px',
            padding: '6px 12px',
            backdropFilter: 'blur(10px)',
            fontSize: '12px',
            fontWeight: '500',
            color: isConnected ? '#00ff88' : '#ff5252',
          }}>
            <span style={{
              display: 'inline-block',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: isConnected ? '#00ff88' : '#ff5252',
              marginRight: '6px',
              animation: isConnected ? 'pulse 2s infinite' : 'none'
            }}></span>
            {isConnected ? '서버 연결됨' : '서버 연결 끊김'}
          </div>
          
          {/* 메인 디스플레이 연결 상태 */}
          <div style={{
            background: mainDisplayConnected 
              ? 'rgba(0, 255, 136, 0.1)' 
              : 'rgba(255, 165, 0, 0.1)',
            border: `2px solid ${mainDisplayConnected ? '#00ff88' : '#ffa500'}`,
            borderRadius: '20px',
            padding: '6px 12px',
            backdropFilter: 'blur(10px)',
            fontSize: '12px',
            fontWeight: '500',
            color: mainDisplayConnected ? '#00ff88' : '#ffa500',
          }}>
            <span style={{
              display: 'inline-block',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: mainDisplayConnected ? '#00ff88' : '#ffa500',
              marginRight: '6px',
              animation: mainDisplayConnected ? 'pulse 2s infinite' : 'none'
            }}></span>
            {mainDisplayConnected ? '메인 디스플레이 연결됨' : '메인 디스플레이 대기 중'}
          </div>
        </div>

        <ControlPanel 
          currentFilter={currentFilter}
          onFilterChange={handleFilterChange}
        />

        {/* 개발자 정보 */}
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          background: 'rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '10px',
          padding: '10px 15px',
          backdropFilter: 'blur(10px)',
          fontSize: '12px',
          color: 'rgba(255, 255, 255, 0.6)',
          zIndex: 1000
        }}>
          포토존 제어 패널 v1.0
        </div>
      </div>
    </div>
  );
};

export default ControlPanelApp; 