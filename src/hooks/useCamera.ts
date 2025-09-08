import { useState, useCallback, useEffect, useRef } from 'react';
import { CameraState } from '../types/mediapipe';
import { getOptimalCameraConstraints, getErrorMessage, isBrowserSupported } from '../utils/mediaUtils';
import { ERROR_MESSAGES } from '../utils/constants';

interface UseCameraOptions {
  autoStart?: boolean;
}

interface UseCameraReturn extends CameraState {
  initialize: () => Promise<void>;
  stop: () => void;
  restart: () => Promise<void>;
  videoRef: React.RefObject<HTMLVideoElement>;
}

/**
 * 카메라 스트림을 관리하는 커스텀 Hook
 */
export const useCamera = (options: UseCameraOptions = {}): UseCameraReturn => {
  const { autoStart = false } = options;
  
  const [state, setState] = useState<CameraState>({
    stream: null,
    error: null,
    isReady: false,
    isLoading: false,
  });
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  /**
   * 카메라 초기화
   */
  const initialize = useCallback(async (): Promise<void> => {
    // 브라우저 지원 확인
    if (!isBrowserSupported()) {
      setState(prev => ({
        ...prev,
        error: ERROR_MESSAGES.UNSUPPORTED_BROWSER,
        isLoading: false,
      }));
      return;
    }

    setState(prev => ({
      ...prev,
      error: null,
      isLoading: true,
      isReady: false,
    }));

    try {
      // 기존 스트림이 있다면 정리
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      // 카메라 제약 조건 가져오기
      const constraints = getOptimalCameraConstraints();
      
      // 카메라 스트림 획득
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      // 비디오 엘리먼트에 스트림 연결
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // 비디오 로드 완료 대기
        await new Promise<void>((resolve, reject) => {
          const video = videoRef.current;
          if (!video) {
            reject(new Error('Video element not found'));
            return;
          }

          const handleLoadedData = () => {
            video.removeEventListener('loadeddata', handleLoadedData);
            video.removeEventListener('error', handleError);
            resolve();
          };

          const handleError = () => {
            video.removeEventListener('loadeddata', handleLoadedData);
            video.removeEventListener('error', handleError);
            reject(new Error('Video loading failed'));
          };

          video.addEventListener('loadeddata', handleLoadedData);
          video.addEventListener('error', handleError);
        });
      }

      setState(prev => ({
        ...prev,
        stream,
        error: null,
        isReady: true,
        isLoading: false,
      }));

    } catch (error) {
      const errorMessage = error instanceof Error 
        ? getErrorMessage(error)
        : '카메라 초기화 중 알 수 없는 오류가 발생했습니다.';

      setState(prev => ({
        ...prev,
        stream: null,
        error: errorMessage,
        isReady: false,
        isLoading: false,
      }));

      // 스트림 정리
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    }
  }, []);

  /**
   * 카메라 중지
   */
  const stop = useCallback((): void => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setState(prev => ({
      ...prev,
      stream: null,
      isReady: false,
      isLoading: false,
    }));
  }, []);

  /**
   * 카메라 재시작
   */
  const restart = useCallback(async (): Promise<void> => {
    stop();
    await initialize();
  }, [stop, initialize]);

  /**
   * 컴포넌트 마운트 시 자동 시작
   */
  useEffect(() => {
    if (autoStart) {
      initialize();
    }

    // 클린업 함수
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [autoStart, initialize]);

  /**
   * 페이지 가시성 변경 시 처리 (성능 최적화)
   */
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && streamRef.current) {
        // 페이지가 숨겨지면 카메라 일시 중지 (선택사항)
        const tracks = streamRef.current.getVideoTracks();
        tracks.forEach(track => {
          track.enabled = false;
        });
      } else if (!document.hidden && streamRef.current) {
        // 페이지가 다시 보이면 카메라 재활성화
        const tracks = streamRef.current.getVideoTracks();
        tracks.forEach(track => {
          track.enabled = true;
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  /**
   * 디바이스 방향 변경 시 처리 (모바일)
   */
  useEffect(() => {
    const handleOrientationChange = async () => {
      if (state.isReady && window.screen && 'orientation' in window.screen) {
        // 방향 변경 후 잠시 대기 후 재시작
        setTimeout(() => {
          if (state.isReady) {
            restart();
          }
        }, 500);
      }
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [state.isReady, restart]);

  return {
    ...state,
    initialize,
    stop,
    restart,
    videoRef,
  };
};