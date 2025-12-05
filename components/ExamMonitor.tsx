'use client';

import { useEffect, useRef, useState } from 'react';
import WebcamCapture from './WebcamCapture';
import DetectionPanel from './DetectionPanel';
import AlertsDisplay from './AlertsDisplay';

export interface Detection {
  faceDetected: boolean;
  multipleFaces: boolean;
  headPose: {
    pitch: number;
    yaw: number;
    roll: number;
  };
  phoneDetected: boolean;
  suspiciousObjects: string[];
  timestamp: number;
}

export interface Alert {
  id: string;
  type: 'warning' | 'critical';
  message: string;
  timestamp: number;
}

interface SessionData {
  studentName: string;
  examName: string;
  startTime: Date;
}

export default function ExamMonitor({ sessionData }: { sessionData: SessionData }) {
  const [detection, setDetection] = useState<Detection | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [sessionTime, setSessionTime] = useState(0);
  const [isStopped, setIsStopped] = useState(false);
  const alertTimerRef = useRef<NodeJS.Timeout>();
  const sessionTimerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    sessionTimerRef.current = setInterval(() => {
      setSessionTime((prev) => prev + 1);
    }, 1000);

    return () => {
      if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
    };
  }, []);

  const handleDetection = (detectionData: Detection) => {
    setDetection(detectionData);

    const newAlerts: Alert[] = [];

    if (!detectionData.faceDetected) {
      newAlerts.push({
        id: `face-${detectionData.timestamp}`,
        type: 'critical',
        message: 'No face detected - Look at the camera!',
        timestamp: detectionData.timestamp,
      });
    }

    if (detectionData.multipleFaces) {
      newAlerts.push({
        id: `multi-face-${detectionData.timestamp}`,
        type: 'critical',
        message: 'Multiple faces detected!',
        timestamp: detectionData.timestamp,
      });
    }

    if (detectionData.phoneDetected) {
      newAlerts.push({
        id: `phone-${detectionData.timestamp}`,
        type: 'critical',
        message: 'Phone or device detected!',
        timestamp: detectionData.timestamp,
      });
    }

    if (Math.abs(detectionData.headPose.yaw) > 25) {
      newAlerts.push({
        id: `head-yaw-${detectionData.timestamp}`,
        type: 'warning',
        message: 'Head turned too much - Look forward!',
        timestamp: detectionData.timestamp,
      });
    }

    if (Math.abs(detectionData.headPose.pitch) > 25) {
      newAlerts.push({
        id: `head-pitch-${detectionData.timestamp}`,
        type: 'warning',
        message: 'Excessive head movement detected',
        timestamp: detectionData.timestamp,
      });
    }

    if (detectionData.suspiciousObjects.length > 0) {
      newAlerts.push({
        id: `objects-${detectionData.timestamp}`,
        type: 'warning',
        message: `Suspicious object detected: ${detectionData.suspiciousObjects.join(', ')}`,
        timestamp: detectionData.timestamp,
      });
    }

    if (newAlerts.length > 0) {
      setAlerts((prev) => [...prev, ...newAlerts].slice(-10));
    }
  };

  const handleEndSession = () => {
    setIsStopped(true);
    if (alertTimerRef.current) clearInterval(alertTimerRef.current);
    if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);

    const sessionRecord = {
      id: `session-${Date.now()}`,
      studentName: sessionData.studentName,
      examName: sessionData.examName,
      duration: sessionTime,
      cheatingDetected: alerts.some((a) => a.type === 'critical'),
      suspiciousActivities: alerts.length,
      timestamp: new Date().toISOString(),
    };

    const existing = JSON.parse(localStorage.getItem('exam_sessions') || '[]');
    localStorage.setItem('exam_sessions', JSON.stringify([...existing, sessionRecord]));
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="glass-effect p-6 rounded-lg border border-slate-700">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-slate-400 text-sm">Student</p>
            <p className="text-white font-semibold">{sessionData.studentName}</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm">Exam</p>
            <p className="text-white font-semibold">{sessionData.examName}</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm">Duration</p>
            <p className="text-white font-semibold font-mono">{formatTime(sessionTime)}</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm">Alerts</p>
            <p className={`font-semibold font-mono ${alerts.length > 0 ? 'text-red-400' : 'text-green-400'}`}>
              {alerts.length}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {!isStopped ? (
            <WebcamCapture onDetection={handleDetection} />
          ) : (
            <div className="glass-effect p-8 rounded-lg border border-slate-700 text-center h-96 flex items-center justify-center">
              <div>
                <p className="text-white text-xl font-semibold mb-4">Session Ended</p>
                <p className="text-slate-400 mb-6">Total Duration: {formatTime(sessionTime)}</p>
                <a
                  href="/dashboard"
                  className="inline-block px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                >
                  View Report
                </a>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {detection && <DetectionPanel detection={detection} />}
          <div className="glass-effect p-4 rounded-lg border border-slate-700">
            {isStopped ? (
              <a
                href="/exam"
                className="w-full block text-center px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg"
              >
                Start New Session
              </a>
            ) : (
              <button
                onClick={handleEndSession}
                className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
              >
                End Session
              </button>
            )}
          </div>
          <AlertsDisplay alerts={alerts} />
        </div>
      </div>
    </div>
  );
}
