import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import PhotoZoneContainer from './components/PhotoZone/PhotoZoneContainer';
import { isBrowserSupported } from './utils/mediaUtils';
import { ERROR_MESSAGES, UI_TEXT } from './utils/constants';
import { FilterType } from './components/ControlPanel/ControlPanel';
import './App.css';

const App: React.FC = () => {
  const [browserSupported, setBrowserSupported] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentFilter, setCurrentFilter] = useState<FilterType>('none');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);

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

    // 연결 에러 처리
    newSocket.on('connect_error', (error) => {
      console.error('메인 디스플레이: 소켓 연결 에러:', error);
      setSocketConnected(false);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  // 로딩 중
  if (isLoading) {
    return (
      <div className="App">
        <div className="app-content">
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            gap: '20px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              border: '4px solid rgba(255, 255, 255, 0.2)',
              borderTop: '4px solid #FFFFFF',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <p style={{ 
              color: '#FFFFFF', 
              fontSize: '16px',
              opacity: 0.9 
            }}>
              포토존을 준비하는 중...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 브라우저 미지원
  if (browserSupported === false) {
    return (
      <div className="App">
        <div className="app-content">
          <Header />
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '60px 20px',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <div style={{ 
              fontSize: '64px', 
              marginBottom: '24px',
              opacity: 0.7
            }}>
              🚫
            </div>
            
            <h2 style={{
              fontSize: '24px',
              fontWeight: 600,
              color: '#FF5252',
              marginBottom: '16px',
              lineHeight: 1.4
            }}>
              지원되지 않는 브라우저
            </h2>
            
            <p style={{
              fontSize: '16px',
              color: '#E0E0E0',
              lineHeight: 1.6,
              marginBottom: '32px'
            }}>
              {ERROR_MESSAGES.UNSUPPORTED_BROWSER}
            </p>
            
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'left'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: 500,
                color: '#FFFFFF',
                marginBottom: '12px'
              }}>
                권장 브라우저:
              </h3>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                color: '#E0E0E0',
                fontSize: '14px',
                lineHeight: 1.8
              }}>
                <li>• Google Chrome (최신 버전)</li>
                <li>• Mozilla Firefox (최신 버전)</li>
                <li>• Microsoft Edge (최신 버전)</li>
                <li>• Safari 14+ (macOS/iOS)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 정상 렌더링
  return (
    <div className="App">
      <div className="app-content fade-in">
        <Header />
        
        <main style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <PhotoZoneContainer currentFilter={currentFilter} />
        </main>
        
        {/* 현재 적용된 필터 표시 */}
        {currentFilter !== 'none' && (
          <div style={{
            position: 'fixed',
            top: '20px',
            left: '20px',
            background: 'rgba(0, 0, 0, 0.7)',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '25px',
            fontSize: '16px',
            fontWeight: '500',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            zIndex: 1000
          }}>
            <span style={{ marginRight: '8px' }}>
              {currentFilter === 'flower' ? '🌸' : 
               currentFilter === 'space' ? '🌌' : 
               currentFilter === 'forest' ? '🌲' : ''}
            </span>
            {currentFilter === 'flower' ? '꽃 필터' :
             currentFilter === 'space' ? '우주 필터' :
             currentFilter === 'forest' ? '숲 필터' : ''} 적용 중
          </div>
        )}
        
        <Footer />
      </div>
      
      {/* 접근성을 위한 숨겨진 설명 */}
      <div className="sr-only">
        <p>
          대림대학교 포토존 웹 애플리케이션입니다. 
          카메라를 사용하여 실시간으로 배경을 제거한 사진을 촬영할 수 있습니다.
          카메라 접근 권한이 필요하며, 밝은 환경에서 더 좋은 결과를 얻을 수 있습니다.
        </p>
      </div>
    </div>
  );
};

export default App;