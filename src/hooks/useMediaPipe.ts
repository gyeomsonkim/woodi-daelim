import { useState, useCallback, useEffect, useRef } from 'react';
import { MediaPipeState, SelfieSegmentation, SelfieSegmentationResults } from '../types/mediapipe';
import { MEDIAPIPE_CONFIG, PERFORMANCE_CONFIG, ERROR_MESSAGES } from '../utils/constants';
import { createPerformanceMonitor } from '../utils/mediaUtils';

interface UseMediaPipeOptions {
  onResults?: (results: SelfieSegmentationResults) => void;
  autoLoad?: boolean;
}

interface UseMediaPipeReturn extends MediaPipeState {
  loadModel: () => Promise<void>;
  processFrame: (videoElement: HTMLVideoElement) => Promise<void>;
  dispose: () => void;
  performance: {
    fps: number;
    frameTime: number;
  };
}

/**
 * MediaPipe Selfie Segmentation을 관리하는 커스텀 Hook
 */
export const useMediaPipe = (options: UseMediaPipeOptions = {}): UseMediaPipeReturn => {
  const { onResults, autoLoad = false } = options;
  
  const [state, setState] = useState<MediaPipeState>({
    segmentation: null,
    isLoaded: false,
    isProcessing: false,
    error: null,
  });

  const segmentationRef = useRef<SelfieSegmentation | null>(null);
  const processingQueueRef = useRef<number>(0);
  const performanceMonitorRef = useRef(createPerformanceMonitor());
  const [performanceMetrics, setPerformanceMetrics] = useState({ fps: 0, frameTime: 0 });

  /**
   * MediaPipe 모델 로드
   */
  const loadModel = useCallback(async (): Promise<void> => {
    console.log('🤖 Starting MediaPipe model loading...');
    
    try {
      setState(prev => ({
        ...prev,
        error: null,
        isLoaded: false,
      }));

      // Window 객체에서 SelfieSegmentation 클래스 확인
      console.log('📋 Checking for SelfieSegmentation:', !!window.SelfieSegmentation);
      if (!window.SelfieSegmentation) {
        throw new Error('MediaPipe SelfieSegmentation not loaded. Please check CDN scripts.');
      }

      console.log('🔧 Creating SelfieSegmentation instance...');
      // SelfieSegmentation 인스턴스 생성
      const segmentation = new window.SelfieSegmentation({
        locateFile: (file: string) => {
          const url = MEDIAPIPE_CONFIG.CDN_BASE_URL + file;
          console.log('📁 Loading file:', url);
          return url;
        }
      });

      console.log('⚙️ Setting segmentation options...');
      // 모델 옵션 설정
      segmentation.setOptions({
        modelSelection: MEDIAPIPE_CONFIG.MODEL_SELECTION,
        selfieMode: MEDIAPIPE_CONFIG.SELFIE_MODE,
      });

      console.log('📊 Setting up results callback...');
      // 결과 콜백 설정
      segmentation.onResults((results: SelfieSegmentationResults) => {
        console.log('✅ MediaPipe results received:', {
          imageWidth: results.image.width,
          imageHeight: results.image.height,
          maskLength: results.segmentationMask.length
        });

        // 성능 측정 종료
        performanceMonitorRef.current.endFrame();
        const metrics = performanceMonitorRef.current.getMetrics();
        setPerformanceMetrics(metrics);

        // 결과 콜백 호출
        if (onResults) {
          onResults(results);
        }

        // 처리 중 상태 업데이트
        setState(prev => ({
          ...prev,
          isProcessing: false,
        }));
      });

      segmentationRef.current = segmentation;

      console.log('🎉 MediaPipe model loaded successfully!');
      setState(prev => ({
        ...prev,
        segmentation,
        isLoaded: true,
        error: null,
      }));

    } catch (error) {
      console.error('❌ MediaPipe loading error:', error);
      const errorMessage = error instanceof Error 
        ? `MediaPipe 로드 실패: ${error.message}`
        : ERROR_MESSAGES.MEDIAPIPE_LOAD_FAILED;

      setState(prev => ({
        ...prev,
        segmentation: null,
        isLoaded: false,
        error: errorMessage,
      }));
    }
  }, [onResults]);

  /**
   * 비디오 프레임 처리
   */
  const processFrame = useCallback(async (videoElement: HTMLVideoElement): Promise<void> => {
    if (!segmentationRef.current || !state.isLoaded) {
      console.log('🚫 Cannot process frame: segmentation not ready', {
        hasSegmentation: !!segmentationRef.current,
        isLoaded: state.isLoaded
      });
      return;
    }

    // 큐 크기 확인 (과부하 방지)
    if (processingQueueRef.current >= PERFORMANCE_CONFIG.MAX_PROCESSING_QUEUE) {
      console.log('⏳ Processing queue full, skipping frame');
      return;
    }

    // 비디오 상태 확인
    if (videoElement.readyState < 2) { // HAVE_CURRENT_DATA
      console.log('📹 Video not ready, readyState:', videoElement.readyState);
      return;
    }

    try {
      processingQueueRef.current++;
      console.log('🔄 Processing frame...');
      
      setState(prev => ({
        ...prev,
        isProcessing: true,
      }));

      // 성능 측정 시작
      performanceMonitorRef.current.startFrame();

      // MediaPipe에 프레임 전송
      await segmentationRef.current.send({ image: videoElement });
      console.log('📤 Frame sent to MediaPipe');

    } catch (error) {
      console.error('❌ Frame processing error:', error);
      
      setState(prev => ({
        ...prev,
        isProcessing: false,
        error: error instanceof Error ? error.message : '프레임 처리 중 오류가 발생했습니다.',
      }));
    } finally {
      processingQueueRef.current = Math.max(0, processingQueueRef.current - 1);
    }
  }, [state.isLoaded]);

  /**
   * 리소스 정리
   */
  const dispose = useCallback((): void => {
    if (segmentationRef.current) {
      try {
        segmentationRef.current.close();
      } catch (error) {
        console.warn('MediaPipe disposal warning:', error);
      }
      segmentationRef.current = null;
    }

    setState(prev => ({
      ...prev,
      segmentation: null,
      isLoaded: false,
      isProcessing: false,
    }));

    processingQueueRef.current = 0;
  }, []);

  /**
   * 자동 로드
   */
  useEffect(() => {
    if (autoLoad) {
      loadModel();
    }

    // 클린업
    return () => {
      dispose();
    };
  }, [autoLoad, loadModel, dispose]);

  /**
   * MediaPipe 스크립트 로드 상태 확인
   */
  useEffect(() => {
    const checkMediaPipeLoaded = () => {
      if (window.SelfieSegmentation) {
        return;
      }

      // 스크립트가 로드될 때까지 대기
      const checkInterval = setInterval(() => {
        if (window.SelfieSegmentation) {
          clearInterval(checkInterval);
          if (autoLoad) {
            loadModel();
          }
        }
      }, 100);

      // 최대 10초 대기
      setTimeout(() => {
        clearInterval(checkInterval);
        if (!window.SelfieSegmentation) {
          setState(prev => ({
            ...prev,
            error: ERROR_MESSAGES.MEDIAPIPE_LOAD_FAILED,
          }));
        }
      }, 10000);
    };

    checkMediaPipeLoaded();
  }, [autoLoad, loadModel]);

  /**
   * 성능 모니터링 정리
   */
  useEffect(() => {
    const monitor = performanceMonitorRef.current;
    
    return () => {
      // 성능 모니터는 추가 정리가 필요하지 않음
    };
  }, []);

  return {
    ...state,
    loadModel,
    processFrame,
    dispose,
    performance: performanceMetrics,
  };
};