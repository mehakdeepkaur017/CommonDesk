import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, CheckSquare, Clock, CheckCircle2,
  Flag, FolderKanban, Users, ChevronDown, ChevronRight,
  Circle, PlayCircle, Eye, XCircle, Ban
} from 'lucide-react';
import { useTasks, useUpdateTask } from '../../../hooks/queries/useTasks';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../components/feedback/ToastContext';
import { TaskSlideOut } from '../../../components/tasks/TaskSlideOut';

const PRIORITIES = ['low', 'medium', 'high', 'urgent'];
const STATUSES = ['todo', 'in_progress', 'review', 'completed', 'blocked', 'cancelled'];

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

const TaskRow = ({ task, onViewTask, currentUserId }: { task: any, onViewTask: (task: any) => void, currentUserId: string }) => {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const updateTask = useUpdateTask();
  const { toast } = useToast();

  const status = STATUS_MAP[task?.status] || STATUS_MAP.todo;
  const priority = PRIORITY_MAP[task?.priority] || PRIORITY_MAP.medium;

  const isAssigned = task?.assignees?.some((a: any) => a.id === currentUserId);

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateTask.mutateAsync({ id: task.id, data: { status: newStatus } });
      toast({ title: 'Status Updated', type: 'success' });
    } catch (err: any) {
      toast({ title: 'Update Failed', description: err?.response?.data?.message, type: 'error' });
    }
    setShowStatusDropdown(false);
  };

  return (
    <motion.tr 
      layout
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="hover:bg-black/[0.015] dark:hover:bg-white/[0.015] transition-colors group"
    >
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

      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <FolderKanban className="w-4 h-4 text-brand-indigo shrink-0" />
          <span className="text-sm text-text-primary truncate max-w-[150px]">{task.project?.name || 'No Project'}</span>
        </div>
      </td>

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
            </div>
            <span className="text-sm text-text-primary truncate max-w-[100px]">{task.assignees[0].name}{task.assignees.length > 1 ? ` +${task.assignees.length - 1}` : ''}</span>
          </div>
        ) : (
          <span className="text-sm text-text-muted italic flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Unassigned</span>
        )}
      </td>

      <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
        {isAssigned ? (
          <div className="relative inline-block">
            <button
              type="button"
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors hover:opacity-80 shadow-sm ${status.bg} ${status.color}`}
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
        ) : (
          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border shadow-sm ${status.bg} ${status.color}`}>
            {status.icon} {status.label}
          </div>
        )}
      </td>

      <td className="px-5 py-4">
        <span className={`inline-flex items-center gap-1 text-[12px] font-bold uppercase tracking-wider ${priority.color}`}>
          <Flag className="w-3 h-3" />
          {priority.label}
        </span>
      </td>
      <td className="px-5 py-4 text-right">
        <div className="flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={(e) => { e.stopPropagation(); onViewTask(task); }} 
            className="p-2 rounded-lg text-text-muted hover:text-blue-400 hover:bg-blue-500/10 transition-colors" 
            title="View Task Details"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </td>
    </motion.tr>
  );
};

export const MyTasks = () => {
  const { user } = useAuth();
  const [viewTask, setViewTask] = useState<any>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [tabFilter, setTabFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  
  // Fetch all tasks in the workspace that the user has access to
  const { data, isLoading } = useTasks({ limit: 1000 });
  const rawTasks = data?.items || [];

  const filteredTasks = rawTasks.filter((t: any) => {
    const matchesSearch = !search || t.title?.toLowerCase()?.includes(search.toLowerCase());
    const matchesPriority = !priorityFilter || t.priority === priorityFilter;
    let matchesTab = true;
    
    if (tabFilter === 'active') {
      matchesTab = ['todo', 'in_progress', 'review'].includes(t.status);
    } else if (tabFilter === 'completed') {
      matchesTab = t.status === 'completed';
    }

    return matchesSearch && matchesPriority && matchesTab && !t.archived;
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

  const stats = useMemo(() => {
    const unarchived = rawTasks.filter((t: any) => !t.archived);
    const active = unarchived.filter((t: any) => ['todo', 'in_progress', 'review'].includes(t.status)).length;
    const completed = unarchived.filter((t: any) => t.status === 'completed').length;
    const overdue = unarchived.filter((t: any) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed').length;
    return { total: unarchived.length, active, completed, overdue };
  }, [rawTasks]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-10 max-w-7xl mx-auto">
      
      <div className="mb-2 mt-4">
        <h1 className="text-2xl font-bold font-heading text-text-primary mb-1">Tasks Overview</h1>
        <p className="text-sm text-text-muted">View and track tasks across all projects.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Tasks', value: stats.total, icon: <FolderKanban className="w-4 h-4" />, color: 'text-brand-indigo', bg: 'bg-brand-indigo/10' },
          { label: 'Active Tasks', value: stats.active, icon: <CheckSquare className="w-4 h-4" />, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Completed', value: stats.completed, icon: <CheckCircle2 className="w-4 h-4" />, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Overdue', value: stats.overdue, icon: <Clock className="w-4 h-4" />, color: 'text-red-400', bg: 'bg-red-500/10' },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface border border-surface-border rounded-xl p-4 flex items-center gap-3 shadow-sm">
            <div className={`w-9 h-9 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center`}>{stat.icon}</div>
            <div>
              <p className="text-xl font-bold text-text-primary leading-none">{stat.value}</p>
              <p className="text-xs text-text-muted mt-0.5">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

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
          {['all', 'active', 'completed'].map((s) => (
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

      <div className="pb-4">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1,2,3].map(i => <div key={i} className="h-28 bg-surface-hover rounded-2xl animate-pulse" />)}
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="bg-surface border border-surface-border rounded-2xl p-16 text-center shadow-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-indigo/10 to-brand-violet/10 border border-brand-indigo/10 mb-5">
              <CheckSquare className="w-7 h-7 text-brand-indigo" />
            </div>
            <h3 className="text-base font-bold text-text-primary mb-2 font-heading">
              {search || tabFilter !== 'all' ? 'No matching tasks' : 'No tasks available'}
            </h3>
            <p className="text-sm text-text-muted max-w-sm mx-auto">
              {search || tabFilter !== 'all' ? 'Try adjusting your search or clearing filters.' : 'There are no active tasks to display.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from(groupedTasks.entries()).map(([projectId, group]: any) => (
              <button
                key={projectId}
                onClick={() => setSelectedProject(selectedProject === projectId ? null : projectId)}
                className={`text-left border p-5 rounded-2xl flex flex-col justify-between transition-all shadow-sm ${
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

      <div className="pb-16">
        <AnimatePresence mode="wait">
          {selectedProject && groupedTasks.has(selectedProject) && (
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
              </div>
              <div className="overflow-x-auto scrollbar-none min-h-[350px] pb-16">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="border-b border-surface-border bg-black/[0.02] dark:bg-background">
                      <th className="px-5 py-3.5 text-xs font-bold text-text-muted uppercase tracking-wider w-[40%]">Task</th>
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
                        currentUserId={user?.id || ''}
                        onViewTask={setViewTask}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {viewTask && (
          <TaskSlideOut task={viewTask} onClose={() => setViewTask(null)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
};
