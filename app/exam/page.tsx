'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import ExamMonitor from '@/components/ExamMonitor';

export default function ExamPage() {
  const router = useRouter();
  const [sessionStarted, setSessionStarted] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [examName, setExamName] = useState('');
  const [examDuration, setExamDuration] = useState('60');

  const handleStartExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (studentName.trim() && examName.trim()) {
      setSessionStarted(true);
    }
  };

  if (sessionStarted) {
    return (
      <ExamMonitor
        sessionData={{
          studentName,
          examName,
          startTime: new Date(),
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <nav className="border-b border-indigo-500/30 bg-slate-900 backdrop-blur shadow-lg">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-indigo-300 hover:text-indigo-100 transition font-semibold"
          >
            <ArrowLeft size={20} />
            Back
          </button>
        </div>
      </nav>

      <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="glass-effect p-8 rounded-lg border border-indigo-500/30 shadow-xl">
          <h1 className="text-3xl font-bold text-indigo-100 mb-2">Start Exam Session</h1>
          <p className="text-indigo-200 mb-8">
            Enter student and exam details to begin monitoring
          </p>

          <form onSubmit={handleStartExam} className="space-y-6">
            <div>
              <label htmlFor="studentName" className="block text-sm font-medium text-indigo-200 mb-2">
                Student Name
              </label>
              <input
                id="studentName"
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Enter student name"
                className="w-full px-4 py-2 bg-slate-700/50 border border-indigo-400/30 rounded-lg text-indigo-50 placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400"
                required
              />
            </div>

            <div>
              <label htmlFor="examName" className="block text-sm font-medium text-indigo-200 mb-2">
                Exam Name
              </label>
              <input
                id="examName"
                type="text"
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                placeholder="Enter exam name"
                className="w-full px-4 py-2 bg-slate-700/50 border border-indigo-400/30 rounded-lg text-indigo-50 placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400"
                required
              />
            </div>

            <div>
              <label htmlFor="examDuration" className="block text-sm font-medium text-indigo-200 mb-2">
                Exam Duration (minutes)
              </label>
              <input
                id="examDuration"
                type="number"
                value={examDuration}
                onChange={(e) => setExamDuration(e.target.value)}
                placeholder="60"
                className="w-full px-4 py-2 bg-slate-700/50 border border-indigo-400/30 rounded-lg text-indigo-50 placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400"
              />
            </div>

            <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/40">
              <p className="text-amber-200 text-sm">
                ⚠️ <strong>Important:</strong> Please ensure your webcam is working and you have a stable internet connection. The system will monitor your behavior during the exam.
              </p>
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-indigo-50 font-bold rounded-lg transition shadow-lg hover:shadow-indigo-500/50"
            >
              Start Monitoring
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
