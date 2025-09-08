import React, { useEffect, useState } from 'react';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import PhotoZoneContainer from './components/PhotoZone/PhotoZoneContainer';
import { isBrowserSupported } from './utils/mediaUtils';
import { ERROR_MESSAGES, UI_TEXT } from './utils/constants';
import './App.css';

const App: React.FC = () => {
  const [browserSupported, setBrowserSupported] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
          <PhotoZoneContainer />
        </main>
        
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