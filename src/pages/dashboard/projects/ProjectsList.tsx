import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, FolderKanban, Users, Eye, EyeOff, CheckCircle2, Clock, Zap, TrendingUp, ChevronRight, Archive, ChevronDown
} from 'lucide-react';
import { useProjects, useUpdateProject } from '../../../hooks/queries/useProjects';
import { useWorkspace } from '../../../hooks/queries/useWorkspace';
import { useToast } from '../../../components/feedback/ToastContext';
import { useNavigate } from 'react-router-dom';

const STATUS_MAP: Record<string, { label: string; color: string; icon: React.ReactNode; bg: string }> = {
  active:    { label: 'Active',    color: 'text-emerald-400', icon: <CheckCircle2 className="w-3.5 h-3.5" />, bg: 'bg-emerald-500/10 border-emerald-500/20' },
  on_hold:   { label: 'On Hold',   color: 'text-amber-400',   icon: <Clock className="w-3.5 h-3.5" />,       bg: 'bg-amber-500/10 border-amber-500/20' },
  completed: { label: 'Completed', color: 'text-brand-indigo', icon: <CheckCircle2 className="w-3.5 h-3.5" />, bg: 'bg-brand-indigo/10 border-brand-indigo/20' },
  archived:  { label: 'Archived',  color: 'text-text-muted',  icon: <Archive className="w-3.5 h-3.5" />,      bg: 'bg-surface-hover border-surface-border' },
};

const PRIORITY_MAP: Record<string, { label: string; color: string }> = {
  high:   { label: 'High',   color: 'text-red-400' },
  medium: { label: 'Medium', color: 'text-amber-400' },
  low:    { label: 'Low',    color: 'text-emerald-400' },
};

