import React from 'react';
import { HeartPulse, Info } from 'lucide-react';

interface HealthProps {
  health: {
    score: number;
    level: string;
    reasons: string[];
  }
}

export const WorkspaceHealth = ({ health }: HealthProps) => {
  const getHealthColor = () => {
    if (health.level === 'Excellent') return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    if (health.level === 'Good') return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    if (health.level === 'Needs Attention') return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
    return 'text-red-500 bg-red-500/10 border-red-500/20';
  };

  const colorClass = getHealthColor();

  return (
    <div className={`h-full border p-6 rounded-2xl flex flex-col justify-between ${colorClass}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <HeartPulse className="w-6 h-6" />
          <h3 className="text-lg font-bold">Workspace Health</h3>
        </div>
        <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/20 dark:bg-black/20">
          {health.level}
        </span>
      </div>
      
      <div className="flex items-end gap-2 mb-6">
        <span className="text-6xl font-black leading-none">{health.score}</span>
        <span className="text-xl font-bold opacity-60 mb-1">/ 100</span>
      </div>

      <div className="space-y-3 bg-white/40 dark:bg-black/20 p-4 rounded-xl">
        <h4 className="text-xs font-bold uppercase tracking-wider opacity-80 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5" /> Health Factors
        </h4>
        {health.reasons.length > 0 ? (
          <ul className="space-y-2">
            {health.reasons.map((reason, idx) => (
              <li key={idx} className="text-sm font-medium opacity-90 leading-tight">
                • {reason}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm font-medium opacity-90">All systems optimal. No critical issues detected.</p>
        )}
      </div>
    </div>
  );
};
