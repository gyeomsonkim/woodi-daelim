declare global {
    interface Window {
        SelfieSegmentation: typeof SelfieSegmentation;
        Camera: typeof Camera;
    }
l
    type TFilterType = 'flower' | 'space' | 'forest' | 'none' | 'reset';
}

export {};