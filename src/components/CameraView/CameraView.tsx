import React, { useRef, useEffect, useCallback } from 'react';
import styles from './CameraView.module.css';

interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  className?: string;
}

const CameraView: React.FC<CameraViewProps> = ({
  videoRef,
  className
}) => {
  return (
    <div className={`${styles.container} ${className || ''}`}>
      {/* 카메라 비디오 */}
      <video
        ref={videoRef}
        className={styles.video}
        playsInline
        muted
        autoPlay
      />
    </div>
  );
};

export default CameraView;