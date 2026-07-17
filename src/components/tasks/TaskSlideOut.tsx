import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, AlignLeft, MessageSquare, Tag, CheckSquare, RefreshCcw, Plus, Trash2, Check, Users } from "lucide-react";
import { Button } from "../ui/Button";
import type { Task } from "../../types";
import { 
  useUpdateTask, 
  useTask,
  useAddChecklistItem, 
  useUpdateChecklistItem, 
  useRemoveChecklistItem 
} from "../../hooks/queries/useTasks";
import { useProject } from "../../hooks/queries/useProjects";
import { useFiles, useDeleteFile, useUpdateFile } from "../../hooks/queries/useFiles";
import { useAuth } from "../../context/AuthContext";
import { FileUploadDrawer } from "../files/FileUploadDrawer";
import { FilePreviewDrawer } from "../files/FilePreviewDrawer";
import { formatBytes } from "../../utils/format";
import { forceDownload } from "../../utils/download";
import { File as FileIcon, Image as ImageIcon, Video, Music, ExternalLink, Eye, Archive, RefreshCw, Paperclip } from "lucide-react";

interface Props {
  task: Task;
  onClose: () => void;
}

export const TaskSlideOut = ({ task: initialTask, onClose }: Props) => {
  const { data: latestTask } = useTask(initialTask.id);
  const task = latestTask || initialTask;

  const updateTask = useUpdateTask();
  const { data: project } = useProject(task.projectId);
  const { user } = useAuth();
  
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [status, setStatus] = useState(task.status);
  const [isHoveringTitle, setIsHoveringTitle] = useState(false);
  const [newChecklistTitle, setNewChecklistTitle] = useState("");
  const [isAssigneeDropdownOpen, setIsAssigneeDropdownOpen] = useState(false);
  const assigneeDropdownRef = useRef<HTMLDivElement>(null);

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<any>(null);

  const { data: filesData } = useFiles({ taskId: task.id });
  const files = filesData?.items || [];
  const deleteMutation = useDeleteFile();
  const updateMutation = useUpdateFile();

  const addChecklistItem = useAddChecklistItem();
  const updateChecklistItem = useUpdateChecklistItem();
  const removeChecklistItem = useRemoveChecklistItem();

  const currentAssigneeIds = (task.assignees || []).map((a: any) => a.id);
  const members = (project as any)?.members || [];

  // Close assignee dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (assigneeDropdownRef.current && !assigneeDropdownRef.current.contains(e.target as Node)) {
        setIsAssigneeDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Update local state when task prop changes from refetch
  React.useEffect(() => {
    setTitle(task.title);
    setDescription(task.description || "");
    setStatus(task.status);
  }, [task]);

  const handleTitleBlur = () => {
    if (title !== task.title && title.trim()) {
      updateTask.mutate({ id: task.id, data: { title: title.trim() } });
    }
  };

  const handleDescriptionBlur = () => {
    if (description !== task.description) {
      updateTask.mutate({ id: task.id, data: { description } });
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as Task["status"];
    setStatus(newStatus);
    updateTask.mutate({ id: task.id, data: { status: newStatus } });
  };

  const toggleAssignee = (userId: string) => {
    const newIds = currentAssigneeIds.includes(userId)
      ? currentAssigneeIds.filter((id: string) => id !== userId)
      : [...currentAssigneeIds, userId];
    updateTask.mutate({ id: task.id, data: { assigneeIds: newIds } });
  };

  const handleAddChecklist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistTitle.trim()) return;
    await addChecklistItem.mutateAsync({ taskId: task.id, title: newChecklistTitle.trim() });
    setNewChecklistTitle("");
  };

  const checklistItems = task.checklist || [];
  const completedItems = checklistItems.filter((i: any) => i.isCompleted).length;
  const progressPercentage = checklistItems.length === 0 ? 0 : Math.round((completedItems / checklistItems.length) * 100);

  const getFileIcon = (format: string) => {
    if (!format) return <FileIcon className="w-8 h-8 text-brand-indigo" />;
    if (format.startsWith("image/")) return <ImageIcon className="w-8 h-8 text-blue-500" />;
    if (format.startsWith("video/")) return <Video className="w-8 h-8 text-purple-500" />;
    if (format.startsWith("audio/")) return <Music className="w-8 h-8 text-amber-500" />;
    return <FileIcon className="w-8 h-8 text-brand-indigo" />;
  };

  const handleDownloadFile = (url: string, filename: string) => {
    forceDownload(url, filename);
  };

  const handleRestore = async (id: string) => {
    await updateMutation.mutateAsync({ id, data: { archived: false } });
  };

  const handleDelete = async (id: string, hard: boolean = false) => {
    if (confirm(`Are you sure you want to ${hard ? 'permanently delete' : 'archive'} this file?`)) {
      await deleteMutation.mutateAsync({ id, hard });
    }
  };

  return (
    <>
      <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-brand-navy/60 backdrop-blur-md z-50 transition-colors duration-300"
      />

      <motion.div
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0, transition: { duration: 0.2 } }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-background border-l border-surface-border shadow-2xl z-50 flex flex-col"
      >
        <div className="flex items-center justify-between px-8 py-5 border-b border-surface-border bg-surface/50">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-text-muted tracking-widest uppercase">TASK-{task.id.substring(0, 4)}</span>
            {task.priority && (
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest border ${
                task.priority === "urgent" ? "bg-red-500/10 text-red-500 border-red-500/20" :
                task.priority === "high" ? "bg-orange-500/10 text-orange-500 border-orange-500/20" :
                task.priority === "medium" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
              }`}>
                {task.priority}
              </span>
            )}
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors p-2 rounded-xl hover:bg-surface-hover">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-surface-border scrollbar-track-transparent p-8 space-y-10">
          
          <div 
            className="relative -mx-3"
            onMouseEnter={() => setIsHoveringTitle(true)}
            onMouseLeave={() => setIsHoveringTitle(false)}
          >
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleBlur}
              className={`w-full bg-transparent text-3xl font-bold font-heading text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-indigo/50 focus:bg-surface rounded-xl px-3 py-2 transition-all placeholder:text-surface-border tracking-tight ${
                isHoveringTitle ? "bg-surface-hover" : ""
              }`}
              placeholder="Task title..."
            />
          </div>

          <div className="grid grid-cols-2 gap-y-6 gap-x-8 text-sm">
            <div className="flex flex-col gap-2.5">
              <span className="text-text-muted flex items-center gap-2 font-medium"><Users className="w-4 h-4" /> Assignees</span>
              <div className="relative" ref={assigneeDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsAssigneeDropdownOpen(!isAssigneeDropdownOpen)}
                  className="w-fit text-text-primary font-medium bg-transparent hover:bg-surface-hover p-1.5 -ml-1.5 rounded-xl transition-all cursor-pointer text-left"
                >
                  {currentAssigneeIds.length === 0 ? (
                    <span className="text-text-muted">Unassigned</span>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {task.assignees?.map((a: any) => (
                        <span key={a.id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-brand-indigo/10 text-brand-indigo text-xs font-semibold">
                          {a.name}
                        </span>
                      ))}
                    </div>
                  )}
                </button>
                {isAssigneeDropdownOpen && (
                  <div className="absolute z-50 top-full left-0 mt-1 min-w-[240px] bg-background border border-surface-border rounded-xl shadow-xl max-h-52 overflow-y-auto py-1">
                    {members.length === 0 && (
                      <div className="px-4 py-3 text-sm text-text-muted">No project members</div>
                    )}
                    {members.map((m: any) => {
                      const isSelected = currentAssigneeIds.includes(m.userId);
                      return (
                        <button
                          key={m.userId}
                          type="button"
                          onClick={() => toggleAssignee(m.userId)}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-surface-hover transition-colors ${
                            isSelected ? 'bg-brand-indigo/5' : ''
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors flex-shrink-0 ${
                            isSelected ? 'bg-brand-indigo border-brand-indigo text-white' : 'border-surface-border'
                          }`}>
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                          </div>
                          <div className="w-7 h-7 rounded-full bg-brand-indigo/20 text-brand-indigo flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {m.user.name?.substring(0, 2).toUpperCase()}
                          </div>
                          <span className="font-medium text-text-primary truncate">{m.user.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <span className="text-text-muted flex items-center gap-2 font-medium"><RefreshCcw className="w-4 h-4" /> Status</span>
              <select
                value={status}
                onChange={handleStatusChange}
                className="w-fit text-text-primary font-medium bg-transparent hover:bg-surface-hover focus:bg-surface-hover p-1.5 -ml-1.5 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-brand-indigo/50 cursor-pointer appearance-none pr-8 relative"
                style={{ backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2371717a%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 0.5rem center", backgroundSize: "1em 1em" }}
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review</option>
                <option value="completed">Completed</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>

            <div className="flex flex-col gap-2.5">
              <span className="text-text-muted flex items-center gap-2 font-medium"><Calendar className="w-4 h-4" /> Due Date</span>
              <div className="text-text-primary font-medium cursor-pointer hover:bg-surface-hover p-1.5 -ml-1.5 rounded-xl transition-all w-fit">
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <span className="text-text-muted flex items-center gap-2 font-medium"><Tag className="w-4 h-4" /> Labels</span>
              <div className="flex items-center gap-2 p-1.5 -ml-1.5 w-fit">
                <span className="px-2 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase bg-brand-indigo/10 text-brand-indigo border border-brand-indigo/20">Frontend</span>
                <button className="text-text-muted hover:text-text-primary transition-colors p-1 hover:bg-surface-hover rounded-md">+</button>
              </div>
            </div>
          </div>

          <hr className="border-surface-border" />

          {/* Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-text-secondary font-bold tracking-tight text-lg">
              <AlignLeft className="w-5 h-5 text-text-muted" /> Description
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleDescriptionBlur}
              className="w-full min-h-[140px] rounded-2xl border border-transparent hover:border-surface-border focus:border-brand-indigo/50 bg-transparent hover:bg-surface-hover focus:bg-surface focus:shadow-sm p-4 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-4 focus:ring-brand-indigo/10 transition-all resize-y leading-relaxed"
              placeholder="Add a more detailed description..."
            />
          </div>

          <hr className="border-surface-border" />

          {/* Checklist */}
          <div className="space-y-5">
            <div className="flex items-center justify-between text-text-secondary font-bold tracking-tight text-lg">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-text-muted" /> Checklist
              </div>
              <span className="text-xs font-semibold bg-surface-hover px-2 py-0.5 rounded-md text-text-muted">
                {completedItems}/{checklistItems.length}
              </span>
            </div>
            
            {checklistItems.length > 0 && (
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-surface-border rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-brand-indigo transition-all duration-500 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-text-muted w-8">{progressPercentage}%</span>
              </div>
            )}

            <div className="space-y-2">
              {checklistItems.map((item: any) => (
                <div key={item.id} className="group flex items-start gap-3 p-2 -mx-2 rounded-xl hover:bg-surface-hover transition-colors">
                  <button
                    onClick={() => updateChecklistItem.mutate({ taskId: task.id, itemId: item.id, data: { isCompleted: !item.isCompleted }})}
                    className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                      item.isCompleted 
                        ? 'bg-brand-indigo border-brand-indigo text-white' 
                        : 'border-surface-border hover:border-brand-indigo bg-surface'
                    }`}
                  >
                    {item.isCompleted && <Check className="w-3.5 h-3.5" />}
                  </button>
                  <div className="flex-1">
                    <input
                      type="text"
                      defaultValue={item.title}
                      onBlur={(e) => {
                        if (e.target.value !== item.title) {
                          updateChecklistItem.mutate({ taskId: task.id, itemId: item.id, data: { title: e.target.value } });
                        }
                      }}
                      className={`w-full bg-transparent focus:bg-surface focus:outline-none focus:ring-2 focus:ring-brand-indigo/50 rounded-lg px-2 py-1 -ml-2 text-sm transition-all ${
                        item.isCompleted ? 'text-text-muted line-through' : 'text-text-primary'
                      }`}
                    />
                  </div>
                  <button 
                    onClick={() => removeChecklistItem.mutate({ taskId: task.id, itemId: item.id })}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-text-muted hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddChecklist} className="pt-2">
              <div className="relative flex items-center">
                <Plus className="absolute left-3 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  value={newChecklistTitle}
                  onChange={(e) => setNewChecklistTitle(e.target.value)}
                  placeholder="Add an item..."
                  className="w-full h-10 pl-9 pr-4 bg-transparent border border-surface-border hover:border-text-muted focus:border-brand-indigo/50 focus:bg-surface rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-4 focus:ring-brand-indigo/10 transition-all"
                />
              </div>
            </form>
          </div>

          <hr className="border-surface-border" />

          {/* Attachments */}
          <div className="space-y-5">
            <div className="flex items-center justify-between text-text-secondary font-bold tracking-tight text-lg">
              <div className="flex items-center gap-2">
                <Paperclip className="w-5 h-5 text-text-muted" /> Attachments
              </div>
              <Button onClick={() => setIsUploadOpen(true)} variant="outline" size="sm" className="gap-1.5 py-1 px-2 h-7 text-xs">
                <Plus className="w-3 h-3" /> Add
              </Button>
            </div>
            
            {files.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {files.map((file: any) => (
                  <div key={file.id} className={`flex items-center gap-3 p-3 rounded-xl border border-surface-border bg-surface-hover/30 hover:bg-surface-hover transition-colors group ${file.archived ? 'opacity-50' : ''}`}>
                    <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center shrink-0">
                      {getFileIcon(file.format)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-text-primary truncate" title={file.originalName || file.filename}>{file.originalName || file.filename}</p>
                      <p className="text-xs text-text-muted truncate">{formatBytes(file.sizeBytes)} • v{file.version}</p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <button onClick={() => setPreviewFile(file)} className="p-1.5 rounded-md text-text-muted hover:text-brand-indigo hover:bg-brand-indigo/10" title="Preview"><Eye className="w-4 h-4" /></button>
                      {file.archived ? (
                        <button onClick={() => handleRestore(file.id)} className="p-1.5 rounded-md text-text-muted hover:text-emerald-400 hover:bg-emerald-500/10" title="Restore"><RefreshCw className="w-4 h-4" /></button>
                      ) : (
                        <button onClick={() => handleDelete(file.id, false)} className="p-1.5 rounded-md text-text-muted hover:text-orange-400 hover:bg-orange-400/10" title="Archive"><Archive className="w-4 h-4" /></button>
                      )}
                      <button onClick={() => handleDelete(file.id, true)} className="p-1.5 rounded-md text-text-muted hover:text-red-400 hover:bg-red-500/10" title="Delete"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-6 border-2 border-dashed border-surface-border rounded-xl bg-surface-hover/30">
                <p className="text-sm text-text-muted">No attachments yet.</p>
              </div>
            )}
          </div>

          <hr className="border-surface-border" />

          {/* Activity Placeholder */}
          <div className="space-y-6 pb-12">
            <div className="flex items-center gap-2 text-text-secondary font-bold tracking-tight text-lg">
              <MessageSquare className="w-5 h-5 text-text-muted" /> Activity
            </div>
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-full bg-text-primary text-surface flex items-center justify-center font-bold text-sm shrink-0 premium-shadow">
                {user?.name?.substring(0, 2).toUpperCase() || "?"}
              </div>
              <div className="flex-1">
                <input 
                  type="text" 
                  placeholder="Write a comment..." 
                  className="w-full h-11 bg-surface-hover border border-transparent hover:border-surface-border rounded-xl px-4 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:bg-surface focus:border-brand-indigo/50 focus:ring-4 focus:ring-brand-indigo/10 transition-all"
                />
              </div>
            </div>
          </div>

        </div>
      </motion.div>
      </AnimatePresence>
      <FileUploadDrawer isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} defaultLocation="task" defaultTaskId={task.id} defaultProjectId={task.projectId} />
      <FilePreviewDrawer isOpen={!!previewFile} file={previewFile} onClose={() => setPreviewFile(null)} />
    </>
  );
};
