import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Plus, CheckSquare, Clock, CheckCircle2, MoreHorizontal,
  Archive, Flag, Download, Edit2, Trash2, RotateCcw, Zap, FolderKanban, Users, ChevronDown, ChevronRight,
  Circle, PlayCircle, Eye, XCircle, Ban
} from 'lucide-react';
import { exportToCSV } from '../../../utils/exportUtils';
import { useTasks, useBulkTaskOperation, useDeleteTask, useUpdateTask } from '../../../hooks/queries/useTasks';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../components/feedback/ToastContext';
import { CreateTaskWizard } from '../../../components/tasks/CreateTaskWizard';
import { TaskSlideOut } from '../../../components/tasks/TaskSlideOut';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';

const PRIORITIES = ['low', 'medium', 'high', 'urgent'];
const STATUSES = ['todo', 'in_progress', 'review', 'completed', 'blocked', 'cancelled'];

// ─── Status Config ───────────────────────────────────────
const STATUS_MAP: Record<string, { label: string; color: string; icon: React.ReactNode; bg: string }> = {
  todo:        { label: 'Todo',        color: 'text-blue-600 dark:text-blue-400',         icon: <Circle className="w-3.5 h-3.5" />,       bg: 'bg-blue-500/10 border-blue-500/20' },
  in_progress: { label: 'In Progress', color: 'text-brand-indigo',                        icon: <PlayCircle className="w-3.5 h-3.5" />,   bg: 'bg-brand-indigo/10 border-brand-indigo/20' },
  review:      { label: 'Review',      color: 'text-purple-600 dark:text-purple-400',     icon: <Eye className="w-3.5 h-3.5" />,          bg: 'bg-purple-500/10 border-purple-500/20' },
  completed:   { label: 'Completed',   color: 'text-emerald-600 dark:text-emerald-400',   icon: <CheckCircle2 className="w-3.5 h-3.5" />, bg: 'bg-emerald-500/10 border-emerald-500/20' },
  blocked:     { label: 'Blocked',     color: 'text-red-600 dark:text-red-400',           icon: <XCircle className="w-3.5 h-3.5" />,      bg: 'bg-red-500/10 border-red-500/20' },
  cancelled:   { label: 'Cancelled',   color: 'text-text-secondary',                      icon: <Ban className="w-3.5 h-3.5" />,          bg: 'bg-surface-hover border-surface-border' },
};

const PRIORITY_MAP: Record<string, { label: string; color: string }> = {
  urgent: { label: 'Urgent', color: 'text-red-600 dark:text-red-400' },
  high:   { label: 'High',   color: 'text-orange-600 dark:text-orange-400' },
  medium: { label: 'Medium', color: 'text-blue-600 dark:text-blue-400' },
  low:    { label: 'Low',    color: 'text-emerald-600 dark:text-emerald-400' },
};

