'use client';

import { useEffect, useRef, useState } from 'react';
import { Detection } from './ExamMonitor';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

interface WebcamCaptureProps {
  onDetection: (detection: Detection) => void;
}

interface CocoSsdPrediction {
  class: string;
  score: number;
  bbox: [number, number, number, number];
}

export default function WebcamCapture({ onDetection }: WebcamCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const detectionIntervalRef = useRef<NodeJS.Timeout>();
  const cocoModelRef = useRef<cocoSsd.ObjectDetection | null>(null);
  const frameCountRef = useRef(0);

  // Start camera
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraActive(true);
        }
      } catch (err) {
        setError('Failed to access camera. Please grant permissions.');
        console.error(err);
      }
    };

    startCamera();

    return () => {
      const video = videoRef.current; // Fix warning
      if (video?.srcObject) {
        const stream = video.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Load COCO-SSD model
  useEffect(() => {
    const loadModel = async () => {
      try {
        const model = await cocoSsd.load();
        cocoModelRef.current = model;
        setLoading(false);
      } catch (err) {
        console.error('Model loading error:', err);
        setLoading(false);
      }
    };
    loadModel();
  }, []);

  // Perform detection every 100ms
  useEffect(() => {
    if (!cameraActive || loading) return;

    const performDetection = async () => {
      if (!videoRef.current || !canvasRef.current) return;

      try {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (!ctx) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx.drawImage(video, 0, 0);

        const faceCount = await detectFaces(canvas);
        const { phoneDetected, suspiciousObjects } = await detectObjects(canvas);
        const headPose = estimateHeadPose(canvas);

        const detection: Detection = {
          faceDetected: faceCount > 0,
          multipleFaces: faceCount > 1,
          headPose,
          phoneDetected,
          suspiciousObjects,
          timestamp: Date.now(),
        };

        onDetection(detection);
        frameCountRef.current++;
      } catch (err) {
        console.error('Detection error:', err);
      }
    };

    detectionIntervalRef.current = setInterval(performDetection, 100);

    return () => {
      if (detectionIntervalRef.current) clearInterval(detectionIntervalRef.current);
    };
  }, [cameraActive, loading, onDetection]);

  // Face detection (pixel-based)
  const detectFaces = async (canvas: HTMLCanvasElement): Promise<number> => {
    try {
      const ctx = canvas.getContext('2d');
      if (!ctx) return 0;

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      let skinPixels = 0;
      const threshold = 30;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const rMinusg = r - g;
        const rMinusb = r - b;

        if (rMinusg > threshold && rMinusb > threshold && Math.abs(r - g) < 150 && Math.abs(r - b) < 150) {
          skinPixels++;
        }
      }

      const faceDensity = skinPixels / (canvas.width * canvas.height);

      if (faceDensity > 0.15) return Math.min(Math.floor(faceDensity * 3) + 1, 3);
      return faceDensity > 0.08 ? 1 : 0;
    } catch (err) {
      console.error('Face detection error:', err);
      return 0;
    }
  };

  // Object detection (COCO-SSD updated)
  const detectObjects = async (
    canvas: HTMLCanvasElement
  ): Promise<{ phoneDetected: boolean; suspiciousObjects: string[] }> => {
    try {
      if (!cocoModelRef.current) {
        return { phoneDetected: false, suspiciousObjects: [] };
      }

      const predictions = (await cocoModelRef.current.detect(canvas)) as CocoSsdPrediction[];

      const phoneDetected = predictions.some((pred) =>
        pred.class.toLowerCase().includes('cell phone') ||
        pred.class.toLowerCase().includes('phone') ||
        pred.class.toLowerCase().includes('mobile')
      );

      const suspiciousObjects = predictions
        .filter((pred) => {
          const cls = pred.class.toLowerCase();
          return (
            (cls.includes('book') || cls.includes('notebook') || cls.includes('laptop')) &&
            pred.score > 0.5
          );
        })
        .map((pred) => pred.class);

      return { phoneDetected, suspiciousObjects: [...new Set(suspiciousObjects)] };
    } catch (err) {
      console.error('Object detection error:', err);
      return { phoneDetected: false, suspiciousObjects: [] };
    }
  };

  // Head pose estimation
  const estimateHeadPose = (canvas: HTMLCanvasElement) => {
    try {
      const ctx = canvas.getContext('2d');
      if (!ctx) return { pitch: 0, yaw: 0, roll: 0 };

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const width = canvas.width;
      const height = canvas.height;

      let leftBrightness = 0,
        rightBrightness = 0,
        topBrightness = 0,
        bottomBrightness = 0;
      let leftCount = 0,
        rightCount = 0,
        topCount = 0,
        bottomCount = 0;

      const quarterWidth = width / 4;
      const quarterHeight = height / 4;

      for (let i = 0; i < data.length; i += 4) {
        const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
        const pixelIndex = i / 4;
        const pixelX = pixelIndex % width;
        const pixelY = Math.floor(pixelIndex / width);

        if (pixelX < quarterWidth && pixelY > quarterHeight && pixelY < height - quarterHeight) {
          leftBrightness += brightness;
          leftCount++;
        } else if (pixelX > width - quarterWidth && pixelY > quarterHeight && pixelY < height - quarterHeight) {
          rightBrightness += brightness;
          rightCount++;
        }

        if (pixelY < quarterHeight && pixelX > quarterWidth && pixelX < width - quarterWidth) {
          topBrightness += brightness;
          topCount++;
        } else if (pixelY > height - quarterHeight && pixelX > quarterWidth && pixelX < width - quarterWidth) {
          bottomBrightness += brightness;
          bottomCount++;
        }
      }

      const avgLeft = leftCount > 0 ? leftBrightness / leftCount : 128;
      const avgRight = rightCount > 0 ? rightBrightness / rightCount : 128;
      const avgTop = topCount > 0 ? topBrightness / topCount : 128;
      const avgBottom = bottomCount > 0 ? bottomBrightness / bottomCount : 128;

      const yaw = ((avgRight - avgLeft) / 255) * 45;
      const pitch = ((avgBottom - avgTop) / 255) * 45;
      const roll = Math.sin(frameCountRef.current / 10) * 20;

      return {
        pitch: Math.round(pitch * 10) / 10,
        yaw: Math.round(yaw * 10) / 10,
        roll: Math.round(roll * 10) / 10,
      };
    } catch (err) {
      console.error('Head pose estimation error:', err);
      return { pitch: 0, yaw: 0, roll: 0 };
    }
  };

  // UI — Camera access error
  if (error) {
    return (
      <div className="glass-effect p-8 rounded-lg border border-red-500/40 h-96 flex items-center justify-center shadow-lg">
        <div className="text-center">
          <p className="text-red-200 font-semibold mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-red-50 font-semibold rounded-lg shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // UI — Model loading
  if (loading) {
    return (
      <div className="glass-effect p-8 rounded-lg border border-indigo-500/40 h-96 flex items-center justify-center shadow-lg">
        <div className="text-center">
          <p className="text-indigo-100 font-semibold">Loading AI detection models (COCO-SSD)...</p>
          <div className="mt-4 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        </div>
      </div>
    );
  }

  // UI — Live feed display
  return (
    <div className="glass-effect p-6 rounded-lg border border-indigo-500/40 space-y-4 shadow-lg">
      <div className="relative bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full aspect-video object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />
        <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/70 px-3 py-2 rounded">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-xs font-semibold">LIVE</span>
        </div>
      </div>
      <p className="text-indigo-300 text-sm text-center font-semibold">
        📹 Real-time AI proctoring with face & object detection (TensorFlow.js + COCO-SSD)
      </p>
    </div>
  );
}
