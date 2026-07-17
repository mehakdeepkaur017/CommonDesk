import React from 'react';
import { Users, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MemberPerf {
  id: string;
  name: string;
  avatarUrl: string | null;
  assignedTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  completionRate: number;
  workload: string;
  score: number;
}

export const TeamProductivity = ({ team }: { team: MemberPerf[] }) => {
  const getWorkloadBadge = (workload: string) => {
    if (workload === 'Underloaded') return <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-500 text-[10px] font-bold uppercase tracking-wider">Underloaded</span>;
    if (workload === 'Balanced') return <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wider">Balanced</span>;
    if (workload === 'Busy') return <span className="px-2 py-1 rounded bg-orange-400/10 text-orange-400 text-[10px] font-bold uppercase tracking-wider">Busy</span>;
    return <span className="px-2 py-1 rounded bg-red-500/10 text-red-500 text-[10px] font-bold uppercase tracking-wider">Overloaded</span>;
  };

  return (
    <div className="bg-surface border border-surface-border rounded-2xl overflow-hidden flex flex-col">
      <div className="p-5 border-b border-surface-border flex items-center justify-between">
        <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
          <Users className="w-5 h-5 text-brand-indigo" />
          Team Productivity Leaderboard
        </h3>
        <Link to="/admin/members" className="text-xs font-bold text-brand-indigo hover:underline">Manage Team</Link>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-surface-border bg-black/[0.02] dark:bg-background">
              <th className="px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wider">Member</th>
              <th className="px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wider text-center">Score</th>
              <th className="px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wider text-center">Assigned</th>
              <th className="px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wider text-center">Completed</th>
              <th className="px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wider text-center">Pending</th>
              <th className="px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wider text-right">Workload Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border/50">
            {team.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-text-muted text-sm font-medium">No team data available.</td>
              </tr>
            ) : team.slice(0, 5).map(m => (
              <tr key={m.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    {m.avatarUrl ? (
                      <img src={m.avatarUrl} alt={m.name} className="w-8 h-8 rounded-full" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-brand-indigo text-white flex items-center justify-center font-bold text-xs">
                        {m.name[0]}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-bold text-text-primary">{m.name}</p>
                      <p className="text-xs text-text-muted">{m.completionRate}% Completion Rate</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-brand-indigo" />
                    <span className="text-sm font-bold text-text-primary">{m.score}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-center">
                  <span className="text-sm font-medium text-text-secondary">{m.assignedTasks}</span>
                </td>
                <td className="px-5 py-4 text-center">
                  <span className="text-sm font-bold text-emerald-500">{m.completedTasks}</span>
                </td>
                <td className="px-5 py-4 text-center">
                  <span className={`text-sm font-bold ${m.pendingTasks > 10 ? 'text-orange-400' : 'text-text-secondary'}`}>
                    {m.pendingTasks}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex justify-end">{getWorkloadBadge(m.workload)}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
