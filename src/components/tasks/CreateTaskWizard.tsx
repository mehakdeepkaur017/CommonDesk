import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, AlignLeft, Info, Zap, CheckSquare, Folder, Users, ChevronRight, ArrowLeft, Search, Check } from "lucide-react";
import { Input } from "../ui/forms/Input";
import { Button } from "../ui/Button";
import { useCreateTask, useUpdateTask } from "../../hooks/queries/useTasks";
import { useProjects, useProject } from "../../hooks/queries/useProjects";
import { useToast } from "../feedback/ToastContext";

const taskSchema = z.object({
  title: z.string().min(2, "Task title must be at least 2 characters"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  status: z.enum(["todo", "in_progress", "review", "completed", "blocked"]),
  dueDate: z.string().optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface Props {
  projectId?: string;
  initialTask?: any;
  onClose: () => void;
}

export const CreateTaskWizard = ({ projectId: initialProjectId, initialTask, onClose }: Props) => {
  const isEditMode = !!initialTask;
  const [step, setStep] = useState(isEditMode || initialProjectId ? 2 : 1);
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(initialTask?.projectId || initialProjectId);
  const [selectedAssigneeIds, setSelectedAssigneeIds] = useState<string[]>(initialTask?.assignees?.map((a: any) => a.id) || []);
  const [isAssigneeDropdownOpen, setIsAssigneeDropdownOpen] = useState(false);
  const assigneeDropdownRef = useRef<HTMLDivElement>(null);
  
  const { data: projectsData, isLoading: isLoadingProjects } = useProjects();
  const { data: selectedProject } = useProject(selectedProjectId || "");
  const { mutateAsync: createTask } = useCreateTask();
  const { mutateAsync: updateTask } = useUpdateTask();
  const { toast } = useToast();
  
  const projects = projectsData?.items || [];
  const members = selectedProject?.members || [];

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

  const toggleAssignee = (userId: string) => {
    setSelectedAssigneeIds(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: initialTask?.title || "",
      description: initialTask?.description || "",
      priority: initialTask?.priority || "medium",
      status: initialTask?.status || "todo",
      dueDate: initialTask?.dueDate ? new Date(initialTask.dueDate).toISOString().split('T')[0] : undefined,
    }
  });

  const handleProjectSelect = (id: string) => {
    setSelectedProjectId(id);
    setStep(2);
  };

  const onSubmit = async (data: TaskFormValues) => {
    if (!selectedProjectId) return;
    try {
      const dueDate = data.dueDate ? new Date(data.dueDate).toISOString() : undefined;

      const taskData = {
        projectId: selectedProjectId,
        title: data.title,
        description: data.description || "",
        status: data.status,
        priority: data.priority,
        assigneeIds: selectedAssigneeIds.length > 0 ? selectedAssigneeIds : undefined,
        ...(dueDate && { dueDate }),
      };

      if (isEditMode) {
        await updateTask({ id: initialTask.id, data: taskData });
        toast({
          title: "Task Updated",
          description: `"${data.title}" has been updated.`,
          type: "success"
        });
      } else {
        await createTask(taskData as any);
        toast({
          title: "Task Created",
          description: `"${data.title}" has been added.`,
          type: "success"
        });
      }

      onClose();
    } catch (err: any) {
      toast({
        title: "Failed to Create Task",
        description: err.response?.data?.message || err.message || "An unexpected error occurred",
        type: "error"
      });
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-brand-navy/60 backdrop-blur-md z-[100] transition-colors duration-300"
      />

      <motion.div
        initial={{ scale: 0.95, opacity: 0, x: "-50%", y: "-50%" }}
        animate={{ scale: 1, opacity: 1, x: "-50%", y: "-50%" }}
        exit={{ scale: 0.95, opacity: 0, x: "-50%", y: "-50%", transition: { duration: 0.2 } }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        className="fixed left-1/2 top-1/2 w-full max-w-[550px] max-h-[85vh] bg-background border border-surface-border shadow-2xl rounded-2xl z-[101] flex flex-col overflow-hidden"
      >
        <div className="flex items-center justify-between px-8 py-6 border-b border-surface-border bg-surface/50">
          <div className="flex items-center gap-3">
            {step === 2 && !initialProjectId && (
              <button onClick={() => setStep(1)} className="p-2 -ml-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className="w-10 h-10 rounded-xl bg-brand-indigo/10 border border-brand-indigo/20 flex items-center justify-center text-brand-indigo">
              {step === 1 ? <Folder className="w-5 h-5" /> : <CheckSquare className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-xl font-bold font-heading text-text-primary tracking-tight">
                {step === 1 ? "Select Project" : isEditMode ? "Edit Task" : "Create Task"}
              </h2>
              <p className="text-xs text-text-muted mt-0.5">
                {step === 1 ? "Choose where this task belongs" : selectedProject?.name || "Fill in task details"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors p-2 rounded-xl hover:bg-surface-hover">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-surface-border scrollbar-track-transparent">
          {step === 1 ? (
            <div className="p-8 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input 
                  type="text" 
                  placeholder="Search projects..." 
                  className="w-full h-11 pl-10 pr-4 bg-surface border border-surface-border rounded-xl text-sm text-text-primary focus:outline-none focus:border-brand-indigo transition-colors"
                />
              </div>
              
              {isLoadingProjects ? (
                <div className="space-y-2 pt-4">
                  {[1,2,3].map(i => <div key={i} className="h-16 rounded-xl bg-surface animate-pulse" />)}
                </div>
              ) : (
                <div className="space-y-2 pt-4">
                  {projects.map((p: any) => (
                    <button 
                      key={p.id}
                      onClick={() => handleProjectSelect(p.id)}
                      className="w-full flex items-center justify-between p-4 rounded-xl border border-surface-border bg-surface hover:bg-surface-hover hover:border-brand-indigo/30 transition-all group text-left"
                    >
                      <div>
                        <span className="block text-sm font-bold text-text-primary mb-1">{p.name}</span>
                        <span className="block text-xs text-text-muted">{p._count?.members || 0} members</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-brand-indigo transition-colors" />
                    </button>
                  ))}
                  {projects.length === 0 && (
                    <div className="text-center py-8 text-sm text-text-muted">No active projects found.</div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <form id="create-task-form" onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-sm font-bold text-text-primary tracking-tight">
                    <Info className="w-4 h-4 text-text-muted" /> Task Title
                  </label>
                  <Input
                    placeholder="e.g. Design Landing Page"
                    error={errors.title?.message}
                    {...register("title")}
                    autoFocus
                    className="bg-surface-hover border-transparent hover:border-surface-border focus:bg-surface focus:border-brand-indigo/50 h-12 text-lg rounded-xl transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-sm font-bold text-text-primary tracking-tight">
                    <AlignLeft className="w-4 h-4 text-text-muted" /> Description
                  </label>
                  <textarea
                    className="flex w-full rounded-xl border border-transparent hover:border-surface-border bg-surface-hover focus:bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-4 focus:ring-brand-indigo/10 focus:border-brand-indigo/50 transition-all min-h-[120px] resize-y leading-relaxed"
                    placeholder="What needs to be done?"
                    {...register("description")}
                  />
                </div>
              </div>

              <div className="w-full h-px bg-surface-border/50" />

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-sm font-bold text-text-primary tracking-tight">
                    <Zap className="w-4 h-4 text-text-muted" /> Status
                  </label>
                  <div className="relative">
                    <select 
                      className="w-full h-11 rounded-xl border border-transparent hover:border-surface-border bg-surface-hover focus:bg-surface px-4 text-sm font-medium text-text-primary focus:outline-none focus:ring-4 focus:ring-brand-indigo/10 focus:border-brand-indigo/50 transition-all appearance-none cursor-pointer" 
                      {...register("status")}
                    >
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="review">Review</option>
                      <option value="blocked">Blocked</option>
                      <option value="completed">Completed</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-sm font-bold text-text-primary tracking-tight">
                    <Zap className="w-4 h-4 text-text-muted" /> Priority
                  </label>
                  <div className="relative">
                    <select 
                      className="w-full h-11 rounded-xl border border-transparent hover:border-surface-border bg-surface-hover focus:bg-surface px-4 text-sm font-medium text-text-primary focus:outline-none focus:ring-4 focus:ring-brand-indigo/10 focus:border-brand-indigo/50 transition-all appearance-none cursor-pointer" 
                      {...register("priority")}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-1.5">
                    <label className="flex items-center gap-2 text-sm font-bold text-text-primary tracking-tight">
                      <Users className="w-4 h-4 text-text-muted" /> Assignees
                    </label>
                    <div className="relative" ref={assigneeDropdownRef}>
                      <button
                        type="button"
                        onClick={() => setIsAssigneeDropdownOpen(!isAssigneeDropdownOpen)}
                        className="w-full h-11 rounded-xl border border-transparent hover:border-surface-border bg-surface-hover focus:bg-surface px-4 text-sm font-medium text-text-primary focus:outline-none focus:ring-4 focus:ring-brand-indigo/10 focus:border-brand-indigo/50 transition-all cursor-pointer text-left flex items-center justify-between"
                      >
                        <span className={selectedAssigneeIds.length === 0 ? 'text-text-muted' : ''}>
                          {selectedAssigneeIds.length === 0
                            ? 'Select members...'
                            : `${selectedAssigneeIds.length} selected`}
                        </span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted"><polyline points="6 9 12 15 18 9"></polyline></svg>
                      </button>
                      {isAssigneeDropdownOpen && (
                        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-background border border-surface-border rounded-xl shadow-xl max-h-52 overflow-y-auto py-1">
                          {members.length === 0 && (
                            <div className="px-4 py-3 text-sm text-text-muted">No project members</div>
                          )}
                          {members.map((m: any) => {
                            const isSelected = selectedAssigneeIds.includes(m.user.id);
                            return (
                              <button
                                key={m.user.id}
                                type="button"
                                onClick={() => toggleAssignee(m.user.id)}
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
                                <span className="text-xs text-text-muted ml-auto capitalize">{m.role}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    {selectedAssigneeIds.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {selectedAssigneeIds.map(id => {
                          const member = members.find((m: any) => m.user.id === id);
                          if (!member) return null;
                          return (
                            <span key={id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-brand-indigo/10 text-brand-indigo text-xs font-semibold">
                              {member.user.name}
                              <button type="button" onClick={() => toggleAssignee(id)} className="hover:text-red-400 transition-colors">
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          );
                        })}
                      </div>
                    )}
                 </div>

                 <div className="space-y-1.5">
                    <label className="flex items-center gap-2 text-sm font-bold text-text-primary tracking-tight">
                      <Calendar className="w-4 h-4 text-text-muted" /> Due Date
                    </label>
                    <Input
                      type="date"
                      {...register("dueDate")}
                      className="bg-surface-hover border-transparent hover:border-surface-border focus:bg-surface focus:border-brand-indigo/50 h-11 rounded-xl transition-all cursor-pointer font-medium"
                    />
                 </div>
              </div>

            </form>
          )}
        </div>

        <div className="px-8 py-5 border-t border-surface-border bg-surface/50 flex gap-4 backdrop-blur-sm">
          <Button variant="ghost" className="flex-1 font-semibold hover:bg-surface-hover" onClick={onClose}>
            Cancel
          </Button>
          {step === 2 && (
            <Button 
              type="submit" 
              form="create-task-form" 
              className="flex-1 font-semibold premium-shadow hover:premium-shadow-hover relative overflow-hidden" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Creating...
                </span>
              ) : "Create Task"}
            </Button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
