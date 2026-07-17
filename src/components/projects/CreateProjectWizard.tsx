import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, AlignLeft, Info, Eye, Zap, FolderKanban, Users, ArrowRight, ArrowLeft, CheckCircle2, Edit2 } from "lucide-react";
import { Input } from "../ui/forms/Input";
import { Button } from "../ui/Button";
import { useCreateProject, useUpdateProject } from "../../hooks/queries/useProjects";
import { useMembers } from "../../hooks/queries/useMembers";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "../feedback/ToastContext";

const projectSchema = z.object({
  name: z.string().min(2, "Project name must be at least 2 characters"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
  status: z.enum(["active", "completed", "on_hold", "archived"]),
  startDate: z.string().optional(),
  dueDate: z.string().optional(),
  visibility: z.enum(["workspace", "private"]),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface Props {
  onClose: () => void;
  editProject?: any; // If provided, wizard operates in edit mode with this data
}

interface SelectedMember {
  userId: string;
  role: "manager" | "member";
  name: string;
  email: string;
}

export const CreateProjectWizard = ({ onClose, editProject }: Props) => {
  const isEditMode = !!editProject;
  const [step, setStep] = useState(1);
  const [selectedMembers, setSelectedMembers] = useState<SelectedMember[]>([]);
  const [hasInitialized, setHasInitialized] = useState(false);
  
  const { mutateAsync: createProject } = useCreateProject();
  const updateProject = useUpdateProject();
  const { data: membersData, isLoading: isLoadingMembers, error: membersError } = useMembers({ limit: 100 });
  
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      priority: "medium",
      status: "active",
      visibility: "private",
    },
    mode: "onChange",
  });

  // Pre-fill form when editing an existing project
  useEffect(() => {
    if (isEditMode && editProject && !hasInitialized) {
      const proj = editProject;
      
      // Format dates for date inputs (YYYY-MM-DD)
      const formatDate = (d: string | null | undefined) => {
        if (!d) return "";
        try { return new Date(d).toISOString().split("T")[0]; } catch { return ""; }
      };

      reset({
        name: proj.name || "",
        description: proj.description || "",
        priority: proj.priority || "medium",
        status: proj.status || "active",
        visibility: proj.visibility || "private",
        startDate: formatDate(proj.startDate),
        dueDate: formatDate(proj.endDate),
      });

      // Pre-fill existing project members (skip the owner)
      if (proj.members && Array.isArray(proj.members)) {
        const existingMembers: SelectedMember[] = proj.members
          .filter((m: any) => m.role !== "owner")
          .map((m: any) => ({
            userId: m.userId || m.user?.id,
            role: m.role === "manager" ? "manager" : "member",
            name: m.user?.name || m.user?.email || "Unknown",
            email: m.user?.email || "",
          }));
        setSelectedMembers(existingMembers);
      }
      
      setHasInitialized(true);
    }
  }, [isEditMode, editProject, hasInitialized, reset]);

  // Safely extract workspace members
  const workspaceMembers: any[] = (() => {
    try {
      if (!membersData) return [];
      if (Array.isArray(membersData)) return membersData;
      if (Array.isArray((membersData as any)?.items)) return (membersData as any).items;
      return [];
    } catch {
      return [];
    }
  })();

  const handleNextStep = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (step === 1) {
      const isValid = await trigger(["name", "description", "startDate", "dueDate"]);
      if (isValid) setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handlePrevStep = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (step > 1) setStep(step - 1);
  };

  const toggleMember = (member: any) => {
    try {
      const memberId = member?.id || member?.userId;
      if (!memberId) return;
      
      const isSelected = selectedMembers.some(m => m.userId === memberId);
      if (isSelected) {
        setSelectedMembers(selectedMembers.filter(m => m.userId !== memberId));
      } else {
        setSelectedMembers([...selectedMembers, { 
          userId: memberId, 
          role: "member", 
          name: member?.name || member?.email || "Unknown User", 
          email: member?.email || "" 
        }]);
      }
    } catch (err) {
      console.error("Error toggling member:", err);
    }
  };

  const updateMemberRole = (userId: string, role: "manager" | "member") => {
    setSelectedMembers(selectedMembers.map(m => m.userId === userId ? { ...m, role } : m));
  };

  const getDisplayName = (member: any): string => {
    return member?.name || member?.email || "Unknown User";
  };

  const getInitial = (member: any): string => {
    const name = member?.name || member?.email || "U";
    return name.charAt(0).toUpperCase();
  };

  const getMemberId = (member: any): string => {
    return member?.id || member?.userId || Math.random().toString();
  };

  const onSubmit = async (data: ProjectFormValues) => {
    try {
      const startDate = data.startDate ? new Date(data.startDate).toISOString() : undefined;
      const endDate = data.dueDate ? new Date(data.dueDate).toISOString() : undefined;

      const membersPayload = selectedMembers.map(m => ({ userId: m.userId, role: m.role }));

      const payload: any = {
        name: data.name,
        description: data.description || "",
        status: data.status,
        priority: data.priority,
        visibility: data.visibility,
        members: membersPayload,
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      };

      if (isEditMode) {
        // Close immediately — fire-and-forget with optimistic cache update
        onClose();
        toast({
          title: "Project Updated",
          description: `"${data.name}" has been successfully updated.`,
          type: "success"
        });
        updateProject.mutate({ id: editProject!.id, data: payload });
      } else {
        const res = await createProject(payload);
        toast({
          title: "Project Created",
          description: `"${data.name}" has been successfully created.`,
          type: "success"
        });
        onClose();
        
        const projectId = (res as any)?.id || (res as any)?.project?.id;
        if (projectId) {
          const isAdmin = location.pathname.startsWith('/admin');
          navigate(isAdmin ? `/admin/projects` : `/dashboard/projects/${projectId}`);
        }
      }
    } catch (err: any) {
      toast({
        title: isEditMode ? "Failed to Update Project" : "Failed to Create Project",
        description: err?.response?.data?.message || err?.message || "An unexpected error occurred",
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
        className="fixed inset-0 bg-brand-navy/60 backdrop-blur-md z-[100] transition-colors duration-300 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="w-full max-w-3xl bg-background border border-surface-border rounded-2xl shadow-2xl z-[101] flex flex-col max-h-[90vh] overflow-hidden relative"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-surface-border bg-surface/50">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg ${isEditMode ? 'bg-gradient-to-br from-amber-500 to-orange-500 shadow-amber-500/20' : 'bg-gradient-to-br from-brand-indigo to-brand-violet shadow-brand-indigo/20'}`}>
                {isEditMode ? <Edit2 className="w-6 h-6" /> : <FolderKanban className="w-6 h-6" />}
              </div>
              <div>
                <h2 className="text-xl font-bold font-heading text-text-primary tracking-tight">{isEditMode ? "Edit Project" : "Create Project"}</h2>
                <p className="text-sm text-text-muted mt-0.5">Step {step} of 3</p>
              </div>
            </div>
            <button type="button" onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors p-2 rounded-xl hover:bg-surface-hover">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-surface-border scrollbar-track-transparent">
            
            {/* Progress Bar */}
            <div className="flex gap-2 mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? (isEditMode ? 'bg-amber-500' : 'bg-brand-indigo') : 'bg-surface-border'}`} />
              ))}
            </div>

            <form id="wizard-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Step 1: Basic Details */}
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="space-y-6">
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-2 text-sm font-bold text-text-primary tracking-tight">
                        <Info className="w-4 h-4 text-text-muted" /> Project Name
                      </label>
                      <Input
                        placeholder="e.g. Q3 Marketing Campaign"
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
                        placeholder="What is the main objective of this project?"
                        {...register("description")}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="flex items-center gap-2 text-sm font-bold text-text-primary tracking-tight">
                          <Calendar className="w-4 h-4 text-text-muted" /> Start Date
                        </label>
                        <input
                          type="date"
                          {...register("startDate")}
                          className="flex w-full rounded-xl border border-transparent hover:border-surface-border bg-surface-hover focus:bg-surface px-4 py-3 text-sm text-text-primary focus:outline-none focus:ring-4 focus:ring-brand-indigo/10 focus:border-brand-indigo/50 transition-all h-12"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="flex items-center gap-2 text-sm font-bold text-text-primary tracking-tight">
                          <Calendar className="w-4 h-4 text-text-muted" /> Due Date
                        </label>
                        <input
                          type="date"
                          {...register("dueDate")}
                          className="flex w-full rounded-xl border border-transparent hover:border-surface-border bg-surface-hover focus:bg-surface px-4 py-3 text-sm text-text-primary focus:outline-none focus:ring-4 focus:ring-brand-indigo/10 focus:border-brand-indigo/50 transition-all h-12"
                        />
                      </div>
                    </div>

                    {/* Status, Priority & Visibility row */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="flex items-center gap-2 text-sm font-bold text-text-primary tracking-tight">
                          <Zap className="w-4 h-4 text-text-muted" /> Status
                        </label>
                        <select
                          {...register("status")}
                          className="flex w-full rounded-xl border border-transparent hover:border-surface-border bg-surface-hover focus:bg-surface px-4 py-3 text-sm text-text-primary focus:outline-none focus:ring-4 focus:ring-brand-indigo/10 focus:border-brand-indigo/50 transition-all h-12 appearance-none cursor-pointer"
                        >
                          <option value="active">Active</option>
                          <option value="on_hold">On Hold</option>
                          <option value="completed">Completed</option>
                          <option value="archived">Archived</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="flex items-center gap-2 text-sm font-bold text-text-primary tracking-tight">
                          <Zap className="w-4 h-4 text-text-muted" /> Priority
                        </label>
                        <select
                          {...register("priority")}
                          className="flex w-full rounded-xl border border-transparent hover:border-surface-border bg-surface-hover focus:bg-surface px-4 py-3 text-sm text-text-primary focus:outline-none focus:ring-4 focus:ring-brand-indigo/10 focus:border-brand-indigo/50 transition-all h-12 appearance-none cursor-pointer"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="flex items-center gap-2 text-sm font-bold text-text-primary tracking-tight">
                          <Eye className="w-4 h-4 text-text-muted" /> Visibility
                        </label>
                        <select
                          {...register("visibility")}
                          className="flex w-full rounded-xl border border-transparent hover:border-surface-border bg-surface-hover focus:bg-surface px-4 py-3 text-sm text-text-primary focus:outline-none focus:ring-4 focus:ring-brand-indigo/10 focus:border-brand-indigo/50 transition-all h-12 appearance-none cursor-pointer"
                        >
                          <option value="workspace">Workspace (Public)</option>
                          <option value="private">Private</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Team Members */}
              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                        <Users className="w-5 h-5 text-brand-indigo" /> Build Your Team
                      </h3>
                      <p className="text-sm text-text-muted">Select workspace members to add to this project.</p>
                    </div>

                    {/* Selected Members Summary */}
                    {selectedMembers.length > 0 && (
                      <div className="bg-brand-indigo/5 border border-brand-indigo/10 rounded-xl p-4 space-y-3">
                        <p className="text-xs font-bold text-brand-indigo uppercase tracking-wider">{selectedMembers.length} member{selectedMembers.length > 1 ? "s" : ""} selected</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedMembers.map(m => (
                            <div key={m.userId} className="flex items-center gap-2 bg-white dark:bg-surface border border-surface-border rounded-lg px-3 py-1.5 shadow-sm">
                              <div className="w-6 h-6 rounded-full bg-brand-indigo/10 text-brand-indigo flex items-center justify-center text-xs font-bold">
                                {m.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-sm font-medium text-text-primary">{m.name}</span>
                              <select
                                value={m.role}
                                onChange={(e) => updateMemberRole(m.userId, e.target.value as "manager" | "member")}
                                className="text-xs border-0 bg-transparent text-brand-indigo font-bold uppercase cursor-pointer focus:outline-none"
                              >
                                <option value="member">Member</option>
                                <option value="manager">Manager</option>
                              </select>
                              <button
                                type="button"
                                onClick={() => toggleMember(m)}
                                className="text-text-muted hover:text-red-500 transition-colors"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Members List */}
                    <div className="border border-surface-border rounded-xl overflow-hidden max-h-[300px] overflow-y-auto">
                      {isLoadingMembers ? (
                        <div className="p-8 text-center">
                          <div className="w-6 h-6 border-2 border-brand-indigo/20 border-t-brand-indigo rounded-full animate-spin mx-auto mb-2" />
                          <p className="text-sm text-text-muted">Loading workspace members...</p>
                        </div>
                      ) : membersError ? (
                        <div className="p-8 text-center text-sm text-red-500">
                          Failed to load members. You can still create the project and add members later.
                        </div>
                      ) : workspaceMembers.length === 0 ? (
                        <div className="p-8 text-center text-sm text-text-muted">
                          No additional members found in this workspace.
                        </div>
                      ) : (
                        workspaceMembers.map((member) => {
                          const memberId = getMemberId(member);
                          const isSelected = selectedMembers.some(m => m.userId === memberId);
                          return (
                            <button
                              key={memberId}
                              type="button"
                              onClick={() => toggleMember(member)}
                              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-surface-hover transition-colors border-b border-surface-border/50 last:border-b-0 ${isSelected ? "bg-brand-indigo/5" : ""}`}
                            >
                              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${isSelected ? "bg-brand-indigo text-white" : "bg-surface-hover text-text-primary"}`}>
                                {getInitial(member)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-text-primary truncate">{getDisplayName(member)}</p>
                                <p className="text-xs text-text-muted truncate">{member?.email}</p>
                              </div>
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? "border-brand-indigo bg-brand-indigo" : "border-surface-border"}`}>
                                {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                              </div>
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Review & Confirm */}
              {step === 3 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-text-primary">Review & Confirm</h3>
                      <p className="text-sm text-text-muted">Make sure everything looks right before {isEditMode ? "saving changes" : "creating your project"}.</p>
                    </div>

                    <div className="bg-surface border border-surface-border rounded-xl p-6 space-y-4">
                      <div>
                        <p className="text-xs text-text-muted font-bold uppercase tracking-wider mb-1">Project Name</p>
                        <p className="text-lg font-bold text-text-primary">{getValues("name")}</p>
                      </div>

                      {getValues("description") && (
                        <div>
                          <p className="text-xs text-text-muted font-bold uppercase tracking-wider mb-1">Description</p>
                          <p className="text-sm text-text-secondary leading-relaxed">{getValues("description")}</p>
                        </div>
                      )}

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-text-muted font-bold uppercase tracking-wider mb-1">Status</p>
                          <p className="text-sm text-text-primary capitalize">{getValues("status")?.replace("_", " ")}</p>
                        </div>
                        <div>
                          <p className="text-xs text-text-muted font-bold uppercase tracking-wider mb-1">Priority</p>
                          <p className="text-sm text-text-primary capitalize">{getValues("priority")}</p>
                        </div>
                        <div>
                          <p className="text-xs text-text-muted font-bold uppercase tracking-wider mb-1">Visibility</p>
                          <p className="text-sm text-text-primary capitalize">{getValues("visibility")}</p>
                        </div>
                      </div>

                      {(getValues("startDate") || getValues("dueDate")) && (
                        <div className="grid grid-cols-2 gap-4">
                          {getValues("startDate") && (
                            <div>
                              <p className="text-xs text-text-muted font-bold uppercase tracking-wider mb-1">Start Date</p>
                              <p className="text-sm text-text-primary">{getValues("startDate")}</p>
                            </div>
                          )}
                          {getValues("dueDate") && (
                            <div>
                              <p className="text-xs text-text-muted font-bold uppercase tracking-wider mb-1">Due Date</p>
                              <p className="text-sm text-text-primary">{getValues("dueDate")}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {selectedMembers.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-xs text-text-muted font-bold uppercase tracking-wider">Assigned Members ({selectedMembers.length})</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedMembers.map(m => (
                            <div key={m.userId} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-surface-border bg-surface text-sm">
                              <span className="font-medium text-text-primary">{m.name}</span>
                              <span className="text-xs text-brand-indigo uppercase font-bold bg-brand-indigo/10 px-1.5 py-0.5 rounded">{m.role}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </form>
          </div>

          {/* Footer Actions */}
          <div className="px-8 py-5 border-t border-surface-border bg-surface/80 flex items-center justify-between backdrop-blur-sm">
            <Button type="button" variant="ghost" className="font-semibold hover:bg-surface-hover" onClick={step === 1 ? onClose : handlePrevStep}>
              {step === 1 ? "Cancel" : <><ArrowLeft className="w-4 h-4 mr-2" /> Back</>}
            </Button>
            
            {step < 3 ? (
              <Button type="button" onClick={handleNextStep} className="font-semibold premium-shadow">
                Next <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button 
                type="submit" 
                form="wizard-form" 
                className={`font-semibold text-white shadow-lg ${isEditMode ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20' : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20'}`}
                disabled={isSubmitting}
              >
                {isSubmitting 
                  ? (isEditMode ? "Saving..." : "Creating...") 
                  : (<><CheckCircle2 className="w-4 h-4 mr-2" /> {isEditMode ? "Save Changes" : "Create Project"}</>)
                }
              </Button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
