import React from 'react';
import { Activity, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MemberActivity {
  id: string;
  name: string;
  avatarUrl: string | null;
  status: string;
  lastActive: string;
  daysSinceActive: number;
  assignedTasks: number;
  workload: string;
}

export const MemberActivityMonitor = ({ members }: { members: MemberActivity[] }) => {
  return (
    <div className="bg-surface border border-surface-border rounded-2xl overflow-hidden flex flex-col">
      <div className="p-5 border-b border-surface-border flex items-center justify-between">
        <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
          <Activity className="w-5 h-5 text-brand-indigo" />
          Member Activity Monitor
        </h3>
        <Link to="/admin/members" className="text-xs font-bold text-brand-indigo hover:underline">Manage Users</Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-surface-border bg-black/[0.02] dark:bg-background">
              <th className="px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wider">Member</th>
              <th className="px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wider text-center">Status</th>
              <th className="px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wider text-center">Last Active</th>
              <th className="px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wider text-center">Workload</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border/50">
            {members.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-text-muted text-sm font-medium">No activity data available.</td>
              </tr>
            ) : members.slice(0, 10).map(m => (
              <tr key={m.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-3">
                  <Link to={`/admin/members`} className="flex items-center gap-3 group">
                    {m.avatarUrl ? (
                      <img src={m.avatarUrl} alt={m.name} className="w-8 h-8 rounded-full" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-brand-indigo text-white flex items-center justify-center font-bold text-xs">
                        {m.name[0]}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-bold text-text-primary group-hover:text-brand-indigo transition-colors">{m.name}</p>
                      <p className="text-xs text-text-muted">{m.assignedTasks} assigned tasks</p>
                    </div>
                  </Link>
                </td>
                <td className="px-5 py-3 text-center">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                    m.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                  }`}>
                    {m.status}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-medium text-text-primary flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-text-muted" />
                      {m.daysSinceActive === 0 ? 'Today' : `${m.daysSinceActive} days ago`}
                    </span>
                    <span className="text-[10px] text-text-muted mt-0.5">
                      {new Date(m.lastActive).toLocaleDateString()}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3 text-center">
                  <span className={`text-xs font-bold ${
                    m.workload === 'Overloaded' ? 'text-red-500' : 
                    m.workload === 'Underloaded' ? 'text-blue-500' : 
                    'text-text-secondary'
                  }`}>
                    {m.workload}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
