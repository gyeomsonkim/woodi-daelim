// 상수 정의

// 성능 설정
export const PERFORMANCE_CONFIG = {
  TARGET_FPS: 30,
  FRAME_INTERVAL: 1000 / 30, // 33.33ms
  MAX_PROCESSING_QUEUE: 2,
  SEGMENTATION_THRESHOLD: 0.1,
} as const;

// Canvas 설정
export const CANVAS_CONFIG = {
  DEFAULT_WIDTH: 1280,
  DEFAULT_HEIGHT: 720,
  MOBILE_WIDTH: 640,
  MOBILE_HEIGHT: 480,
  ASPECT_RATIO: 16 / 9,
} as const;

// MediaPipe 설정
export const MEDIAPIPE_CONFIG = {
  MODEL_SELECTION: 1, // 풍경 모델 (더 정확함)
  SELFIE_MODE: true,
  CDN_BASE_URL: 'https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/',
} as const;

// 카메라 설정
export const CAMERA_CONSTRAINTS: MediaStreamConstraints = {
  video: {
    width: { ideal: CANVAS_CONFIG.DEFAULT_WIDTH },
    height: { ideal: CANVAS_CONFIG.DEFAULT_HEIGHT },
    frameRate: { ideal: PERFORMANCE_CONFIG.TARGET_FPS },
    facingMode: 'user', // 전면 카메라
  },
  audio: false,
};

// 색상 팔레트
export const COLORS = {
  BACKGROUND_PRIMARY: '#000000',
  TEXT_PRIMARY: '#FFFFFF',
  TEXT_SECONDARY: '#E0E0E0',
  ACCENT_COLOR: '#1E88E5',
  ERROR_COLOR: '#FF5252',
  WARNING_COLOR: '#FF9800',
  SUCCESS_COLOR: '#4CAF50',
} as const;

// 브레이크포인트
export const BREAKPOINTS = {
  MOBILE: 767,
  TABLET: 1024,
  DESKTOP: 1920,
} as const;

// 애니메이션 시간
export const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
} as const;

// 에러 메시지
export const ERROR_MESSAGES = {
  CAMERA_ACCESS_DENIED: '카메라 접근 권한이 거부되었습니다. 브라우저 설정에서 카메라 권한을 허용해주세요.',
  CAMERA_NOT_FOUND: '카메라를 찾을 수 없습니다. 카메라가 연결되어 있는지 확인해주세요.',
  MEDIAPIPE_LOAD_FAILED: 'MediaPipe 모델을 불러올 수 없습니다. 인터넷 연결을 확인해주세요.',
  UNSUPPORTED_BROWSER: '지원되지 않는 브라우저입니다. Chrome, Firefox, Safari, Edge 최신 버전을 사용해주세요.',
  WEBGL_NOT_SUPPORTED: 'WebGL이 지원되지 않습니다. 그래픽 카드 드라이버를 업데이트하거나 하드웨어 가속을 활성화해주세요.',
} as const;

// 성공 메시지
export const SUCCESS_MESSAGES = {
  CAMERA_READY: '카메라가 준비되었습니다.',
  MEDIAPIPE_LOADED: 'AI 모델이 로드되었습니다.',
  PROCESSING_STARTED: '실시간 처리가 시작되었습니다.',
} as const;

// UI 텍스트
export const UI_TEXT = {
  HEADER_TITLE: '대림대학교 포토존',
  DESCRIPTION: `카메라 앞에 서서 포즈를 취해보세요.\n배경이 자동으로 제거되어 멋진 사진을 찍을 수 있습니다.\n\n* 밝은 곳에서 촬영하시면 더 좋은 결과를 얻을 수 있습니다.`,
  LOADING_CAMERA: '카메라를 준비하는 중...',
  LOADING_AI: 'AI 모델을 로드하는 중...',
  READY: '준비 완료!',
} as const;