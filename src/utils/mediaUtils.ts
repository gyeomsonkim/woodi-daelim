// 미디어 관련 유틸리티 함수들

import { BREAKPOINTS, CANVAS_CONFIG, ERROR_MESSAGES } from './constants';

/**
 * 브라우저가 MediaPipe를 지원하는지 확인
 */
export const isBrowserSupported = (): boolean => {
  // getUserMedia 지원 확인
  const hasGetUserMedia = !!(
    navigator.mediaDevices && navigator.mediaDevices.getUserMedia
  );

  // WebGL 지원 확인
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  const hasWebGL = !!gl;

  // 최신 브라우저 확인 (ES2020 features)
  const hasModernJS = !!(
    window.Promise &&
    typeof window.fetch === 'function' &&
    Array.prototype.includes
  );

  return hasGetUserMedia && hasWebGL && hasModernJS;
};

/**
 * 디바이스 타입 감지
 */
export const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  const width = window.innerWidth;
  
  if (width <= BREAKPOINTS.MOBILE) return 'mobile';
  if (width <= BREAKPOINTS.TABLET) return 'tablet';
  return 'desktop';
};

/**
 * 디바이스에 맞는 Canvas 크기 계산
 */
export const getOptimalCanvasSize = (): { width: number; height: number } => {
  const deviceType = getDeviceType();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  switch (deviceType) {
    case 'mobile':
      const mobileWidth = Math.min(viewportWidth * 0.95, CANVAS_CONFIG.MOBILE_WIDTH);
      return {
        width: mobileWidth,
        height: mobileWidth * (3 / 4), // 4:3 비율로 모바일 최적화
      };

    case 'tablet':
      const tabletWidth = Math.min(viewportWidth * 0.9, 1024);
      return {
        width: tabletWidth,
        height: tabletWidth * (9 / 16), // 16:9 비율 유지
      };

    case 'desktop':
    default:
      const maxWidth = Math.min(viewportWidth * 0.8, CANVAS_CONFIG.DEFAULT_WIDTH);
      const maxHeight = Math.min(viewportHeight * 0.7, CANVAS_CONFIG.DEFAULT_HEIGHT);
      
      // 16:9 비율 유지하면서 뷰포트에 맞춤
      const ratioWidth = maxHeight * CANVAS_CONFIG.ASPECT_RATIO;
      const ratioHeight = maxWidth / CANVAS_CONFIG.ASPECT_RATIO;
      
      if (ratioWidth <= maxWidth) {
        return { width: ratioWidth, height: maxHeight };
      } else {
        return { width: maxWidth, height: ratioHeight };
      }
  }
};

/**
 * 카메라 제약 조건을 디바이스에 맞게 조정
 */
export const getOptimalCameraConstraints = (): MediaStreamConstraints => {
  const { width, height } = getOptimalCanvasSize();
  const deviceType = getDeviceType();

  return {
    video: {
      width: { ideal: width },
      height: { ideal: height },
      frameRate: { ideal: deviceType === 'mobile' ? 24 : 30 },
      facingMode: 'user',
    },
    audio: false,
  };
};

/**
 * Canvas 컨텍스트를 성능 최적화 설정으로 가져오기
 */
export const getOptimizedCanvasContext = (
  canvas: HTMLCanvasElement
): CanvasRenderingContext2D | null => {
  const context = canvas.getContext('2d', {
    alpha: false,           // 알파 채널 비활성화로 성능 향상
    desynchronized: true,   // 비동기 렌더링으로 성능 향상
    willReadFrequently: false, // 픽셀 읽기 최적화 비활성화
  });

  if (context) {
    // 이미지 스무딩 비활성화로 성능 향상
    context.imageSmoothingEnabled = false;
  }

  return context;
};

/**
 * MediaPipe 결과를 Canvas에 렌더링
 */
export const renderSegmentedFrame = (
  context: CanvasRenderingContext2D,
  results: { image: HTMLCanvasElement; segmentationMask: Float32Array },
  threshold: number = 0.1
): void => {
  const { width, height } = context.canvas;
  
  // 배경을 검은색으로 초기화
  context.fillStyle = '#000000';
  context.fillRect(0, 0, width, height);

  // 이미지 데이터 생성
  const imageData = context.createImageData(width, height);
  const data = imageData.data;
  
  // 원본 이미지를 Canvas에 그려서 픽셀 데이터 추출
  context.drawImage(results.image, 0, 0, width, height);
  const originalImageData = context.getImageData(0, 0, width, height);
  const originalData = originalImageData.data;

  // 세그멘테이션 마스크 적용
  for (let i = 0; i < results.segmentationMask.length; i++) {
    const maskValue = results.segmentationMask[i];
    const pixelIndex = i * 4;

    if (maskValue > threshold) {
      // 인물 영역: 원본 이미지 표시
      data[pixelIndex] = originalData[pixelIndex];         // R
      data[pixelIndex + 1] = originalData[pixelIndex + 1]; // G
      data[pixelIndex + 2] = originalData[pixelIndex + 2]; // B
      data[pixelIndex + 3] = 255;                          // A
    } else {
      // 배경 영역: 검은색
      data[pixelIndex] = 0;     // R
      data[pixelIndex + 1] = 0; // G
      data[pixelIndex + 2] = 0; // B
      data[pixelIndex + 3] = 255; // A
    }
  }

  // 처리된 이미지 데이터를 Canvas에 적용
  context.putImageData(imageData, 0, 0);
};

/**
 * 에러를 사용자 친화적인 메시지로 변환
 */
export const getErrorMessage = (error: Error): string => {
  const message = error.message.toLowerCase();

  if (message.includes('permission') || message.includes('denied')) {
    return ERROR_MESSAGES.CAMERA_ACCESS_DENIED;
  }
  
  if (message.includes('notfound') || message.includes('devicenotfound')) {
    return ERROR_MESSAGES.CAMERA_NOT_FOUND;
  }
  
  if (message.includes('network') || message.includes('fetch')) {
    return ERROR_MESSAGES.MEDIAPIPE_LOAD_FAILED;
  }

  if (!isBrowserSupported()) {
    return ERROR_MESSAGES.UNSUPPORTED_BROWSER;
  }

  // 기본 에러 메시지
  return `오류가 발생했습니다: ${error.message}`;
};

/**
 * FPS 계산기
 */
export class FPSCalculator {
  private frameCount = 0;
  private lastTime = performance.now();
  private fps = 0;

  update(): number {
    this.frameCount++;
    const currentTime = performance.now();
    
    if (currentTime - this.lastTime >= 1000) {
      this.fps = Math.round(this.frameCount * 1000 / (currentTime - this.lastTime));
      this.frameCount = 0;
      this.lastTime = currentTime;
    }
    
    return this.fps;
  }

  getFPS(): number {
    return this.fps;
  }
}

/**
 * 성능 모니터링 유틸리티
 */
export const createPerformanceMonitor = () => {
  const fpsCalculator = new FPSCalculator();
  let performanceData = {
    fps: 0,
    frameTime: 0,
    lastFrameStart: 0,
  };

  return {
    startFrame: () => {
      performanceData.lastFrameStart = performance.now();
    },
    
    endFrame: () => {
      const frameEnd = performance.now();
      performanceData.frameTime = frameEnd - performanceData.lastFrameStart;
      performanceData.fps = fpsCalculator.update();
    },
    
    getMetrics: () => ({ ...performanceData }),
  };
};