const ProjectRow = ({ project }: { project: any }) => {
  const navigate = useNavigate();
  const { data: workspace } = useWorkspace();
  const updateProject = useUpdateProject();
  const { toast } = useToast();
  
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const currentUser = workspace?.currentUser;
  const isAssigned = project?.members?.some((m: any) => m.userId === currentUser?.id || m.user?.id === currentUser?.id);

  const status = STATUS_MAP[project?.status] || STATUS_MAP.active;
  const priority = PRIORITY_MAP[project?.priority] || PRIORITY_MAP.medium;
  const memberCount = project?._count?.members || 0;
  const taskCount = project?._count?.tasks || 0;
  const ownerName = project?.owner?.name || project?.owner?.email || 'Unknown';

  return (
    <motion.tr 
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => navigate(`/dashboard/projects/${project.id}`)}
      className="hover:bg-black/[0.015] dark:hover:bg-white/[0.015] transition-colors group cursor-pointer"
    >
      <td className="px-6 py-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-indigo/20 to-brand-violet/20 border border-brand-indigo/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <FolderKanban className="w-5 h-5 text-brand-indigo" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-text-primary truncate max-w-[220px] group-hover:text-brand-indigo transition-colors">{project?.name || 'Untitled'}</p>
            <p className="text-xs text-text-muted truncate max-w-[220px]">{project?.description || 'No description'}</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
        {isAssigned ? (
          <div className="relative inline-block">
            <button
              type="button"
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors hover:opacity-80 ${status.bg} ${status.color}`}
            >
              {status.icon} {status.label} <ChevronDown className="w-3 h-3 opacity-70" />
            </button>
            <AnimatePresence>
              {showStatusDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowStatusDropdown(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 4, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.95 }}
                    transition={{ duration: 0.12 }}
                    className="absolute left-0 top-full mt-1 w-40 bg-surface border border-surface-border rounded-xl shadow-xl py-1.5 z-50 overflow-hidden"
                  >
                    {['active', 'on_hold', 'completed', 'archived'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={async () => {
                          try {
                            await updateProject.mutateAsync({ id: project.id, data: { status: s } });
                            toast({ title: 'Status Updated', type: 'success' });
                          } catch (e: any) {
                            toast({ title: 'Update Failed', description: e.message, type: 'error' });
                          }
                          setShowStatusDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-surface-hover transition-colors ${project.status === s ? 'text-brand-indigo bg-brand-indigo/5' : 'text-text-secondary hover:text-text-primary'}`}
                      >
                        {STATUS_MAP[s].label}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${status.bg} ${status.color}`}>
            {status.icon} {status.label}
          </div>
        )}
      </td>
      <td className="px-5 py-4">
        <span className={`text-xs font-bold uppercase tracking-wide ${priority.color}`}>
          {priority.label}
        </span>
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-1.5 text-text-secondary text-xs">
          {project?.visibility === 'workspace' ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          <span className="capitalize">{project?.visibility || 'private'}</span>
        </div>
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-brand-indigo/15 flex items-center justify-center text-brand-indigo text-[10px] font-bold shrink-0">
            {(ownerName).charAt(0).toUpperCase()}
          </div>
          <span className="text-xs text-text-secondary truncate max-w-[100px]">{ownerName}</span>
        </div>
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-3 text-xs text-text-muted">
          <span className="flex items-center gap-1" title={`${memberCount} members`}>
            <Users className="w-3.5 h-3.5" /> {memberCount}
          </span>
        </div>
      </td>
      <td className="px-5 py-4 text-right">
        <ChevronRight className="w-5 h-5 text-surface-border group-hover:text-brand-indigo inline-block transition-colors" />
      </td>
    </motion.tr>
  );
};

export const ProjectsList = () => {
  const { data, isLoading } = useProjects();
  const projects: any[] = data?.items || [];
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredProjects = projects.filter((p: any) => {
    const matchesSearch = !search || p.name?.toLowerCase()?.includes(search.toLowerCase()) || p.description?.toLowerCase()?.includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = projects.filter(p => p.status === 'active').length;
  const onHoldCount = projects.filter(p => p.status === 'on_hold').length;
  const completedCount = projects.filter(p => p.status === 'completed').length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-text-primary mb-1">Projects</h1>
          <p className="text-sm text-text-muted">View and access your assigned workspace projects.</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Projects', value: projects.length, icon: <FolderKanban className="w-4 h-4" />, color: 'text-brand-indigo', bg: 'bg-brand-indigo/10' },
          { label: 'Active', value: activeCount, icon: <Zap className="w-4 h-4" />, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'On Hold', value: onHoldCount, icon: <Clock className="w-4 h-4" />, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Completed', value: completedCount, icon: <TrendingUp className="w-4 h-4" />, color: 'text-brand-indigo', bg: 'bg-brand-indigo/10' },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface border border-surface-border rounded-xl p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center`}>{stat.icon}</div>
            <div>
              <p className="text-xl font-bold text-text-primary leading-none">{stat.value}</p>
              <p className="text-xs text-text-muted mt-0.5">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or description..."
            className="w-full h-10 bg-surface border border-surface-border rounded-xl pl-10 pr-4 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-indigo/30 focus:border-brand-indigo transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          {['all', 'active', 'on_hold', 'completed', 'archived'].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`h-10 px-4 rounded-xl text-sm font-medium transition-all border ${
                statusFilter === s 
                  ? 'bg-brand-indigo/10 text-brand-indigo border-brand-indigo/20' 
                  : 'bg-surface text-text-muted border-surface-border hover:text-text-primary hover:border-surface-border'
              }`}
            >
              {s === 'all' ? 'All' : s.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-surface border border-surface-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto min-h-[350px] pb-16">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-surface-border bg-black/[0.02] dark:bg-background">
                <th className="px-6 py-3.5 text-xs font-bold text-text-muted uppercase tracking-wider">Project</th>
                <th className="px-5 py-3.5 text-xs font-bold text-text-muted uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5 text-xs font-bold text-text-muted uppercase tracking-wider">Priority</th>
                <th className="px-5 py-3.5 text-xs font-bold text-text-muted uppercase tracking-wider">Visibility</th>
                <th className="px-5 py-3.5 text-xs font-bold text-text-muted uppercase tracking-wider">Owner</th>
                <th className="px-5 py-3.5 text-xs font-bold text-text-muted uppercase tracking-wider">Stats</th>
                <th className="px-5 py-3.5 text-xs font-bold text-text-muted uppercase tracking-wider text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/50">
              
              {/* Loading Skeleton */}
              {isLoading && (
                [1, 2, 3, 4].map(i => (
                  <tr key={i}>
                    <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-surface-hover rounded-xl animate-pulse" /><div className="space-y-2"><div className="h-4 w-36 bg-surface-hover rounded animate-pulse" /><div className="h-3 w-48 bg-surface-hover rounded animate-pulse" /></div></div></td>
                    <td className="px-5 py-4"><div className="h-6 w-20 bg-surface-hover rounded-full animate-pulse" /></td>
                    <td className="px-5 py-4"><div className="h-4 w-14 bg-surface-hover rounded animate-pulse" /></td>
                    <td className="px-5 py-4"><div className="h-4 w-16 bg-surface-hover rounded animate-pulse" /></td>
                    <td className="px-5 py-4"><div className="h-6 w-24 bg-surface-hover rounded animate-pulse" /></td>
                    <td className="px-5 py-4"><div className="h-4 w-16 bg-surface-hover rounded animate-pulse" /></td>
                    <td className="px-5 py-4 text-right"></td>
                  </tr>
                ))
              )}

              {/* Empty State */}
              {!isLoading && filteredProjects.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-indigo/10 to-brand-violet/10 border border-brand-indigo/10 mb-5">
                      <FolderKanban className="w-7 h-7 text-brand-indigo" />
                    </div>
                    <h3 className="text-base font-bold text-text-primary mb-2 font-heading">
                      {search || statusFilter !== 'all' ? 'No matching projects' : 'No projects found'}
                    </h3>
                    <p className="text-sm text-text-muted mb-6 max-w-sm mx-auto">
                      {search || statusFilter !== 'all' 
                        ? 'Try adjusting your search or clearing filters.' 
                        : 'There are no active projects assigned to you.'}
                    </p>
                  </td>
                </tr>
              )}

              {/* Project Rows */}
              <AnimatePresence>
                {!isLoading && filteredProjects.map((project: any) => (
                  <ProjectRow key={project.id} project={project} />
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Footer Stats */}
        {!isLoading && filteredProjects.length > 0 && (
          <div className="px-6 py-3 bg-black/[0.01] dark:bg-background border-t border-surface-border flex items-center justify-between">
            <p className="text-xs text-text-muted">
              Showing <span className="font-bold text-text-secondary">{filteredProjects.length}</span> of <span className="font-bold text-text-secondary">{projects.length}</span> projects
            </p>
          </div>
        )}
      </div>

    </motion.div>
  );
};
