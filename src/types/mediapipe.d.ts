// MediaPipe TypeScript 타입 정의

declare global {
  interface Window {
    SelfieSegmentation: typeof SelfieSegmentation;
    Camera: typeof Camera;
  }
}

// MediaPipe Selfie Segmentation 타입
export interface SelfieSegmentationConfig {
  locateFile?: (file: string) => string;
}

export interface SelfieSegmentationOptions {
  modelSelection?: 0 | 1; // 0: 일반 모델, 1: 풍경 모델
  selfieMode?: boolean;
}

export interface SelfieSegmentationResults {
  image: HTMLCanvasElement;
  segmentationMask: Float32Array;
}

export interface SelfieSegmentationCallbacks {
  onResults: (results: SelfieSegmentationResults) => void;
}

export declare class SelfieSegmentation {
  constructor(config?: SelfieSegmentationConfig);
  setOptions(options: SelfieSegmentationOptions): void;
  onResults(callback: (results: SelfieSegmentationResults) => void): void;
  send(inputs: { image: HTMLVideoElement | HTMLCanvasElement | HTMLImageElement }): Promise<void>;
  close(): void;
}

// MediaPipe Camera 타입
export interface CameraConfig {
  onFrame?: () => Promise<void>;
  width?: number;
  height?: number;
}

export declare class Camera {
  constructor(videoElement: HTMLVideoElement, config: CameraConfig);
  start(): Promise<void>;
  stop(): void;
}

// 커스텀 타입 정의
export interface CameraState {
  stream: MediaStream | null;
  error: string | null;
  isReady: boolean;
  isLoading: boolean;
}

export interface MediaPipeState {
  segmentation: SelfieSegmentation | null;
  isLoaded: boolean;
  isProcessing: boolean;
  error: string | null;
}

export interface PerformanceMetrics {
  fps: number;
  frameCount: number;
  lastFrameTime: number;
  processingTime: number;
}

export interface PhotoZoneConfig {
  targetFps: number;
  canvasWidth: number;
  canvasHeight: number;
  segmentationThreshold: number;
  backgroundColor: string;
}

export {};