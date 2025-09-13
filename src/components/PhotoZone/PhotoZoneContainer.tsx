import React, { useCallback, useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useCamera } from '../../hooks/useCamera';
import CameraView from '../CameraView/CameraView';
import { UI_TEXT } from '../../utils/constants';

interface PhotoZoneContainerProps {
  className?: string;
  currentFilter?: TFilterType;
  onSetCaptureFunction?: (captureFunc: () => void) => void;
}

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(200%); }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 500px;
  position: relative;

  * {
    will-change: auto;
  }

  @media (max-width: 768px) {
    min-height: 400px;
  }

  @media (max-width: 480px) {
    min-height: 350px;
  }
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px 20px;
  max-width: 500px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 30px 15px;
  }

  @media (max-width: 480px) {
    padding: 25px 10px;
  }
`;

const ErrorIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.8;

  @media (max-width: 768px) {
    font-size: 36px;
    margin-bottom: 12px;
  }
`;

const ErrorMessage = styled.p`
  font-family: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: #FF5252;
  line-height: 1.6;
  margin: 0 0 24px 0;
  background: rgba(255, 82, 82, 0.1);
  border: 1px solid rgba(255, 82, 82, 0.3);
  border-radius: 12px;
  padding: 16px 20px;

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 12px 16px;
  }

  @media (max-width: 480px) {
    font-size: 13px;
    padding: 10px 14px;
  }

  @media (prefers-color-scheme: dark) {
    background: rgba(255, 82, 82, 0.15);
    border-color: rgba(255, 82, 82, 0.4);
  }
`;

const RetryButton = styled.button`
  background: linear-gradient(135deg, #1E88E5, #1565C0);
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(30, 136, 229, 0.3);

  &:hover {
    background: linear-gradient(135deg, #1565C0, #0D47A1);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(30, 136, 229, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus-visible {
    outline: 2px solid #42A5F5;
    outline-offset: 2px;
  }

  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: 13px;
  }

  @media (prefers-reduced-motion: reduce) {
    &:hover {
      transform: none;
    }
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 60px 20px;
  max-width: 400px;
  margin: 0 auto;

  &:hover .loading-spinner {
    border-top-color: #42A5F5;
  }

  @media (max-width: 768px) {
    padding: 40px 15px;
  }

  @media (max-width: 480px) {
    padding: 35px 10px;
  }
`;

const LoadingSpinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid rgba(255, 255, 255, 0.2);
  border-top: 4px solid #FFFFFF;
  border-radius: 50%;
  ${css`animation: ${spin} 1s linear infinite;`}
  margin-bottom: 24px;
  will-change: transform;

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    border-width: 3px;
    margin-bottom: 20px;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const LoadingMessage = styled.p`
  font-family: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 18px;
  font-weight: 400;
  color: #FFFFFF;
  margin: 0 0 20px 0;
  opacity: 0.9;

  @media (max-width: 768px) {
    font-size: 16px;
    margin-bottom: 16px;
  }

  @media (max-width: 480px) {
    font-size: 15px;
  }
`;

const LoadingProgress = styled.div`
  width: 200px;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;

  @media (max-width: 768px) {
    width: 150px;
    height: 3px;
  }
`;

interface ProgressBarProps {
  $width: string;
}

const ProgressBar = styled.div<ProgressBarProps>`
  height: 100%;
  width: ${props => props.$width};
  background: linear-gradient(90deg, #1E88E5, #42A5F5);
  border-radius: 2px;
  transition: width 0.3s ease;
  position: relative;
  will-change: transform;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    ${css`animation: ${shimmer} 2s infinite;`}
  }

  @media (prefers-reduced-motion: reduce) {
    &::after {
      animation: none;
    }
  }
`;

const CameraContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const CameraViewStyled = styled.div`
  width: 100%;
  max-width: 100%;
`;

