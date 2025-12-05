'use client';

import Link from 'next/link';
import { BarChart3, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';

interface ExamSession {
  id: string;
  studentName: string;
  examName: string;
  duration: number;
  cheatingDetected: boolean;
  suspiciousActivities: number;
  timestamp: string;
}

interface DashboardProps {
  sessions: ExamSession[];
}

export default function Dashboard({ sessions }: DashboardProps) {
  const totalSessions = sessions.length;
  const suspiciousSessions = sessions.filter((s) => s.cheatingDetected).length;
  const totalActivities = sessions.reduce((sum, s) => sum + s.suspiciousActivities, 0);
  const averageDuration =
    sessions.length > 0
      ? Math.round(sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length)
      : 0;

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-effect p-6 rounded-lg border border-indigo-500/40 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-300 text-sm mb-2 font-semibold">Total Sessions</p>
              <p className="text-3xl font-bold text-indigo-100">{totalSessions}</p>
            </div>
            <BarChart3 className="text-indigo-400" size={32} />
          </div>
        </div>

        <div className="glass-effect p-6 rounded-lg border border-red-500/40 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-300 text-sm mb-2 font-semibold">Suspicious Sessions</p>
              <p className="text-3xl font-bold text-red-200">{suspiciousSessions}</p>
            </div>
            <AlertCircle className="text-red-400" size={32} />
          </div>
        </div>

        <div className="glass-effect p-6 rounded-lg border border-amber-500/40 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-300 text-sm mb-2 font-semibold">Total Alerts</p>
              <p className="text-3xl font-bold text-amber-200">{totalActivities}</p>
            </div>
            <TrendingUp className="text-amber-400" size={32} />
          </div>
        </div>

        <div className="glass-effect p-6 rounded-lg border border-green-500/40 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-300 text-sm mb-2 font-semibold">Avg Duration</p>
              <p className="text-lg font-bold text-green-200 font-mono">
                {formatDuration(averageDuration)}
              </p>
            </div>
            <CheckCircle className="text-green-400" size={32} />
          </div>
        </div>
      </div>

      <div className="glass-effect rounded-lg border border-indigo-500/40 overflow-hidden shadow-lg">
        <div className="p-6 border-b border-indigo-500/30">
          <h3 className="text-xl font-bold text-indigo-100">Recent Sessions</h3>
        </div>

        {sessions.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-indigo-300 mb-6 font-semibold">No exam sessions recorded yet.</p>
            <Link
              href="/exam"
              className="inline-block px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-indigo-50 font-semibold rounded-lg transition shadow-lg"
            >
              Start a Session
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/60 border-b border-indigo-500/30">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-200">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-200">
                    Exam
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-200">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-200">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-200">
                    Alerts
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-200">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-500/20">
                {[...sessions].reverse().map((session) => (
                  <tr key={session.id} className="hover:bg-indigo-500/10 transition">
                    <td className="px-6 py-4 text-sm text-indigo-100 font-medium">
                      {session.studentName}
                    </td>
                    <td className="px-6 py-4 text-sm text-indigo-200">{session.examName}</td>
                    <td className="px-6 py-4 text-sm text-indigo-200 font-mono">
                      {formatDuration(session.duration)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {session.cheatingDetected ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-900/40 text-red-200 rounded-full text-xs font-semibold border border-red-500/50">
                          <AlertCircle size={14} />
                          Suspicious
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-900/40 text-green-200 rounded-full text-xs font-semibold border border-green-500/50">
                          <CheckCircle size={14} />
                          Clear
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`font-bold ${session.suspiciousActivities > 0 ? 'text-amber-300' : 'text-indigo-300'}`}
                      >
                        {session.suspiciousActivities}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-indigo-300">
                      {formatDate(session.timestamp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <Link
          href="/exam"
          className="flex-1 text-center px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-indigo-50 font-bold rounded-lg transition shadow-lg hover:shadow-indigo-500/50"
        >
          Start New Session
        </Link>
        <button
          onClick={() => {
            localStorage.removeItem('exam_sessions');
            window.location.reload();
          }}
          className="px-6 py-3 bg-red-600/80 hover:bg-red-500/80 text-red-50 font-bold rounded-lg transition shadow-lg"
        >
          Clear Data
        </button>
      </div>
    </div>
  );
}
