'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';

interface SessionInfoProps {
  onStartSession: (studentName: string, examName: string) => void;
}

export default function SessionInfo({ onStartSession }: SessionInfoProps) {
  const [studentName, setStudentName] = useState('');
  const [examName, setExamName] = useState('');
  const [error, setError] = useState('');

  const handleStart = () => {
    if (!studentName.trim() || !examName.trim()) {
      setError('Please fill in all fields');
      return;
    }
    onStartSession(studentName, examName);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="glass-effect p-8 rounded-lg border border-slate-700">
        <h2 className="text-2xl font-bold text-white mb-6">Start Exam Session</h2>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-slate-300 font-medium mb-2">
              Student Name
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-2">
              Exam Name
            </label>
            <input
              type="text"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              placeholder="Enter exam name"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-900/30 border border-red-500 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          <div className="p-4 bg-amber-900/30 border border-amber-600 rounded-lg">
            <p className="text-amber-300 text-sm">
              ⚠️ This session will monitor your webcam. Ensure good lighting and clear visibility.
              Suspicious activities will be recorded.
            </p>
          </div>
        </div>

        <button
          onClick={handleStart}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
        >
          <Play size={20} />
          Start Monitoring
        </button>
      </div>
    </div>
  );
}
