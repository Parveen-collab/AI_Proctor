'use client';

import { Detection } from './ExamMonitor';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface DetectionPanelProps {
  detection: Detection;
}

export default function DetectionPanel({ detection }: DetectionPanelProps) {
  const getStatusIcon = (condition: boolean) => {
    return condition ? (
      <CheckCircle className="text-green-400" size={20} />
    ) : (
      <AlertCircle className="text-red-400" size={20} />
    );
  };

  const getPoseStatus = (value: number, threshold: number = 25) => {
    return Math.abs(value) <= threshold;
  };

  return (
    <div className="glass-effect p-4 rounded-lg border border-slate-700 space-y-4">
      <h3 className="text-white font-semibold flex items-center gap-2">
        <span>📊 Detection Status</span>
      </h3>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
          <span className="text-slate-300 text-sm">Face Detected</span>
          <div className="flex items-center gap-2">
            {getStatusIcon(detection.faceDetected)}
            <span className="text-xs text-slate-400">
              {detection.faceDetected ? 'Yes' : 'No'}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
          <span className="text-slate-300 text-sm">Multiple Faces</span>
          <div className="flex items-center gap-2">
            {getStatusIcon(!detection.multipleFaces)}
            <span className="text-xs text-slate-400">
              {detection.multipleFaces ? 'Detected' : 'Clear'}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
          <span className="text-slate-300 text-sm">Phone/Device</span>
          <div className="flex items-center gap-2">
            {getStatusIcon(!detection.phoneDetected)}
            <span className="text-xs text-slate-400">
              {detection.phoneDetected ? 'Detected' : 'None'}
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-700 space-y-3">
          <div>
            <p className="text-slate-400 text-xs mb-2">Head Pose</p>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-xs">Pitch</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getPoseStatus(detection.headPose.pitch) ? 'bg-green-500' : 'bg-red-500'}`}
                      style={{
                        width: `${Math.min(100, (Math.abs(detection.headPose.pitch) / 90) * 100)}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-xs text-slate-400 w-8">
                    {detection.headPose.pitch.toFixed(0)}°
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-xs">Yaw</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getPoseStatus(detection.headPose.yaw) ? 'bg-green-500' : 'bg-red-500'}`}
                      style={{
                        width: `${Math.min(100, (Math.abs(detection.headPose.yaw) / 90) * 100)}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-xs text-slate-400 w-8">
                    {detection.headPose.yaw.toFixed(0)}°
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-xs">Roll</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{
                        width: `${Math.min(100, (Math.abs(detection.headPose.roll) / 90) * 100)}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-xs text-slate-400 w-8">
                    {detection.headPose.roll.toFixed(0)}°
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {detection.suspiciousObjects.length > 0 && (
          <div className="p-3 bg-amber-900/30 border border-amber-600 rounded-lg">
            <p className="text-amber-300 text-xs font-semibold mb-2">Suspicious Objects:</p>
            <div className="flex flex-wrap gap-2">
              {detection.suspiciousObjects.map((obj, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-amber-900/50 text-amber-300 px-2 py-1 rounded"
                >
                  {obj}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
