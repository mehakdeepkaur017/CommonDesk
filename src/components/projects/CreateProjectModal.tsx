import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, AlignLeft, Info, Eye, Zap, FolderKanban } from "lucide-react";
import { Input } from "../ui/forms/Input";
import { Button } from "../ui/Button";
import { useCreateProject } from "../../hooks/queries/useProjects";
import { useNavigate } from "react-router-dom";
import { useToast } from "../feedback/ToastContext";

const projectSchema = z.object({
  name: z.string().min(2, "Project name must be at least 2 characters"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
  status: z.enum(["active", "completed", "on_hold", "archived"]),
  startDate: z.string().optional(),
  dueDate: z.string().optional(),
  visibility: z.enum(["public", "private"]),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface Props {
  onClose: () => void;
}

export const CreateProjectModal = ({ onClose }: Props) => {
  const { mutateAsync: createProject } = useCreateProject();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      priority: "medium",
      status: "active",
      visibility: "public",
    }
  });

  const onSubmit = async (data: ProjectFormValues) => {
    try {
      const startDate = data.startDate ? new Date(data.startDate).toISOString() : undefined;
      const endDate = data.dueDate ? new Date(data.dueDate).toISOString() : undefined;

      const res = await createProject({
        name: data.name,
        description: data.description || "",
        status: data.status,
        priority: data.priority,
        visibility: data.visibility,
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      } as any);

      toast({
        title: "Project Created",
        description: `"${data.name}" has been successfully created.`,
        type: "success"
      });

      onClose();
      toast({ title: 'Success', description: 'Project created successfully', type: 'success' });
      const projectId = (res as any)?.project?.id;
      if (projectId) {
        navigate(`/dashboard/projects/${projectId}`);
      }
    } catch (err: any) {
      toast({
        title: "Failed to Create Project",
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
        className="fixed inset-0 bg-brand-navy/60 backdrop-blur-md z-50 transition-colors duration-300"
      />

      <motion.div
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0, transition: { duration: 0.2 } }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        className="fixed right-0 top-0 bottom-0 w-full max-w-[500px] bg-background border-l border-surface-border shadow-2xl z-50 flex flex-col"
      >
        <div className="flex items-center justify-between px-8 py-6 border-b border-surface-border bg-surface/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-indigo/10 border border-brand-indigo/20 flex items-center justify-center text-brand-indigo">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-heading text-text-primary tracking-tight">Create Project</h2>
              <p className="text-xs text-text-muted mt-0.5">Setup a new workspace initiative.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors p-2 rounded-xl hover:bg-surface-hover">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-surface-border scrollbar-track-transparent">
          <form id="create-project-form" onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
            
            <div className="space-y-6">
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-sm font-bold text-text-primary tracking-tight">
                  <Info className="w-4 h-4 text-text-muted" /> Project Name
                </label>
                <Input
                  placeholder="e.g. Website Redesign v2"
                  error={errors.name?.message}
                  {...register("name")}
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
                  placeholder="What is the objective of this project?"
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
                    <option value="active">Active</option>
                    <option value="on_hold">On Hold</option>
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
                    <Calendar className="w-4 h-4 text-text-muted" /> Start Date
                  </label>
                  <Input
                    type="date"
                    {...register("startDate")}
                    className="bg-surface-hover border-transparent hover:border-surface-border focus:bg-surface focus:border-brand-indigo/50 h-11 rounded-xl transition-all cursor-pointer font-medium"
                  />
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

            <div className="w-full h-px bg-surface-border/50" />

            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-sm font-bold text-text-primary tracking-tight">
                <Eye className="w-4 h-4 text-text-muted" /> Visibility
              </label>
              <div className="relative">
                <select 
                  className="w-full h-11 rounded-xl border border-transparent hover:border-surface-border bg-surface-hover focus:bg-surface px-4 text-sm font-medium text-text-primary focus:outline-none focus:ring-4 focus:ring-brand-indigo/10 focus:border-brand-indigo/50 transition-all appearance-none cursor-pointer" 
                  {...register("visibility")}
                >
                  <option value="public">Entire Workspace (Public)</option>
                  <option value="private">Private (Invite Only)</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
              </div>
            </div>

          </form>
        </div>

        <div className="px-8 py-5 border-t border-surface-border bg-surface/50 flex gap-4 backdrop-blur-sm">
          <Button variant="ghost" className="flex-1 font-semibold hover:bg-surface-hover" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            form="create-project-form" 
            className="flex-1 font-semibold premium-shadow hover:premium-shadow-hover relative overflow-hidden" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Creating...
              </span>
            ) : "Create Project"}
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
