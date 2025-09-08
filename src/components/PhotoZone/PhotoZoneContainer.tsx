import React, { useCallback, useEffect, useState } from 'react';
import { useCamera } from '../../hooks/useCamera';
import CameraView from '../CameraView/CameraView';
import { UI_TEXT } from '../../utils/constants';
import styles from './PhotoZoneContainer.module.css';

interface PhotoZoneContainerProps {
  className?: string;
}

const PhotoZoneContainer: React.FC<PhotoZoneContainerProps> = ({ className }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<string>(UI_TEXT.LOADING_CAMERA);

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

  // 에러 상태 처리
  const currentError = cameraError;

  return (
    <div className={`${styles.container} ${className || ''}`}>
      {/* 에러 표시 */}
      {currentError && (
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>⚠️</div>
          <p className={styles.errorMessage}>{currentError}</p>
          <button 
            className={styles.retryButton}
            onClick={initializePhotoZone}
          >
            다시 시도
          </button>
        </div>
      )}

      {/* 로딩 상태 */}
      {!isInitialized && !currentError && (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner} />
          <p className={styles.loadingMessage}>{currentStatus}</p>
          <div className={styles.loadingProgress}>
            <div 
              className={styles.progressBar}
              style={{
                width: cameraReady ? '100%' : '25%'
              }}
            />
          </div>
        </div>
      )}

      {/* 메인 카메라 뷰 */}
      {isInitialized && !currentError && (
        <div className={styles.cameraContainer}>
          <CameraView
            videoRef={videoRef}
          />
        </div>
      )}
    </div>
  );
};

export default PhotoZoneContainer;