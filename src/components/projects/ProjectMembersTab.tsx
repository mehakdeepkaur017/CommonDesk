import React, { useState } from "react";
import { Search, Users, Shield, ShieldAlert, Trash2 } from "lucide-react";
import { useMembers } from "../../hooks/queries/useMembers";
import { useWorkspace } from "../../hooks/queries/useWorkspace";
import { useAddProjectMember, useRemoveProjectMember } from "../../hooks/queries/useProjects";
import { useToast } from "../feedback/ToastContext";
import { Button } from "../ui/Button";

interface Props {
  project: any;
}

export const ProjectMembersTab = ({ project }: Props) => {
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold font-heading text-text-primary tracking-tight">Project Members</h2>
          <p className="text-sm text-text-muted mt-1">Manage team access and roles for this project.</p>
        </div>
      </div>

      <div className="bg-surface border border-surface-border rounded-2xl p-6 space-y-8 shadow-sm">
        {canManageMembers && (
          <>
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
                    <option value="manager">Manager</option>
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
          
          <div className="grid gap-3 sm:grid-cols-2">
            {projectMembers.map((pm: any) => (
              <div key={pm.userId} className="flex items-center justify-between p-4 rounded-xl border border-surface-border bg-background hover:bg-surface-hover transition-colors shadow-sm hover:shadow-md">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-brand-indigo/20 to-brand-violet/20 border border-brand-indigo/20 flex items-center justify-center text-brand-indigo font-bold text-sm shadow-inner">
                    {pm.user.name.charAt(0)}
                  </div>
                  <div className="truncate">
                    <p className="text-sm font-bold text-text-primary leading-tight truncate">{pm.user.name}</p>
                    <p className="text-xs text-text-muted mt-0.5 truncate">{pm.user.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 shrink-0 ml-2">
                  <span className={`flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded border ${
                    pm.role === "owner" 
                      ? "bg-amber-500/10 text-amber-500 border-amber-500/20" 
                      : pm.role === "manager"
                      ? "bg-brand-indigo/10 text-brand-indigo border-brand-indigo/20"
                      : "bg-surface-border text-text-secondary border-surface-border/50"
                  }`}>
                    {pm.role === "owner" ? <ShieldAlert className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                    {pm.role.toUpperCase()}
                  </span>
                  
                  {canManageMembers && pm.role !== "owner" && (
                    <button 
                      onClick={() => handleRemoveMember(pm.userId)}
                      disabled={isRemoving}
                      className="text-text-muted hover:text-rose-500 hover:bg-rose-500/10 p-1.5 rounded-lg transition-colors"
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
    </div>
  );
};
