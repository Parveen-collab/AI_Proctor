'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Dashboard from '@/components/Dashboard';

interface ExamSession {
  id: string;
  studentName: string;
  examName: string;
  duration: number;
  cheatingDetected: boolean;
  suspiciousActivities: number;
  timestamp: string;
}

export default function DashboardPage() {
  const [sessions, setSessions] = useState<ExamSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('exam_sessions');
    if (stored) {
      setSessions(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-white font-semibold">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <nav className="border-b border-indigo-500/30 bg-slate-900 backdrop-blur sticky top-0 z-50 shadow-lg">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-indigo-300 hover:text-indigo-100 transition font-semibold"
            >
              <ArrowLeft size={20} />
              Back to Home
            </Link>
            <h1 className="text-2xl font-bold text-indigo-100">Reports & Analytics</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Dashboard sessions={sessions} />
      </main>
    </div>
  );
}
