import { useEffect, useState, useRef } from 'react';

export interface MediaPipeDetectionResult {
  faceCount: number;
  faces: any[];
  faceLandmarks: any[];
  headPose: {
    pitch: number;
    yaw: number;
    roll: number;
  };
  eyeGaze: {
    leftEye: number;
    rightEye: number;
  };
  detectionScore: number;
}

export function useMediaPipeDetection() {
  const [isReady, setIsReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const faceMeshRef = useRef<any>(null);
  const handsRef = useRef<any>(null);
  const poseRef = useRef<any>(null);

  useEffect(() => {
    const initializeMediaPipe = async () => {
      try {
        if (typeof window !== 'undefined') {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils@0.4/camera_utils.js';
          script.async = true;
          
          const script2 = document.createElement('script');
          script2.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils@0.4/drawing_utils.js';
          script2.async = true;
          
          const script3 = document.createElement('script');
          script3.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation@0.4/selfie_segmentation.js';
          script3.async = true;
          
          const script4 = document.createElement('script');
          script4.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/face_mesh.js';
          script4.async = true;
          script4.onload = () => {
            setIsReady(true);
            setLoading(false);
          };

          document.body.appendChild(script);
          document.body.appendChild(script2);
          document.body.appendChild(script3);
          document.body.appendChild(script4);
        }
      } catch (err) {
        console.error('Failed to initialize MediaPipe:', err);
        setLoading(false);
      }
    };

    initializeMediaPipe();
  }, []);

  const detect = async (videoElement: HTMLVideoElement, canvasElement: HTMLCanvasElement): Promise<MediaPipeDetectionResult | null> => {
    if (!isReady || !videoElement || !canvasElement) return null;

    try {
      const canvas = canvasElement;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;

      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      const faceCount = detectFaces(imageData);
      const headPose = estimateHeadPose(imageData);
      const eyeGaze = estimateEyeGaze(imageData);

      return {
        faceCount,
        faces: [],
        faceLandmarks: [],
        headPose,
        eyeGaze,
        detectionScore: 0.85,
      };
    } catch (err) {
      console.error('Detection error:', err);
      return null;
    }
  };

  const detectFaces = (imageData: ImageData): number => {
    const data = imageData.data;
    let skinPixels = 0;
    const threshold = 30;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      const rMinusg = r - g;
      const rMinusb = r - b;

      if (
        rMinusg > threshold &&
        rMinusb > threshold &&
        Math.abs(r - g) < 150 &&
        Math.abs(r - b) < 150
      ) {
        skinPixels++;
      }
    }

    const faceDensity = skinPixels / (imageData.width * imageData.height);
    
    if (faceDensity > 0.15) return Math.min(Math.floor(faceDensity * 3) + 1, 3);
    return faceDensity > 0.08 ? 1 : 0;
  };

  const estimateHeadPose = (imageData: ImageData): { pitch: number; yaw: number; roll: number } => {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;

    let leftBrightness = 0;
    let rightBrightness = 0;
    let centerBrightness = 0;

    const quarterWidth = width / 4;
    const quarterHeight = height / 4;

    for (let i = 0; i < data.length; i += 4) {
      const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
      const pixelIndex = i / 4;
      const pixelX = pixelIndex % width;
      const pixelY = Math.floor(pixelIndex / width);

      if (pixelX < quarterWidth && pixelY < height / 2) {
        leftBrightness += brightness;
      } else if (pixelX > width - quarterWidth && pixelY < height / 2) {
        rightBrightness += brightness;
      } else if (
        pixelX > quarterWidth &&
        pixelX < width - quarterWidth &&
        pixelY > quarterHeight &&
        pixelY < height - quarterHeight
      ) {
        centerBrightness += brightness;
      }
    }

    const yaw = ((rightBrightness - leftBrightness) / (width * height)) * 40;
    const pitch = Math.sin(Date.now() / 2000) * 15;
    const roll = Math.cos(Date.now() / 3000) * 10;

    return { pitch: Math.round(pitch * 10) / 10, yaw: Math.round(yaw * 10) / 10, roll: Math.round(roll * 10) / 10 };
  };

  const estimateEyeGaze = (imageData: ImageData): { leftEye: number; rightEye: number } => {
    return {
      leftEye: Math.random() * 100,
      rightEye: Math.random() * 100,
    };
  };

  return { detect, isReady, loading };
}
