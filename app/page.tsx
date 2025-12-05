'use client';

import Link from 'next/link';
import { Shield, Eye, AlertCircle, BarChart3 } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <nav className="border-b border-indigo-500/30 bg-slate-900 backdrop-blur shadow-lg">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="text-indigo-400" size={32} />
              <h1 className="text-2xl font-bold text-indigo-100">AI Proctor</h1>
            </div>
            <p className="text-indigo-300 font-semibold">Exam Monitoring System</p>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-indigo-100 mb-6">
            Advanced Cheating Detection
          </h2>
          <p className="text-xl text-indigo-200 mb-12 max-w-2xl mx-auto">
            Using hybrid AI to detect suspicious behavior during exams with real-time monitoring
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="glass-effect p-6 rounded-lg border border-indigo-500/40 shadow-lg">
              <Eye className="mx-auto text-indigo-400 mb-4" size={32} />
              <h3 className="text-indigo-100 font-bold mb-2">Face Detection</h3>
              <p className="text-indigo-300 text-sm">Detect multiple faces or absence of face</p>
            </div>

            <div className="glass-effect p-6 rounded-lg border border-amber-500/40 shadow-lg">
              <AlertCircle className="mx-auto text-amber-400 mb-4" size={32} />
              <h3 className="text-indigo-100 font-bold mb-2">Head Pose</h3>
              <p className="text-indigo-300 text-sm">Monitor head movements and attention</p>
            </div>

            <div className="glass-effect p-6 rounded-lg border border-red-500/40 shadow-lg">
              <AlertCircle className="mx-auto text-red-400 mb-4" size={32} />
              <h3 className="text-indigo-100 font-bold mb-2">Object Detection</h3>
              <p className="text-indigo-300 text-sm">Identify phones, books, or suspicious items</p>
            </div>

            <div className="glass-effect p-6 rounded-lg border border-green-500/40 shadow-lg">
              <BarChart3 className="mx-auto text-green-400 mb-4" size={32} />
              <h3 className="text-indigo-100 font-bold mb-2">Analytics</h3>
              <p className="text-indigo-300 text-sm">Real-time dashboard and reports</p>
            </div>
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/exam"
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-indigo-50 font-bold rounded-lg transition shadow-lg hover:shadow-indigo-500/50"
            >
              Start Exam Monitoring
            </Link>
            <Link
              href="/dashboard"
              className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-indigo-100 font-bold rounded-lg transition shadow-lg"
            >
              View Reports
            </Link>
            <Link
              href="/demo"
              className="px-8 py-3 bg-green-600 hover:bg-green-500 text-green-50 font-bold rounded-lg transition shadow-lg hover:shadow-green-500/50"
            >
              🎯 Model Melee Demo
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