const PerformanceInfo = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.8);
  color: #FFFFFF;
  font-family: 'Courier New', monospace;
  font-size: 11px;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  display: flex;
  flex-direction: column;
  gap: 2px;
  z-index: 10;
  pointer-events: none;

  @media (max-width: 768px) {
    top: 8px;
    right: 8px;
    font-size: 9px;
    padding: 6px 8px;
  }

  @media (max-width: 480px) {
    top: 6px;
    right: 6px;
    font-size: 8px;
    padding: 4px 6px;
  }

  @media (prefers-color-scheme: dark) {
    background: rgba(0, 0, 0, 0.9);
    border-color: rgba(255, 255, 255, 0.15);
  }
`;

const PhotoZoneContainer: React.FC<PhotoZoneContainerProps> = ({ 
  className, 
  currentFilter = 'none',
  onSetCaptureFunction 
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<string>(UI_TEXT.LOADING_CAMERA);
  const [cameraViewRef, setCameraViewRef] = useState<{ capturePhoto: () => void } | null>(null);

  // 카메라 Hook
  const {
    error: cameraError,
    isReady: cameraReady,
    initialize: initializeCamera,
    videoRef,
  } = useCamera();

  // 초기화 프로세스
  const initializePhotoZone = useCallback(async () => {
    setIsInitialized(false);
    setCurrentStatus(UI_TEXT.LOADING_CAMERA);

    try {
      // 카메라 초기화
      await initializeCamera();
      
      setCurrentStatus(UI_TEXT.READY);
      setIsInitialized(true);

    } catch (error) {
      console.error('Initialization error:', error);
      setCurrentStatus('초기화 중 오류가 발생했습니다.');
    }
  }, [initializeCamera]);

  // 컴포넌트 마운트 시 초기화
  useEffect(() => {
    initializePhotoZone();
  }, [initializePhotoZone]);

  // 사진 촬영 함수
  const capturePhoto = useCallback(() => {
    if (cameraViewRef && cameraViewRef.capturePhoto) {
      console.log('PhotoZoneContainer: 사진 촬영 실행');
      cameraViewRef.capturePhoto();
    } else {
      console.warn('PhotoZoneContainer: 카메라 뷰가 준비되지 않음');
    }
  }, [cameraViewRef]);

  // CameraView에서 capture 함수를 받아오는 콜백
  const handleCameraViewRef = useCallback((ref: { capturePhoto: () => void } | null) => {
    setCameraViewRef(ref);
  }, []);

  // 부모 컴포넌트에 capture 함수 전달
  useEffect(() => {
    if (onSetCaptureFunction && isInitialized && cameraViewRef) {
      onSetCaptureFunction(capturePhoto);
    }
  }, [onSetCaptureFunction, isInitialized, cameraViewRef, capturePhoto]);

  // 에러 상태 처리
  const currentError = cameraError;

  return (
    <Container className={className}>
      {/* 에러 표시 */}
      {currentError && (
        <ErrorContainer>
          <ErrorIcon>⚠️</ErrorIcon>
          <ErrorMessage>{currentError}</ErrorMessage>
          <RetryButton onClick={initializePhotoZone}>
            다시 시도
          </RetryButton>
        </ErrorContainer>
      )}

      {/* 로딩 상태 */}
      {!isInitialized && !currentError && (
        <LoadingContainer>
          <LoadingSpinner className="loading-spinner" />
          <LoadingMessage>{currentStatus}</LoadingMessage>
          <LoadingProgress>
            <ProgressBar $width={cameraReady ? '100%' : '25%'} />
          </LoadingProgress>
        </LoadingContainer>
      )}

      {/* 메인 카메라 뷰 */}
      {isInitialized && !currentError && (
        <CameraContainer>
          <CameraView
            videoRef={videoRef}
            currentFilter={currentFilter}
            onRef={handleCameraViewRef}
          />
        </CameraContainer>
      )}
    </Container>
  );
};

export default PhotoZoneContainer;