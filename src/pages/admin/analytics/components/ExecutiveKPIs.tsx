import React from 'react';
import { Users, FolderKanban, CheckSquare, HardDrive, TrendingUp, TrendingDown } from 'lucide-react';
import { formatBytes } from '../../../../utils/format';

interface KPIProps {
  kpis: {
    members: { current: number, trend: number };
    projects: { current: number, trend: number };
    tasks: { current: number, open: number, completed: number, trend: number };
    storage: { current: number, trend: number };
  }
}

export const ExecutiveKPIs = ({ kpis }: KPIProps) => {
  const renderTrend = (trend: number) => {
    if (trend === 0) return <span className="text-text-muted text-xs font-bold">No change</span>;
    const isPositive = trend > 0;
    return (
      <span className={`flex items-center gap-1 text-xs font-bold ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {Math.abs(trend)}% from last period
      </span>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Active Members */}
      <div className="bg-surface border border-surface-border p-5 rounded-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>
        <div>
          <p className="text-sm font-bold text-text-muted mb-1">Active Members</p>
          <div className="flex items-end gap-3">
            <h3 className="text-3xl font-black text-text-primary">{kpis.members.current}</h3>
            <div className="mb-1">{renderTrend(kpis.members.trend)}</div>
          </div>
        </div>
      </div>

      {/* Projects */}
      <div className="bg-surface border border-surface-border p-5 rounded-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-indigo/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 bg-brand-indigo/10 text-brand-indigo rounded-xl flex items-center justify-center">
            <FolderKanban className="w-5 h-5" />
          </div>
        </div>
        <div>
          <p className="text-sm font-bold text-text-muted mb-1">Active Projects</p>
          <div className="flex items-end gap-3">
            <h3 className="text-3xl font-black text-text-primary">{kpis.projects.current}</h3>
            <div className="mb-1">{renderTrend(kpis.projects.trend)}</div>
          </div>
        </div>
      </div>

      {/* Tasks */}
      <div className="bg-surface border border-surface-border p-5 rounded-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 bg-purple-500/10 text-purple-500 rounded-xl flex items-center justify-center">
            <CheckSquare className="w-5 h-5" />
          </div>
        </div>
        <div>
          <p className="text-sm font-bold text-text-muted mb-1">Total Tasks</p>
          <div className="flex items-end gap-3">
            <h3 className="text-3xl font-black text-text-primary">{kpis.tasks.current}</h3>
            <div className="mb-1">{renderTrend(kpis.tasks.trend)}</div>
          </div>
          <div className="mt-3 flex items-center gap-4 text-xs font-medium text-text-muted">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-400" /> {kpis.tasks.open} Open</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> {kpis.tasks.completed} Completed</span>
          </div>
        </div>
      </div>

      {/* Removed Storage */}
    </div>
  );
};
