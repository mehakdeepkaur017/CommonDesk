import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Users, Shield, ShieldAlert, Trash2 } from "lucide-react";
import { useMembers } from "../../hooks/queries/useMembers";
import { useWorkspace } from "../../hooks/queries/useWorkspace";
import { useAddProjectMember, useRemoveProjectMember } from "../../hooks/queries/useProjects";
import { useToast } from "../feedback/ToastContext";

interface Props {
  project: any;
  onClose: () => void;
}

export const ProjectMembersModal: React.FC<Props> = ({ project, onClose }) => {
  const { data: membersData, isLoading: isLoadingMembers } = useMembers({ limit: 100 });
  const { data: workspace } = useWorkspace();
  const { mutateAsync: addMember, isPending: isAdding } = useAddProjectMember();
  const { mutateAsync: removeMember, isPending: isRemoving } = useRemoveProjectMember();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("member");

  const allWorkspaceMembers = membersData?.items || [];
  const projectMembers = project.members || [];
  
  const notInProject = allWorkspaceMembers.filter(m => 
    !projectMembers.some((pm: any) => pm.userId === m.user.id)
  );

  const filteredUnassigned = notInProject.filter(m => 
    m.user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isAdmin = workspace?.currentUser?.role === "ADMIN";
  const projectRole = project.currentUserRole;
  const canManageMembers = isAdmin || projectRole === "owner" || projectRole === "manager";

  const handleAddMember = async () => {
    if (!selectedUserId) return;
    try {
      await addMember({ projectId: project.id, userId: selectedUserId, role: selectedRole });
      toast({ title: "Member added", type: "success" });
      setSelectedUserId("");
    } catch (err: any) {
      toast({ title: "Failed to add member", description: err.response?.data?.message || err.message, type: "error" });
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!window.confirm("Remove this member from the project?")) return;
    try {
      await removeMember({ projectId: project.id, userId });
      toast({ title: "Member removed", type: "success" });
    } catch (err: any) {
      toast({ title: "Failed to remove member", description: err.response?.data?.message || err.message, type: "error" });
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-brand-navy/60 backdrop-blur-md z-[100] transition-colors duration-300 flex items-center justify-center p-4 sm:p-6"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl bg-background border border-surface-border rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden relative"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-surface-border bg-surface/30 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-indigo/10 border border-brand-indigo/20 flex items-center justify-center text-brand-indigo">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-heading text-text-primary tracking-tight">Project Members</h2>
                <p className="text-sm text-text-muted mt-0.5">{project.name}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors p-2 rounded-xl hover:bg-surface-hover">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-surface-border">
            
            {canManageMembers && (
              <>
                {/* Add Member Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-text-secondary tracking-tight">Add Members</h3>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                      <select
                        value={selectedUserId}
                        onChange={(e) => setSelectedUserId(e.target.value)}
                        className="w-full h-11 pl-9 pr-4 rounded-xl border border-surface-border bg-surface hover:bg-surface-hover text-sm font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-indigo/50 transition-all appearance-none cursor-pointer"
                      >
                        <option value="" disabled>Select a workspace member...</option>
                        {filteredUnassigned.map(m => (
                          <option key={m.user.id} value={m.user.id}>
                            {m.user.name} ({m.user.email})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="w-32">
                      <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="w-full h-11 px-3 rounded-xl border border-surface-border bg-surface hover:bg-surface-hover text-sm font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-indigo/50 transition-all appearance-none cursor-pointer"
                      >
                        <option value="member">Member</option>
                        <option value="owner">Owner</option>
                      </select>
                    </div>
                    <Button 
                      onClick={handleAddMember} 
                      disabled={!selectedUserId || isAdding}
                      className="h-11 shadow-md"
                    >
                      {isAdding ? "Adding..." : "Add"}
                    </Button>
                  </div>
                </div>

                <div className="w-full h-px bg-surface-border/50" />
              </>
            )}

            {/* Current Members List */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-text-secondary tracking-tight flex items-center justify-between">
                <span>Current Members ({projectMembers.length})</span>
              </h3>
              
              <div className="space-y-2">
                {projectMembers.map((pm: any) => (
                  <div key={pm.userId} className="flex items-center justify-between p-3 rounded-xl border border-surface-border bg-surface hover:bg-surface-hover transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-brand-indigo/10 border border-brand-indigo/20 flex items-center justify-center text-brand-indigo font-bold text-sm">
                        {pm.user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-text-primary leading-tight">{pm.user.name}</p>
                        <p className="text-xs text-text-muted mt-0.5">{pm.user.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <span className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-md border ${
                        pm.role === "owner" 
                          ? "bg-amber-500/10 text-amber-500 border-amber-500/20" 
                          : "bg-surface-border text-text-secondary border-surface-border/50"
                      }`}>
                        {pm.role === "owner" ? <ShieldAlert className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
                        {pm.role.toUpperCase()}
                      </span>
                      
                      {canManageMembers && (
                        <button 
                          onClick={() => handleRemoveMember(pm.userId)}
                          disabled={isRemoving}
                          className="text-text-muted hover:text-rose-500 hover:bg-rose-500/10 p-2 rounded-lg transition-colors"
                          title="Remove member"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