// ─── Task Row ────────────────────────────────────────────
const TaskRow = ({ task, isSelected, onToggleSelect, onViewTask }: { task: any, isSelected: boolean, onToggleSelect: (e?: React.MouseEvent) => void, onViewTask: (task: any) => void }) => {
  const [showActions, setShowActions] = useState<boolean | string>(false);
  const [editTask, setEditTask] = useState<any>(null);
  const [confirmConfig, setConfirmConfig] = useState<{ isOpen: boolean; action: string; title: string; description: string; type: 'danger' | 'warning'; }>({ isOpen: false, action: '', title: '', description: '', type: 'danger' });

  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const { toast } = useToast();

  const status = STATUS_MAP[task?.status] || STATUS_MAP.todo;
  const priority = PRIORITY_MAP[task?.priority] || PRIORITY_MAP.medium;
  const isArchived = task.archived;

  const handleAction = (e: React.MouseEvent, action: string) => {
    e.stopPropagation();
    setShowActions(false);
    if (action === 'edit') {
      setEditTask(task);
    } else if (action === 'archive') {
      setConfirmConfig({
        isOpen: true, action: 'archive',
        title: 'Archive Task',
        description: `Are you sure you want to archive "${task.title}"? It will be hidden from active views.`,
        type: 'warning'
      });
    } else if (action === 'restore') {
      handleExecute('restore');
    } else if (action === 'delete') {
      setConfirmConfig({
        isOpen: true, action: 'delete',
        title: 'Delete Task',
        description: `Are you sure you want to permanently delete "${task.title}"? This action cannot be undone.`,
        type: 'danger'
      });
    } else if (action === 'complete') {
      handleStatusChange('completed');
    } else if (action === 'status') {
      setShowActions(showActions === 'status' ? false : 'status');
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateTask.mutateAsync({ id: task.id, data: { status: newStatus } });
      toast({ title: 'Status Updated', description: `Task status changed to ${newStatus.replace('_', ' ')}.`, type: 'success' });
    } catch (err: any) {
      toast({ title: 'Update Failed', description: err?.response?.data?.message || 'Could not update status.', type: 'error' });
    }
    setShowActions(false);
  };

  const handleExecute = async (action: string) => {
    setConfirmConfig(prev => ({ ...prev, isOpen: false }));
    try {
      if (action === 'archive') {
        await updateTask.mutateAsync({ id: task.id, data: { archived: true } });
        toast({ title: 'Task Archived', description: `"${task.title}" has been archived.`, type: 'success' });
      } else if (action === 'restore') {
        await updateTask.mutateAsync({ id: task.id, data: { archived: false } });
        toast({ title: 'Task Restored', description: `"${task.title}" is now active again.`, type: 'success' });
      } else if (action === 'delete') {
        await deleteTask.mutateAsync(task.id);
        toast({ title: 'Task Deleted', description: `"${task.title}" has been permanently deleted.`, type: 'success' });
      }
    } catch (err: any) {
      toast({ title: 'Action Failed', description: err?.response?.data?.message || 'Something went wrong.', type: 'error' });
    }
  };

  return (
    <>
      <motion.tr 
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`hover:bg-black/[0.015] dark:hover:bg-white/[0.015] transition-colors group ${isSelected ? 'bg-brand-indigo/5 dark:bg-brand-indigo/5' : ''}`}
      >
        <td className="px-5 py-4 text-center" onClick={e => e.stopPropagation()}>
          <input type="checkbox" checked={isSelected} onChange={(e) => { e.stopPropagation(); onToggleSelect(); }} className="rounded border-surface-border bg-surface cursor-pointer" />
        </td>
        
        {/* Task Details */}
        <td className="px-5 py-4">
          <div className="flex items-start gap-3">
            <CheckSquare className={`w-5 h-5 mt-0.5 shrink-0 ${status.color}`} />
            <div>
              <p className="text-sm font-bold text-text-primary line-clamp-1 max-w-[250px]">{task.title}</p>
              {task.dueDate && (
                <div className="flex items-center gap-3 mt-1">
                  <span className={`flex items-center gap-1 text-[11px] ${new Date(task.dueDate) < new Date() && task.status !== 'completed' ? 'text-red-400' : 'text-text-muted'}`}>
                    <Clock className="w-3 h-3" /> {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </td>

        {/* Project Name */}
        <td className="px-5 py-4">
          <div className="flex items-center gap-2">
            <FolderKanban className="w-4 h-4 text-brand-indigo shrink-0" />
            <span className="text-sm text-text-primary truncate max-w-[150px]">{task.project?.name || 'No Project'}</span>
          </div>
        </td>

        {/* Assignees */}
        <td className="px-5 py-4">
          {task.assignees && task.assignees.length > 0 ? (
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {task.assignees.slice(0, 2).map((a: any) => (
                  a.avatarUrl ? (
                    <img key={a.id} src={a.avatarUrl} alt="" className="w-6 h-6 rounded-full object-cover border-2 border-background" />
                  ) : (
                    <div key={a.id} className="w-6 h-6 rounded-full bg-brand-indigo text-white flex items-center justify-center text-[9px] font-bold border-2 border-background">
                      {a.name?.substring(0, 2).toUpperCase()}
                    </div>
                  )
                ))}
                {task.assignees.length > 2 && (
                  <div className="w-6 h-6 rounded-full bg-surface-hover text-text-muted flex items-center justify-center text-[9px] font-bold border-2 border-background">
                    +{task.assignees.length - 2}
                  </div>
                )}
              </div>
              <span className="text-sm text-text-primary truncate max-w-[100px]">{task.assignees[0].name}{task.assignees.length > 1 ? ` +${task.assignees.length - 1}` : ''}</span>
            </div>
          ) : (
            <span className="text-sm text-text-muted italic flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Unassigned</span>
          )}
        </td>

        {/* Status Dropdown */}
        <td className="px-5 py-4">
          <div className="relative inline-block">
            <button
              type="button"
              onClick={(e) => handleAction(e, 'status')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors hover:opacity-80 shadow-sm ${status.bg} ${status.color}`}
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
                    {STATUSES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handleStatusChange(s)}
                        className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-surface-hover transition-colors ${task.status === s ? 'bg-surface-hover font-medium' : 'text-text-secondary'}`}
                      >
                        {STATUS_MAP[s]?.icon} {STATUS_MAP[s]?.label}
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
          <span className={`inline-flex items-center gap-1 text-[12px] font-bold uppercase tracking-wider ${priority.color}`}>
            <Flag className="w-3 h-3" />
            {priority.label}
          </span>
        </td>

        {/* Actions */}
        <td className="px-5 py-4 text-right">
          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={(e) => { e.stopPropagation(); onViewTask(task); }} className="p-2 rounded-lg text-text-muted hover:text-blue-400 hover:bg-blue-500/10 transition-colors" title="View Task Details">
              <Eye className="w-4 h-4" />
            </button>
            {task.status !== 'completed' && !isArchived && (
              <button onClick={(e) => handleAction(e, 'complete')} className="p-2 rounded-lg text-text-muted hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors" title="Mark Completed">
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
            
            <button onClick={(e) => handleAction(e, 'edit')} className="p-2 rounded-lg text-text-muted hover:text-brand-indigo hover:bg-brand-indigo/10 transition-colors" title="Edit Task">
              <Edit2 className="w-4 h-4" />
            </button>

            {isArchived ? (
              <button onClick={(e) => handleAction(e, 'restore')} className="p-2 rounded-lg text-text-muted hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors" title="Restore Task">
                <RotateCcw className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={(e) => handleAction(e, 'archive')} className="p-2 rounded-lg text-text-muted hover:text-amber-400 hover:bg-amber-500/10 transition-colors" title="Archive Task">
                <Archive className="w-4 h-4" />
              </button>
            )}

            <button onClick={(e) => handleAction(e, 'delete')} className="p-2 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Delete Permanently">
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
        confirmText={confirmConfig.action === 'delete' ? 'Delete Forever' : confirmConfig.action === 'restore' ? 'Restore' : 'Archive'}
        isLoading={updateTask.isPending || deleteTask.isPending}
      />

      {/* Edit Wizard */}
      <AnimatePresence>
        {editTask && <CreateTaskWizard initialTask={editTask} onClose={() => setEditTask(null)} />}
      </AnimatePresence>
    </>
  );
};

// ─── Main Page ───────────────────────────────────────────
export const AdminTasksList = () => {
  const [viewTask, setViewTask] = useState<any>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [tabFilter, setTabFilter] = useState<'all' | 'active' | 'completed' | 'archived'>('all');
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  
  // Fetch all tasks regardless of archive status so global stats are always accurate
  const queryFilters: any = { limit: 1000, archived: 'all' };

  const { data, isLoading } = useTasks(queryFilters);
  const rawTasks = data?.items || [];

  const filteredTasks = rawTasks.filter((t: any) => {
    const matchesSearch = !search || t.title?.toLowerCase()?.includes(search.toLowerCase());
    const matchesPriority = !priorityFilter || t.priority === priorityFilter;
    let matchesTab = true;
    
    if (tabFilter === 'active') {
      matchesTab = ['todo', 'in_progress', 'review'].includes(t.status) && !t.archived;
    } else if (tabFilter === 'completed') {
      matchesTab = t.status === 'completed' && !t.archived;
    } else if (tabFilter === 'archived') {
      matchesTab = t.archived === true;
    } else {
      // 'all' tab
      matchesTab = !t.archived;
    }

    return matchesSearch && matchesPriority && matchesTab;
  });

  const groupedTasks = useMemo(() => {
    const map = new Map<string, { project: any; tasks: any[] }>();
    filteredTasks.forEach((t: any) => {
      const pid = t.projectId || 'unassigned';
      if (!map.has(pid)) {
        map.set(pid, { project: t.project, tasks: [] });
      }
      map.get(pid)!.tasks.push(t);
    });
    return map;
  }, [filteredTasks]);

  React.useEffect(() => {
    // If selected project is no longer in the filtered list, clear selection
    if (selectedProject && !groupedTasks.has(selectedProject)) {
      setSelectedProject(null);
    }
  }, [groupedTasks, selectedProject]);

  const toggleProjectTasks = (tasks: any[]) => {
    const allSelected = tasks.every(t => selectedTasks.has(t.id));
    const next = new Set(selectedTasks);
    tasks.forEach(t => {
      if (allSelected) next.delete(t.id);
      else next.add(t.id);
    });
    setSelectedTasks(next);
  };

  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
  const [bulkConfirmConfig, setBulkConfirmConfig] = useState<{ isOpen: boolean; action: string; value?: string; title: string; description: string; type: 'danger' | 'warning' }>({ isOpen: false, action: '', title: '', description: '', type: 'danger' });
  const { mutateAsync: bulkOperation, isPending: isBulkPending } = useBulkTaskOperation();
  const { toast } = useToast();
  
  // Stats
  const stats = useMemo(() => {
    const unarchived = rawTasks.filter((t: any) => !t.archived);
    const active = unarchived.filter((t: any) => ['todo', 'in_progress', 'review'].includes(t.status)).length;
    const completed = unarchived.filter((t: any) => t.status === 'completed').length;
    const overdue = unarchived.filter((t: any) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed').length;
    return { total: unarchived.length, active, completed, overdue };
  }, [rawTasks]);

  const toggleAll = () => {
    if (selectedTasks.size === filteredTasks.length && filteredTasks.length > 0) {
      setSelectedTasks(new Set());
    } else {
      setSelectedTasks(new Set(filteredTasks.map((t: any) => t.id)));
    }
  };

  const toggleTaskSelection = (id: string) => {
    const next = new Set(selectedTasks);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedTasks(next);
  };

  const handleBulkActionClick = (action: string, value?: string) => {
    if (selectedTasks.size === 0) return;
    
    if (action === 'delete') {
      setBulkConfirmConfig({
        isOpen: true, action, value,
        title: 'Delete Tasks',
        description: `Are you sure you want to permanently delete ${selectedTasks.size} tasks? This action cannot be undone.`,
        type: 'danger'
      });
    } else if (action === 'archive') {
      setBulkConfirmConfig({
        isOpen: true, action, value,
        title: 'Archive Tasks',
        description: `Are you sure you want to archive ${selectedTasks.size} tasks? They will be hidden from active views.`,
        type: 'warning'
      });
    } else if (action === 'restore') {
      setBulkConfirmConfig({
        isOpen: true, action, value,
        title: 'Restore Tasks',
        description: `Are you sure you want to restore ${selectedTasks.size} tasks to active views?`,
        type: 'warning'
      });
    } else {
      executeBulkAction(action, value);
    }
  };

  const executeBulkAction = async (action: string, value?: string) => {
    setBulkConfirmConfig(prev => ({ ...prev, isOpen: false }));
    setSelectedTasks(new Set());
    try {
      await bulkOperation({ taskIds: Array.from(selectedTasks), action, value });
      toast({ title: 'Success', description: `Bulk action successful.`, type: 'success' });
    } catch (e: any) {
      toast({ title: 'Error', description: e?.response?.data?.message || 'Failed to perform bulk action.', type: 'error' });
    }
  };

  const handleExport = () => {
    if (filteredTasks.length === 0) {
      toast({ title: 'Export Failed', description: 'No tasks to export.', type: 'warning' });
      return;
    }
    const exportData = filteredTasks.map((t: any) => ({
      ID: t.id,
      Title: t.title,
      Description: t.description || '',
      Status: t.status,
      Priority: t.priority,
      Project: t.project?.name || 'Unassigned',
      Archived: t.archived ? 'Yes' : 'No',
      CreatedAt: new Date(t.createdAt).toLocaleString(),
      DueDate: t.dueDate ? new Date(t.dueDate).toLocaleString() : ''
    }));
    exportToCSV('tasks_export', exportData);
    toast({ title: 'Export Successful', description: 'Your tasks export has been downloaded.', type: 'success' });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-text-primary mb-1">Task Administration</h1>
          <p className="text-sm text-text-muted">Global overview and management of all organizational tasks.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2" onClick={handleExport}>
            <Download className="w-4 h-4" /> Export
          </Button>
          <Button className="gap-2" onClick={() => setIsWizardOpen(true)}>
            <Plus className="w-4 h-4" /> New Task
          </Button>
        </div>
      </div>

      {isWizardOpen && <CreateTaskWizard onClose={() => setIsWizardOpen(false)} />}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Tasks', value: stats.total, icon: <FolderKanban className="w-4 h-4" />, color: 'text-brand-indigo', bg: 'bg-brand-indigo/10' },
          { label: 'Active Tasks', value: stats.active, icon: <Zap className="w-4 h-4" />, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Completed', value: stats.completed, icon: <CheckCircle2 className="w-4 h-4" />, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Overdue', value: stats.overdue, icon: <Clock className="w-4 h-4" />, color: 'text-red-400', bg: 'bg-red-500/10' },
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

      {/* Toolbar & Tabs */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="w-full h-10 bg-surface border border-surface-border rounded-xl pl-10 pr-4 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-indigo/30 focus:border-brand-indigo transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          {['all', 'active', 'completed', 'archived'].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setTabFilter(s as any)}
              className={`h-10 px-4 rounded-xl text-sm font-medium transition-all border ${
                tabFilter === s 
                  ? 'bg-brand-indigo/10 text-brand-indigo border-brand-indigo/20' 
                  : 'bg-surface text-text-muted border-surface-border hover:text-text-primary hover:border-surface-border'
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
          <select 
            value={priorityFilter} 
            onChange={e => setPriorityFilter(e.target.value)}
            className="h-10 px-3 bg-surface border border-surface-border rounded-xl text-sm text-text-primary focus:outline-none ml-2"
          >
            <option value="">All Priorities</option>
            {PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
          </select>
        </div>
      </div>

      {/* Project Cards Grid */}
      <div className="pb-4">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1,2,3].map(i => <div key={i} className="h-28 bg-surface-hover rounded-2xl animate-pulse" />)}
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="bg-surface border border-surface-border rounded-2xl p-16 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-indigo/10 to-brand-violet/10 border border-brand-indigo/10 mb-5">
              <CheckSquare className="w-7 h-7 text-brand-indigo" />
            </div>
            <h3 className="text-base font-bold text-text-primary mb-2 font-heading">
              {search || tabFilter !== 'all' ? 'No matching tasks' : 'No tasks yet'}
            </h3>
            <p className="text-sm text-text-muted mb-6 max-w-sm mx-auto">
              {search || tabFilter !== 'all' 
                ? 'Try adjusting your search or clearing filters.' 
                : 'Create your first task to start assigning work.'}
            </p>
            {!search && tabFilter === 'all' && (
              <Button type="button" onClick={() => setIsWizardOpen(true)} className="gap-2">
                <Plus className="w-4 h-4" /> Create First Task
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from(groupedTasks.entries()).map(([projectId, group]: any) => (
              <button
                key={projectId}
                onClick={() => setSelectedProject(selectedProject === projectId ? null : projectId)}
                className={`text-left border p-5 rounded-2xl flex flex-col justify-between transition-all ${
                  selectedProject === projectId ? 'border-brand-indigo bg-brand-indigo/5 ring-1 ring-brand-indigo' : 'border-surface-border bg-surface hover:bg-surface-hover'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedProject === projectId ? 'bg-brand-indigo text-white' : 'bg-brand-indigo/10 text-brand-indigo'}`}>
                    <FolderKanban className="w-5 h-5" />
                  </div>
                  {selectedProject === projectId && <ChevronRight className="w-5 h-5 text-brand-indigo" />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-primary line-clamp-1">{group.project?.name || 'Unassigned Project'}</h3>
                  <p className="text-sm text-text-muted mt-1 font-medium">{group.tasks.length} {group.tasks.length === 1 ? 'task' : 'tasks'}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected Project Tasks Table */}
      <div className="pb-16">
        <AnimatePresence mode="wait">
          {selectedProject && groupedTasks.has(selectedProject) ? (
            <motion.div
              key="table"
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
              className="bg-surface border border-surface-border rounded-2xl overflow-hidden shadow-sm"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border/50 bg-black/[0.015] dark:bg-white/[0.015]">
                <h3 className="font-bold text-text-primary flex items-center gap-2">
                  <FolderKanban className="w-4 h-4 text-brand-indigo" />
                  {groupedTasks.get(selectedProject)!.project?.name || 'Unassigned Project'}
                </h3>
                <label className="flex items-center gap-2 text-sm text-text-muted cursor-pointer hover:text-text-primary">
                  <input 
                    type="checkbox" 
                    className="rounded border-surface-border bg-surface cursor-pointer"
                    checked={groupedTasks.get(selectedProject)!.tasks.length > 0 && groupedTasks.get(selectedProject)!.tasks.every((t: any) => selectedTasks.has(t.id))}
                    onChange={() => toggleProjectTasks(groupedTasks.get(selectedProject)!.tasks)}
                  />
                  Select All
                </label>
              </div>
              <div className="overflow-x-auto min-h-[350px] pb-16">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead>
                    <tr className="border-b border-surface-border bg-black/[0.02] dark:bg-background">
                      <th className="px-5 py-3.5 w-12 text-center"></th>
                      <th className="px-5 py-3.5 text-xs font-bold text-text-muted uppercase tracking-wider w-[35%]">Task</th>
                      <th className="px-5 py-3.5 text-xs font-bold text-text-muted uppercase tracking-wider">Project</th>
                      <th className="px-5 py-3.5 text-xs font-bold text-text-muted uppercase tracking-wider">Assignee</th>
                      <th className="px-5 py-3.5 text-xs font-bold text-text-muted uppercase tracking-wider">Status</th>
                      <th className="px-5 py-3.5 text-xs font-bold text-text-muted uppercase tracking-wider">Priority</th>
                      <th className="px-5 py-3.5 text-xs font-bold text-text-muted uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border/50">
                    {groupedTasks.get(selectedProject)!.tasks.map((task: any) => (
                      <TaskRow 
                        key={task.id} 
                        task={task} 
                        isSelected={selectedTasks.has(task.id)} 
                        onToggleSelect={() => toggleTaskSelection(task.id)}
                        onViewTask={setViewTask}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          ) : (
            filteredTasks.length > 0 && !isLoading && (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center p-16 text-center border-2 border-dashed border-surface-border rounded-2xl bg-surface/30"
              >
                <div className="w-16 h-16 bg-brand-indigo/10 text-brand-indigo rounded-full flex items-center justify-center mb-4">
                  <FolderKanban className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">Select a Project</h3>
                <p className="text-sm text-text-muted max-w-md">
                  Choose one of the project cards above to view and manage its associated tasks.
                </p>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>

      {/* Floating Bulk Operations Bar */}
      <AnimatePresence>
        {selectedTasks.size > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-brand-indigo/95 backdrop-blur-md shadow-2xl rounded-2xl px-6 py-3 flex items-center gap-6 z-50 text-white"
          >
            <span className="text-sm font-medium px-3">{selectedTasks.size} tasks selected</span>
            <div className="flex items-center gap-2">
              {tabFilter === 'archived' ? (
                <>
                  <Button size="sm" variant="ghost" className="text-emerald-400 hover:text-emerald-300" onClick={() => handleBulkActionClick('restore')}>Restore</Button>
                  <Button size="sm" variant="ghost" className="text-red-300 hover:text-red-200 hover:bg-red-500/20" onClick={() => handleBulkActionClick('delete')}>Delete</Button>
                </>
              ) : (
                <>
                  <Button size="sm" variant="ghost" className="text-white hover:bg-white/20" onClick={() => handleBulkActionClick('status', 'completed')}>Mark Completed</Button>
                  <Button size="sm" variant="ghost" className="text-white hover:bg-white/20" onClick={() => handleBulkActionClick('archive')}>Archive</Button>
                  <Button size="sm" variant="ghost" className="text-red-300 hover:text-red-200 hover:bg-red-500/20" onClick={() => handleBulkActionClick('delete')}>Delete</Button>
                </>
              )}
              <div className="w-px h-6 bg-white/20 mx-2" />
              <button onClick={() => setSelectedTasks(new Set())} className="text-sm font-bold opacity-70 hover:opacity-100">Cancel</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDialog 
        isOpen={bulkConfirmConfig.isOpen}
        onClose={() => setBulkConfirmConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={() => executeBulkAction(bulkConfirmConfig.action, bulkConfirmConfig.value)}
        title={bulkConfirmConfig.title}
        description={bulkConfirmConfig.description}
        type={bulkConfirmConfig.type}
        confirmText={bulkConfirmConfig.action === 'delete' ? 'Delete Forever' : bulkConfirmConfig.action === 'restore' ? 'Restore' : 'Archive'}
        isLoading={isBulkPending}
      />

      {/* Slide Out Details */}
      <AnimatePresence>
        {viewTask && (
          <TaskSlideOut task={viewTask} onClose={() => setViewTask(null)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
};
