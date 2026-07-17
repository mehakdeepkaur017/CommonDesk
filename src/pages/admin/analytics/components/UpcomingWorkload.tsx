import React from 'react';
import { CalendarRange, Clock, AlertTriangle } from 'lucide-react';

interface WorkloadTask {
  id: string;
  title: string;
  project: string;
  owner: string;
  ownerAvatar: string | null;
  deadline: string;
  daysLeft: number;
  risk: string;
}

interface UpcomingWorkloadProps {
  forecast: {
    today: WorkloadTask[];
    next7Days: WorkloadTask[];
    next30Days: WorkloadTask[];
  }
}

export const UpcomingWorkload = ({ forecast }: UpcomingWorkloadProps) => {
  const renderTaskList = (tasks: WorkloadTask[], title: string, emptyMessage: string) => (
    <div className="flex-1">
      <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3 flex items-center gap-2">
        <Clock className="w-3.5 h-3.5" /> {title}
      </h4>
      <div className="space-y-2">
        {tasks.length === 0 ? (
          <p className="text-xs text-text-muted italic">{emptyMessage}</p>
        ) : (
          tasks.map(t => (
            <div key={t.id} className="p-3 bg-black/[0.02] dark:bg-white/[0.02] border border-surface-border rounded-xl">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-bold text-text-primary line-clamp-1">{t.title}</p>
                  <p className="text-[10px] text-text-muted mt-1">{t.project}</p>
                </div>
                {t.risk === 'Critical' && <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />}
              </div>
              <div className="mt-3 flex items-center gap-2">
                {t.ownerAvatar ? (
                  <img src={t.ownerAvatar} alt={t.owner} className="w-4 h-4 rounded-full" />
                ) : (
                  <div className="w-4 h-4 rounded-full bg-brand-indigo text-white flex items-center justify-center text-[8px] font-bold">
                    {t.owner[0]}
                  </div>
                )}
                <span className="text-[10px] font-medium text-text-secondary">{t.owner}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-surface border border-surface-border p-5 rounded-2xl flex flex-col h-full">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
          <CalendarRange className="w-4 h-4" />
        </div>
        <h3 className="text-lg font-bold text-text-primary">Upcoming Workload Forecast</h3>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {renderTaskList(forecast.today, "Due Today", "No tasks due today.")}
        {renderTaskList(forecast.next7Days, "Next 7 Days", "No tasks due in the next week.")}
        {renderTaskList(forecast.next30Days, "Next 30 Days", "No tasks due later this month.")}
      </div>
    </div>
  );
};
