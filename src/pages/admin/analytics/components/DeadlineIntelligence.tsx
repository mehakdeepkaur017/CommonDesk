import React from 'react';
import { CalendarClock, AlertTriangle } from 'lucide-react';

interface Deadline {
  id: string;
  title: string;
  project: string;
  owner: string;
  deadline: string;
  daysLeft: number;
  risk: string;
}

export const DeadlineIntelligence = ({ deadlines }: { deadlines: Deadline[] }) => {
  return (
    <div className="bg-surface border border-surface-border rounded-2xl flex flex-col h-full overflow-hidden">
      <div className="p-5 border-b border-surface-border flex items-center justify-between">
        <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
          <CalendarClock className="w-5 h-5 text-brand-indigo" />
          Upcoming Deadlines
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto max-h-[350px] p-5">
        {deadlines.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-surface-hover rounded-xl flex items-center justify-center mb-3">
              <CalendarClock className="w-5 h-5 text-text-muted" />
            </div>
            <h4 className="text-sm font-bold text-text-primary mb-1">No upcoming deadlines</h4>
            <p className="text-xs text-text-muted">You are all caught up!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {deadlines.map(d => (
              <div key={d.id} className="flex items-start justify-between gap-3 p-4 rounded-xl border border-surface-border bg-black/[0.01] dark:bg-white/[0.01]">
                <div>
                  <h4 className="text-sm font-bold text-text-primary line-clamp-1">{d.title}</h4>
                  <p className="text-xs text-text-muted mt-1">{d.project} • {d.owner}</p>
                </div>
                <div className="flex flex-col items-end shrink-0">
                  <span className={`text-xs font-bold px-2 py-1 rounded-md mb-1 ${
                    d.risk === 'Critical' ? 'bg-red-500 text-white flex items-center gap-1' :
                    d.risk === 'High' ? 'bg-red-500/10 text-red-500' :
                    d.risk === 'Medium' ? 'bg-orange-400/10 text-orange-400' :
                    'bg-surface-hover text-text-secondary'
                  }`}>
                    {d.risk === 'Critical' && <AlertTriangle className="w-3 h-3" />}
                    {d.daysLeft < 0 ? `${Math.abs(d.daysLeft)}d Late` : d.daysLeft === 0 ? 'Today' : `${d.daysLeft}d Left`}
                  </span>
                  <span className="text-[10px] font-medium text-text-muted">
                    {new Date(d.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
