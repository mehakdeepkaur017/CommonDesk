import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Plus, FolderKanban, Users, Download, Archive, Trash2, Edit2,
  Eye, EyeOff, Calendar, CheckCircle2, Clock, AlertCircle, MoreHorizontal,
  ArrowUpDown, X, ChevronDown, RotateCcw, Zap, TrendingUp
} from 'lucide-react';
import { exportToCSV } from '../../../utils/exportUtils';
import { useProjects, useUpdateProject, useDeleteProject } from '../../../hooks/queries/useProjects';
import { Button } from '../../../components/ui/Button';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { useToast } from '../../../components/feedback/ToastContext';
import { CreateProjectWizard } from '../../../components/projects/CreateProjectWizard';

// ─── Status Config ───────────────────────────────────────
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




// ─── Project Row with Actions ────────────────────────────
const ProjectRow = ({ project }: { project: any }) => {
  const [showActions, setShowActions] = useState<boolean | string>(false);
  const [editProject, setEditProject] = useState<any>(null);
  const [confirmConfig, setConfirmConfig] = useState<{ isOpen: boolean; action: string; title: string; description: string; type: 'danger' | 'warning'; }>({ isOpen: false, action: '', title: '', description: '', type: 'danger' });

  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const { toast } = useToast();

  const status = STATUS_MAP[project?.status] || STATUS_MAP.active;
  const priority = PRIORITY_MAP[project?.priority] || PRIORITY_MAP.medium;
  const memberCount = project?._count?.members || 0;
  const taskCount = project?._count?.tasks || 0;
  const ownerName = project?.owner?.name || project?.owner?.email || 'Unknown';

  const handleAction = (action: string) => {
    setShowActions(false);
    if (action === 'edit') {
      setEditProject(project);
    } else if (action === 'archive') {
      setConfirmConfig({
        isOpen: true, action: 'archive',
        title: 'Archive Project',
        description: `Are you sure you want to archive "${project.name}"? It will be hidden from active views but can be restored later.`,
        type: 'warning'
      });
    } else if (action === 'restore') {
      handleExecute('restore');
    } else if (action === 'delete') {
      setConfirmConfig({
        isOpen: true, action: 'delete',
        title: 'Delete Project',
        description: `Are you sure you want to permanently delete "${project.name}"? This action cannot be undone. All tasks, files, and activity history will be lost.`,
        type: 'danger'
      });
    } else if (action === 'complete') {
      handleStatusChange('completed');
    } else if (action === 'status') {
      const nextStatus = project.status === 'active' ? 'on_hold' : 'active';
      handleStatusChange(nextStatus);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateProject.mutateAsync({ id: project.id, data: { status: newStatus } });
      toast({ title: 'Status Updated', description: `Project status changed to ${newStatus.replace('_', ' ')}.`, type: 'success' });
    } catch (err: any) {
      toast({ title: 'Update Failed', description: err?.response?.data?.message || 'Could not update status.', type: 'error' });
    }
  };

  const handleExecute = async (action: string) => {
    try {
      if (action === 'archive') {
        await updateProject.mutateAsync({ id: project.id, data: { status: 'archived' } });
        toast({ title: 'Project Archived', description: `"${project.name}" has been archived.`, type: 'success' });
      } else if (action === 'restore') {
        await updateProject.mutateAsync({ id: project.id, data: { status: 'active', archived: false } });
        toast({ title: 'Project Restored', description: `"${project.name}" is now active again.`, type: 'success' });
      } else if (action === 'delete') {
        await deleteProject.mutateAsync(project.id);
        toast({ title: 'Project Deleted', description: `"${project.name}" has been permanently deleted.`, type: 'success' });
      }
    } catch (err: any) {
      toast({ title: 'Action Failed', description: err?.response?.data?.message || 'Something went wrong.', type: 'error' });
    } finally {
      setConfirmConfig(prev => ({ ...prev, isOpen: false }));
    }
  };

  return (
    <>
      <motion.tr 
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="hover:bg-black/[0.015] dark:hover:bg-white/[0.015] transition-colors group"
      >
        {/* Project Name */}
        <td className="px-6 py-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-indigo/20 to-brand-violet/20 border border-brand-indigo/10 flex items-center justify-center shrink-0">
              <FolderKanban className="w-5 h-5 text-brand-indigo" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-text-primary truncate max-w-[220px]">{project?.name || 'Untitled'}</p>
              <p className="text-xs text-text-muted truncate max-w-[220px]">{project?.description || 'No description'}</p>
            </div>
          </div>
        </td>

        {/* Status */}
        <td className="px-5 py-4">
          <div className="relative inline-block">
            <button
              type="button"
              onClick={() => setShowActions(showActions === 'status' ? false : 'status')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors hover:opacity-80 ${status.bg} ${status.color}`}
            >
              {status.icon} {status.label} <ChevronDown className="w-3 h-3 opacity-70" />
            </button>
            <AnimatePresence>
              {showActions === 'status' && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowActions(false)} />
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
                        onClick={() => {
                          handleStatusChange(s);
                          setShowActions(false);
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
        </td>

        {/* Priority */}
        <td className="px-5 py-4">
          <span className={`text-xs font-bold uppercase tracking-wide ${priority.color}`}>
            {priority.label}
          </span>
        </td>

        {/* Visibility */}
        <td className="px-5 py-4">
          <div className="flex items-center gap-1.5 text-text-secondary text-xs">
            {project?.visibility === 'workspace' ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span className="capitalize">{project?.visibility || 'private'}</span>
          </div>
        </td>

        {/* Owner */}
        <td className="px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-brand-indigo/15 flex items-center justify-center text-brand-indigo text-[10px] font-bold shrink-0">
              {(ownerName).charAt(0).toUpperCase()}
            </div>
            <span className="text-xs text-text-secondary truncate max-w-[100px]">{ownerName}</span>
          </div>
        </td>

        {/* Stats */}
        <td className="px-5 py-4">
          <div className="flex items-center gap-3 text-xs text-text-muted">
            <span className="flex items-center gap-1" title={`${memberCount} members`}>
              <Users className="w-3.5 h-3.5" /> {memberCount}
            </span>
            <span className="flex items-center gap-1" title={`${taskCount} tasks`}>
              <CheckCircle2 className="w-3.5 h-3.5" /> {taskCount}
            </span>
          </div>
        </td>

        {/* Actions */}
        <td className="px-5 py-4 text-right">
          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {project.status !== 'completed' && (
              <button 
                type="button"
                onClick={() => handleAction('complete')}
                className="p-2 rounded-lg text-text-muted hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                title="Mark Completed"
              >
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}

            <button 
              type="button"
              onClick={() => handleAction('edit')}
              className="p-2 rounded-lg text-text-muted hover:text-brand-indigo hover:bg-brand-indigo/10 transition-colors"
              title="Edit Project"
            >
              <Edit2 className="w-4 h-4" />
            </button>

            {project.status === 'archived' || project.archived ? (
              <button 
                type="button"
                onClick={() => handleAction('restore')}
                className="p-2 rounded-lg text-text-muted hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                title="Restore Project"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            ) : (
              <button 
                type="button"
                onClick={() => handleAction('archive')}
                className="p-2 rounded-lg text-text-muted hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
                title="Archive Project"
              >
                <Archive className="w-4 h-4" />
              </button>
            )}

            <button 
              type="button"
              onClick={() => handleAction('delete')}
              className="p-2 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title="Delete Permanently"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </motion.tr>

      {/* Confirm Dialog */}
      <ConfirmDialog 
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={() => handleExecute(confirmConfig.action)}
        title={confirmConfig.title}
        description={confirmConfig.description}
        type={confirmConfig.type}
        confirmText={confirmConfig.action === 'delete' ? 'Delete Forever' : 'Archive'}
        isLoading={updateProject.isPending || deleteProject.isPending}
      />

      {/* Edit Wizard */}
      <AnimatePresence>
        {editProject && <CreateProjectWizard editProject={editProject} onClose={() => setEditProject(null)} />}
      </AnimatePresence>
    </>
  );
};

// ─── Main Page ───────────────────────────────────────────
export const AdminProjectsList = () => {
  const { data, isLoading } = useProjects();
  const projects: any[] = data?.items || [];
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { toast } = useToast();

  const filteredProjects = projects.filter((p: any) => {
    const matchesSearch = !search || p.name?.toLowerCase()?.includes(search.toLowerCase()) || p.description?.toLowerCase()?.includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const activeCount = projects.filter(p => p.status === 'active').length;
  const onHoldCount = projects.filter(p => p.status === 'on_hold').length;
  const completedCount = projects.filter(p => p.status === 'completed').length;

  const handleExport = () => {
    if (filteredProjects.length === 0) {
      toast({ title: 'Export Failed', description: 'No projects to export.', type: 'warning' });
      return;
    }
    const exportData = filteredProjects.map((p: any) => ({
      ID: p.id,
      Name: p.name,
      Description: p.description || '',
      Status: p.status,
      Privacy: p.isPrivate ? 'Private' : 'Public',
      Owner: p.owner?.name || '',
      Archived: p.archived ? 'Yes' : 'No',
      CreatedAt: new Date(p.createdAt).toLocaleString()
    }));
    exportToCSV('projects_export', exportData);
    toast({ title: 'Export Successful', description: 'Your projects export has been downloaded.', type: 'success' });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-text-primary mb-1">Project Administration</h1>
          <p className="text-sm text-text-muted">Oversee all organizational projects, modify settings, and manage lifecycles.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button type="button" variant="outline" className="gap-2" onClick={handleExport}>
            <Download className="w-4 h-4" /> Export
          </Button>
          <Button type="button" className="gap-2" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4" /> New Project
          </Button>
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
                <th className="px-5 py-3.5 text-xs font-bold text-text-muted uppercase tracking-wider text-right">Actions</th>
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
                    <td className="px-5 py-4 text-right"><div className="h-8 w-8 bg-surface-hover rounded-lg animate-pulse inline-block" /></td>
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
                      {search || statusFilter !== 'all' ? 'No matching projects' : 'No projects yet'}
                    </h3>
                    <p className="text-sm text-text-muted mb-6 max-w-sm mx-auto">
                      {search || statusFilter !== 'all' 
                        ? 'Try adjusting your search or clearing filters.' 
                        : 'Create your first project to start organizing work across your workspace.'}
                    </p>
                    {!search && statusFilter === 'all' && (
                      <Button type="button" onClick={() => setIsCreateModalOpen(true)} className="gap-2">
                        <Plus className="w-4 h-4" /> Create First Project
                      </Button>
                    )}
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

      {/* Create Wizard */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <CreateProjectWizard onClose={() => setIsCreateModalOpen(false)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
};
