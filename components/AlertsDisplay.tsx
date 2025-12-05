'use client';

import { Alert } from './ExamMonitor';
import { AlertTriangle, AlertCircle } from 'lucide-react';

interface AlertsDisplayProps {
  alerts: Alert[];
}

export default function AlertsDisplay({ alerts }: AlertsDisplayProps) {
  const criticalCount = alerts.filter((a) => a.type === 'critical').length;
  const warningCount = alerts.filter((a) => a.type === 'warning').length;

  const recentAlerts = alerts.slice(-5).reverse();

  return (
    <div className="glass-effect p-4 rounded-lg border border-slate-700">
      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
        <AlertTriangle size={20} />
        Alert Log
      </h3>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 bg-red-900/20 border border-red-700 rounded-lg">
          <p className="text-red-400 text-xs font-semibold">Critical</p>
          <p className="text-red-300 text-lg font-bold">{criticalCount}</p>
        </div>
        <div className="p-3 bg-amber-900/20 border border-amber-700 rounded-lg">
          <p className="text-amber-400 text-xs font-semibold">Warnings</p>
          <p className="text-amber-300 text-lg font-bold">{warningCount}</p>
        </div>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {recentAlerts.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-6">No alerts yet. Stay focused!</p>
        ) : (
          recentAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3 rounded-lg text-xs ${
                alert.type === 'critical'
                  ? 'bg-red-900/30 border border-red-600 text-red-300'
                  : 'bg-amber-900/30 border border-amber-600 text-amber-300'
              }`}
            >
              <div className="flex items-start gap-2">
                {alert.type === 'critical' ? (
                  <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p>{alert.message}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
