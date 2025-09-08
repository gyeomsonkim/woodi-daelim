import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ControlPanelApp from './ControlPanelApp';
import { reportWebVitals } from './utils/reportWebVitals';

// 환경변수에 따라 다른 앱 로드
const AppComponent = process.env.REACT_APP_ENTRY === 'control-panel' ? ControlPanelApp : App;

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// 개발 모드에서는 StrictMode 사용
if (process.env.NODE_ENV === 'development') {
  root.render(
    <React.StrictMode>
      <AppComponent />
    </React.StrictMode>
  );
} else {
  // 프로덕션에서는 StrictMode 제거 (MediaPipe 호환성)
  root.render(<AppComponent />);
}

// 성능 측정 (선택사항)
reportWebVitals(console.log);