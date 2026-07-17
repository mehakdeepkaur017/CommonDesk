import React, { useState } from 'react';
import { FolderKanban, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProjectPerf {
  id: string;
  name: string;
  progress: number;
  openTasks: number;
  completedTasks: number;
  blockedTasks: number;
  overdueTasks: number;
  membersCount: number;
  deadline: string | null;
  risk: string;
  riskReason?: string;
  suggestedAction?: string;
  status: string;
  health?: string;
}

export const ProjectPerformance = ({ projects }: { projects: ProjectPerf[] }) => {
  const [sortConfig, setSortConfig] = useState<{ key: keyof ProjectPerf, direction: 'asc'|'desc' }>({ key: 'risk', direction: 'desc' });

  const sortedProjects = [...projects].sort((a, b) => {
    if (a[sortConfig.key]! < b[sortConfig.key]!) return sortConfig.direction === 'asc' ? -1 : 1;
    if (a[sortConfig.key]! > b[sortConfig.key]!) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const requestSort = (key: keyof ProjectPerf) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const getRiskBadge = (risk: string) => {
    if (risk === 'Low') return <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wider">Low</span>;
    if (risk === 'Medium') return <span className="px-2 py-1 rounded bg-orange-400/10 text-orange-400 text-[10px] font-bold uppercase tracking-wider">Medium</span>;
    if (risk === 'High') return <span className="px-2 py-1 rounded bg-red-500/10 text-red-500 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> High</span>;
    return <span className="px-2 py-1 rounded bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> Critical</span>;
  };

  const SortHeader = ({ label, sortKey, align = 'left' }: { label: string, sortKey: keyof ProjectPerf, align?: 'left'|'center'|'right' }) => (
    <th 
      className={`px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wider cursor-pointer hover:bg-black/[0.05] dark:hover:bg-white/[0.05] transition-colors ${align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left'}`}
      onClick={() => requestSort(sortKey)}
    >
      {label} {sortConfig.key === sortKey && (sortConfig.direction === 'asc' ? '↑' : '↓')}
    </th>
  );

  return (
    <div className="bg-surface border border-surface-border rounded-2xl overflow-hidden h-full flex flex-col">
      <div className="p-5 border-b border-surface-border flex items-center justify-between">
        <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
          <FolderKanban className="w-5 h-5 text-brand-indigo" />
          Project Comparison Table
        </h3>
        <Link to="/admin/projects" className="text-xs font-bold text-brand-indigo hover:underline">View All Projects</Link>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="border-b border-surface-border bg-black/[0.02] dark:bg-background">
              <SortHeader label="Project" sortKey="name" />
              <SortHeader label="Progress" sortKey="progress" />
              <SortHeader label="Members" sortKey="membersCount" align="center" />
              <SortHeader label="Open" sortKey="openTasks" align="center" />
              <SortHeader label="Completed" sortKey="completedTasks" align="center" />
              <SortHeader label="Overdue" sortKey="overdueTasks" align="center" />
              <SortHeader label="Risk Level" sortKey="risk" align="right" />
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border/50">
            {sortedProjects.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-text-muted text-sm font-medium">
                  No active projects found. 
                  <div className="mt-2"><Link to="/admin/projects" className="text-brand-indigo hover:underline">Create a project to start analyzing data.</Link></div>
                </td>
              </tr>
            ) : sortedProjects.map(p => (
              <tr key={p.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors group">
                <td className="px-5 py-4">
                  <Link to={`/admin/projects`} className="block">
                    <p className="text-sm font-bold text-text-primary group-hover:text-brand-indigo transition-colors">{p.name}</p>
                    {p.riskReason && <p className="text-[10px] text-text-muted mt-0.5 line-clamp-1" title={p.suggestedAction}>{p.riskReason}</p>}
                  </Link>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-surface-hover rounded-full overflow-hidden max-w-[100px]">
                      <div className="h-full bg-brand-indigo rounded-full" style={{ width: `${p.progress}%` }} />
                    </div>
                    <span className="text-xs font-bold text-text-primary">{p.progress}%</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-center">
                  <span className="text-sm font-medium text-text-secondary">{p.membersCount}</span>
                </td>
                <td className="px-5 py-4 text-center">
                  <span className="text-sm font-medium text-text-secondary">{p.openTasks}</span>
                </td>
                <td className="px-5 py-4 text-center">
                  <span className="text-sm font-bold text-emerald-500">{p.completedTasks}</span>
                </td>
                <td className="px-5 py-4 text-center">
                  {p.overdueTasks > 0 ? (
                    <span className="text-sm font-bold text-red-500">{p.overdueTasks}</span>
                  ) : (
                    <span className="text-sm font-medium text-text-muted">0</span>
                  )}
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex justify-end">{getRiskBadge(p.risk)}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
