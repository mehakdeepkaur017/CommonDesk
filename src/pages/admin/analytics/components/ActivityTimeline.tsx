import React, { useState } from 'react';
import { History, Filter, Search } from 'lucide-react';
import { format, isToday, isYesterday, isThisWeek } from 'date-fns';

interface ActivityItem {
  id: string;
  action: string;
  details: string | null;
  actorName: string;
  actorAvatar: string | null;
  projectName: string | null;
  taskTitle: string | null;
  createdAt: string;
}

export const ActivityTimeline = ({ activities }: { activities: ActivityItem[] }) => {
  const [filter, setFilter] = useState('');
  
  const filteredActivities = activities.filter(a => 
    a.actorName.toLowerCase().includes(filter.toLowerCase()) || 
    (a.projectName && a.projectName.toLowerCase().includes(filter.toLowerCase())) ||
    (a.taskTitle && a.taskTitle.toLowerCase().includes(filter.toLowerCase())) ||
    a.action.toLowerCase().includes(filter.toLowerCase())
  );

  const groupedActivities = filteredActivities.reduce((acc, curr) => {
    const date = new Date(curr.createdAt);
    let group = 'Earlier';
    if (isToday(date)) group = 'Today';
    else if (isYesterday(date)) group = 'Yesterday';
    else if (isThisWeek(date)) group = 'This Week';
    
    if (!acc[group]) acc[group] = [];
    acc[group].push(curr);
    return acc;
  }, {} as Record<string, ActivityItem[]>);

  const groupOrder = ['Today', 'Yesterday', 'This Week', 'Earlier'];

  return (
    <div className="bg-surface border border-surface-border rounded-2xl flex flex-col h-full overflow-hidden">
      <div className="p-5 border-b border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
          <History className="w-5 h-5 text-brand-indigo" />
          Enhanced Activity Timeline
        </h3>
        
        <div className="relative">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Filter activities..." 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="pl-9 pr-4 py-1.5 bg-background border border-surface-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-brand-indigo"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto max-h-[600px] p-5">
        {filteredActivities.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <History className="w-8 h-8 text-text-muted mb-3 opacity-50" />
            <h4 className="text-sm font-bold text-text-primary mb-1">No activities found</h4>
            <p className="text-xs text-text-muted">Try adjusting your filters or wait for users to interact.</p>
          </div>
        ) : (
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-surface-border before:to-transparent">
            {groupOrder.map(group => {
              if (!groupedActivities[group]) return null;
              return (
                <div key={group} className="relative z-10">
                  <div className="flex justify-center mb-6">
                    <span className="px-4 py-1 bg-surface border border-surface-border rounded-full text-xs font-bold text-text-muted uppercase tracking-widest shadow-sm">
                      {group}
                    </span>
                  </div>
                  <div className="space-y-6">
                    {groupedActivities[group].map((a) => (
                      <div key={a.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-surface bg-surface-hover shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-md">
                          {a.actorAvatar ? (
                            <img src={a.actorAvatar} alt={a.actorName} className="w-full h-full rounded-full" />
                          ) : (
                            <span className="text-xs font-bold">{a.actorName[0]}</span>
                          )}
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-surface-border bg-black/[0.01] dark:bg-white/[0.01] hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-colors">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-bold text-sm text-text-primary">{a.actorName}</span>
                            <time className="text-[10px] font-bold text-text-muted uppercase tracking-wide">
                              {format(new Date(a.createdAt), 'h:mm a')}
                            </time>
                          </div>
                          <div className="text-sm text-text-secondary leading-snug">
                            {a.action === 'task_created' ? 'Created task ' :
                             a.action === 'status_changed' ? 'Updated status of ' :
                             a.action === 'file_uploaded' ? 'Uploaded file to ' :
                             `${a.action} `}
                             {a.taskTitle && <span className="font-bold text-text-primary">"{a.taskTitle}"</span>}
                          </div>
                          {a.projectName && (
                            <div className="text-xs font-bold text-brand-indigo mt-2 bg-brand-indigo/5 inline-block px-2 py-1 rounded">
                              Project: {a.projectName}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
