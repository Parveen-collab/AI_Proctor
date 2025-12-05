'use client';

import { useState, useEffect } from 'react';
import { Shield, Eye, AlertTriangle, Brain, TrendingUp } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  status: 'active' | 'warning' | 'alert';
}

function MetricCard({ title, value, icon, status }: MetricCardProps) {
  const statusColors = {
    active: 'border-green-500/40 bg-green-500/5',
    warning: 'border-amber-500/40 bg-amber-500/5',
    alert: 'border-red-500/40 bg-red-500/5',
  };

  const valueColors = {
    active: 'text-green-400',
    warning: 'text-amber-400',
    alert: 'text-red-400',
  };

  return (
    <div className={`glass-effect p-4 rounded-lg border ${statusColors[status]} shadow-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-indigo-300 text-xs font-semibold mb-1">{title}</p>
          <p className={`text-2xl font-bold ${valueColors[status]}`}>{value}</p>
        </div>
        <div className={`${valueColors[status]}`}>{icon}</div>
      </div>
    </div>
  );
}

export default function PresentationMode() {
  const [metrics, setMetrics] = useState({
    facesDetected: 1,
    attention: 95,
    suspiciousActivity: 0,
    objects: [],
    sessionTime: 0,
  });

  const [alerts, setAlerts] = useState<string[]>([]);
  const [demoPhase, setDemoPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        sessionTime: prev.sessionTime + 1,
        attention: Math.max(70, prev.attention + (Math.random() - 0.5) * 10),
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const runDemoScenario = (scenario: number) => {
    setDemoPhase(scenario);
    setAlerts([]);

    switch (scenario) {
      case 1:
        setMetrics({
          facesDetected: 1,
          attention: 95,
          suspiciousActivity: 0,
          objects: [],
          sessionTime: 0,
        });
        break;
      case 2:
        setMetrics({
          facesDetected: 0,
          attention: 0,
          suspiciousActivity: 1,
          objects: [],
          sessionTime: 0,
        });
        setAlerts(['⚠️ No face detected - Student not looking at screen']);
        break;
      case 3:
        setMetrics({
          facesDetected: 2,
          attention: 0,
          suspiciousActivity: 2,
          objects: [],
          sessionTime: 0,
        });
        setAlerts(['🚨 Multiple faces detected!', '🚨 Potential cheating attempt']);
        break;
      case 4:
        setMetrics({
          facesDetected: 1,
          attention: 40,
          suspiciousActivity: 1,
          objects: ['cell phone'],
          sessionTime: 0,
        });
        setAlerts(['🚨 Phone detected in exam', '⚠️ Excessive head movement']);
        break;
      case 5:
        setMetrics({
          facesDetected: 1,
          attention: 30,
          suspiciousActivity: 2,
          objects: ['book', 'laptop'],
          sessionTime: 0,
        });
        setAlerts(['⚠️ Book detected', '⚠️ Suspicious object detected', '⚠️ Low attention score']);
        break;
    }
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="text-indigo-400" size={40} />
            <h1 className="text-4xl font-bold text-indigo-100">AI Proctor - Model Melee Demo</h1>
          </div>
          <p className="text-indigo-300 text-lg">Real-time Cheating Detection & Proctoring System</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Faces Detected"
            value={metrics.facesDetected}
            icon={<Eye size={28} />}
            status={metrics.facesDetected === 1 ? 'active' : 'alert'}
          />
          <MetricCard
            title="Attention Score"
            value={`${Math.round(metrics.attention)}%`}
            icon={<TrendingUp size={28} />}
            status={metrics.attention > 80 ? 'active' : metrics.attention > 50 ? 'warning' : 'alert'}
          />
          <MetricCard
            title="Alerts Triggered"
            value={metrics.suspiciousActivity}
            icon={<AlertTriangle size={28} />}
            status={metrics.suspiciousActivity === 0 ? 'active' : 'alert'}
          />
          <MetricCard
            title="Session Duration"
            value={formatTime(metrics.sessionTime)}
            icon={<Shield size={28} />}
            status="active"
          />
        </div>

        <div className="glass-effect p-6 rounded-lg border border-indigo-500/40 shadow-lg">
          <h2 className="text-xl font-bold text-indigo-100 mb-4">🎯 Detection Capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <h3 className="text-green-300 font-semibold mb-2">✅ Real-Time Detection</h3>
              <ul className="text-green-200 text-sm space-y-1">
                <li>• Face detection & tracking</li>
                <li>• Multiple face detection</li>
                <li>• Head pose estimation (pitch, yaw, roll)</li>
                <li>• Eye gaze tracking</li>
              </ul>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
              <h3 className="text-amber-300 font-semibold mb-2">🔍 Object Detection</h3>
              <ul className="text-amber-200 text-sm space-y-1">
                <li>• Phone/mobile device detection</li>
                <li>• Laptop/computer detection</li>
                <li>• Book & notes detection</li>
                <li>• Suspicious item identification</li>
              </ul>
            </div>
          </div>

          <h3 className="text-indigo-300 font-semibold mb-4">Demo Scenarios:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {[
              { num: 1, label: 'Normal' },
              { num: 2, label: 'No Face' },
              { num: 3, label: 'Multi-Face' },
              { num: 4, label: 'Phone' },
              { num: 5, label: 'Books+Laptop' },
            ].map(({ num, label }) => (
              <button
                key={num}
                onClick={() => runDemoScenario(num)}
                className={`py-2 px-3 rounded-lg font-semibold transition-all ${
                  demoPhase === num
                    ? 'bg-indigo-600 text-indigo-50 shadow-lg shadow-indigo-500/50'
                    : 'bg-slate-700 hover:bg-slate-600 text-indigo-200'
                }`}
              >
                Scenario {num}
                <div className="text-xs mt-1">{label}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="glass-effect p-6 rounded-lg border border-indigo-500/40 shadow-lg">
          <h2 className="text-xl font-bold text-indigo-100 mb-4">🚨 Active Alerts</h2>
          {alerts.length === 0 ? (
            <div className="text-green-300 text-center py-4 text-lg font-semibold">
              ✅ No suspicious activity detected
            </div>
          ) : (
            <div className="space-y-2">
              {alerts.map((alert, idx) => (
                <div
                  key={idx}
                  className="bg-red-500/10 border border-red-500/30 text-red-200 px-4 py-2 rounded-lg font-semibold"
                >
                  {alert}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-effect p-6 rounded-lg border border-indigo-500/40 shadow-lg">
          <h2 className="text-xl font-bold text-indigo-100 mb-4">📊 Detected Objects</h2>
          <div className="flex flex-wrap gap-2">
            {metrics.objects.length === 0 ? (
              <span className="text-indigo-300">No suspicious objects detected</span>
            ) : (
              metrics.objects.map((obj, idx) => (
                <span
                  key={idx}
                  className="bg-red-600 text-red-50 px-3 py-1 rounded-full text-sm font-semibold"
                >
                  {obj.toUpperCase()}
                </span>
              ))
            )}
          </div>
        </div>

        <div className="glass-effect p-6 rounded-lg border border-slate-700/50 shadow-lg">
          <h3 className="text-lg font-bold text-indigo-100 mb-4">🏗️ Technology Stack</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-indigo-300 font-semibold">Frontend:</span>
              <p className="text-indigo-200">Next.js, React, TypeScript</p>
            </div>
            <div>
              <span className="text-indigo-300 font-semibold">ML Models:</span>
              <p className="text-indigo-200">TensorFlow.js, COCO-SSD</p>
            </div>
            <div>
              <span className="text-indigo-300 font-semibold">Detection:</span>
              <p className="text-indigo-200">Real-time Computer Vision</p>
            </div>
            <div>
              <span className="text-indigo-300 font-semibold">Performance:</span>
              <p className="text-indigo-200">Browser-based, GPU-accelerated</p>
            </div>
            <div>
              <span className="text-indigo-300 font-semibold">Privacy:</span>
              <p className="text-indigo-200">No server uploads</p>
            </div>
            <div>
              <span className="text-indigo-300 font-semibold">Latency:</span>
              <p className="text-indigo-200">&lt;100ms per frame</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
