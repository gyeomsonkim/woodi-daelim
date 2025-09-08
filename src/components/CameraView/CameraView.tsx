import React, { useRef, useEffect, useCallback } from 'react';
import { FilterType } from '../ControlPanel/ControlPanel';
import styles from './CameraView.module.css';

interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  className?: string;
  currentFilter?: FilterType;
}

const CameraView: React.FC<CameraViewProps> = ({
  videoRef,
  className,
  currentFilter = 'none'
}) => {
  // 필터에 따른 CSS 클래스 결정
  const getFilterClass = () => {
    switch (currentFilter) {
      case 'flower':
        return styles.flowerFilter;
      case 'space':
        return styles.spaceFilter;
      case 'forest':
        return styles.forestFilter;
      default:
        return '';
    }
  };

  return (
    <div className={`${styles.container} ${className || ''}`}>
      {/* 카메라 비디오 */}
      <video
        ref={videoRef}
        className={`${styles.video} ${getFilterClass()}`}
        playsInline
        muted
        autoPlay
      />
      
      {/* 필터 오버레이 */}
      {currentFilter !== 'none' && (
        <div className={`${styles.filterOverlay} ${getFilterClass()}`}>
          {currentFilter === 'flower' && (
            <div className={styles.flowerElements}>
              <span className={styles.floatingEmoji}>🌸</span>
              <span className={styles.floatingEmoji}>🌺</span>
              <span className={styles.floatingEmoji}>🌻</span>
              <span className={styles.floatingEmoji}>🌷</span>
            </div>
          )}
          {currentFilter === 'space' && (
            <div className={styles.spaceElements}>
              <span className={styles.floatingEmoji}>⭐</span>
              <span className={styles.floatingEmoji}>✨</span>
              <span className={styles.floatingEmoji}>🌟</span>
              <span className={styles.floatingEmoji}>💫</span>
            </div>
          )}
          {currentFilter === 'forest' && (
            <div className={styles.forestElements}>
              <span className={styles.floatingEmoji}>🌲</span>
              <span className={styles.floatingEmoji}>🌳</span>
              <span className={styles.floatingEmoji}>🍃</span>
              <span className={styles.floatingEmoji}>🦋</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CameraView;