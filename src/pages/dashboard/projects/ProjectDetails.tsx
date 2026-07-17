import React from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Info, Calendar, Users, ChevronDown } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { useProject, useUpdateProject } from "../../../hooks/queries/useProjects";
import { useWorkspace } from "../../../hooks/queries/useWorkspace";
import { useToast } from "../../../components/feedback/ToastContext";

export const ProjectDetails = () => {
  const { id } = useParams();
  const { data: project, isLoading: isProjectLoading } = useProject(id);
  const { data: workspace } = useWorkspace();
  const updateProject = useUpdateProject();
  const { toast } = useToast();
  
  const [showStatusDropdown, setShowStatusDropdown] = React.useState(false);

  const currentUser = workspace?.currentUser;
  const isAssigned = project?.members?.some((m: any) => m.userId === currentUser?.id || m.user?.id === currentUser?.id);

  if (isProjectLoading) {
    return (
      <div className="flex-1 h-[calc(100vh-8rem)] flex items-center justify-center">
         <div className="w-8 h-8 border-4 border-brand-indigo/20 border-t-brand-indigo rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex-1 h-[calc(100vh-8rem)] flex flex-col items-center justify-center">
         <div className="w-12 h-12 text-text-muted mb-4 opacity-50" />
         <h2 className="text-xl font-bold text-text-primary">Project Not Found</h2>
         <p className="text-text-muted mb-4">The project you are looking for does not exist or was deleted.</p>
         <Link to="/dashboard/projects">
           <Button>Back to Projects</Button>
         </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-[calc(100vh-8rem)] overflow-y-auto scrollbar-none"
    >
      {/* Header */}
      <div className="mb-8 flex-shrink-0">
        <Link to="/dashboard/projects" className="inline-flex items-center text-xs font-medium text-text-muted hover:text-text-primary transition-colors mb-4">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Projects
        </Link>
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-indigo/20 to-brand-violet/20 border border-brand-indigo/30 flex items-center justify-center text-brand-indigo font-bold text-2xl shadow-inner relative overflow-hidden shrink-0">
               <div className="absolute inset-0 bg-brand-indigo/10 blur-xl rounded-full" />
               <span className="relative z-10">{project.name.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                 <h1 className="text-2xl font-bold font-heading text-text-primary leading-none">
                   {project.name}
                 </h1>
                
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  project.status === "active" ? "bg-emerald-500/20 text-emerald-500" :
                  project.status === "completed" ? "bg-brand-indigo/20 text-brand-indigo" :
                  "bg-surface-border text-text-secondary"
                }`}>
                  {project.status?.replace("_", " ")}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-text-muted">
                <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
                {project.dueDate && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Due {new Date(project.dueDate).toLocaleDateString()}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-10">
         <div className="lg:col-span-2 space-y-6">
           <div className="bg-surface border border-surface-border rounded-2xl p-6 min-h-[250px] shadow-sm">
             <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
               Description
             </h3>
             {project.description ? (
               <p className="text-sm text-text-secondary whitespace-pre-wrap leading-relaxed">{project.description}</p>
             ) : (
               <p className="text-sm text-text-muted italic">No description provided.</p>
             )}
           </div>

           {/* Team Members */}
           <div className="bg-surface border border-surface-border rounded-2xl p-6 shadow-sm">
             <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
               <Users className="w-4 h-4 text-brand-indigo" /> Assigned Team Members
             </h3>
             {project.members && project.members.length > 0 ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                 {project.members.map((member: any) => (
                   <div key={member.id} className="flex items-center gap-3 p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-surface-border">
                     <div className="w-8 h-8 rounded-full bg-brand-indigo/10 flex items-center justify-center text-brand-indigo font-bold text-xs shrink-0">
                       {member.user?.name?.charAt(0) || "U"}
                     </div>
                     <div className="min-w-0">
                       <p className="text-sm font-medium text-text-primary truncate">{member.user?.name}</p>
                       <p className="text-xs text-text-muted capitalize">{member.role || 'Member'}</p>
                     </div>
                   </div>
                 ))}
               </div>
             ) : (
               <p className="text-sm text-text-muted italic">No members assigned to this project.</p>
             )}
           </div>
         </div>
         
         <div className="bg-surface border border-surface-border rounded-2xl p-6 shadow-sm h-fit">
           <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
             <Info className="w-4 h-4 text-brand-indigo" /> Project Configuration
           </h3>
           <div className="space-y-4">
              <div>
                <p className="text-xs text-text-muted font-bold uppercase tracking-wider mb-1">Status</p>
                {isAssigned ? (
                  <div className="relative inline-block mt-1">
                    <button
                      type="button"
                      onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors hover:opacity-80 bg-brand-indigo/10 text-brand-indigo border-brand-indigo/20 capitalize"
                    >
                      {project.status?.replace("_", " ") || "Active"} <ChevronDown className="w-3 h-3 opacity-70" />
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
                                    if(id) {
                                      await updateProject.mutateAsync({ id, data: { status: s } });
                                      toast({ title: 'Status Updated', type: 'success' });
                                    }
                                  } catch (e: any) {
                                    toast({ title: 'Update Failed', description: e.message, type: 'error' });
                                  }
                                  setShowStatusDropdown(false);
                                }}
                                className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-surface-hover transition-colors capitalize ${project.status === s ? 'text-brand-indigo bg-brand-indigo/5' : 'text-text-secondary hover:text-text-primary'}`}
                              >
                                {s.replace("_", " ")}
                              </button>
                            ))}
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <p className="text-sm text-text-primary capitalize">{project.status?.replace("_", " ") || "Active"}</p>
                )}
              </div>
              <div>
                <p className="text-xs text-text-muted font-bold uppercase tracking-wider mb-1">Priority</p>
                <p className="text-sm text-text-primary capitalize">{project.priority || "Medium"}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted font-bold uppercase tracking-wider mb-1">Visibility</p>
                <p className="text-sm text-text-primary capitalize">{project.visibility || "Public"}</p>
              </div>
              {project.startDate && (
                <div>
                  <p className="text-xs text-text-muted font-bold uppercase tracking-wider mb-1">Start Date</p>
                  <p className="text-sm text-text-primary">{new Date(project.startDate).toLocaleDateString()}</p>
                </div>
              )}
              {project.dueDate && (
                <div>
                  <p className="text-xs text-text-muted font-bold uppercase tracking-wider mb-1">Due Date</p>
                  <p className="text-sm text-text-primary">{new Date(project.dueDate).toLocaleDateString()}</p>
                </div>
              )}
           </div>
         </div>
      </div>
    </motion.div>
  );
};
