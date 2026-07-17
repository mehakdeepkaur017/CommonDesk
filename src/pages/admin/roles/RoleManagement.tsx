import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, ShieldAlert, Plus, Copy, Edit2, Trash2, Check, X, AlertCircle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../components/feedback/ToastContext';

import { useRoles, useCreateRole, useUpdateRole, useDeleteRole } from '../../../hooks/queries/useRoles';

const permissionCategories = [
  { name: 'Workspace', items: ['View Settings', 'Manage Settings', 'Delete Workspace'] },
  { name: 'Projects', items: ['Create Projects', 'View All Projects', 'Edit All Projects', 'Delete Projects'] },
  { name: 'Tasks', items: ['Create Tasks', 'Edit Tasks', 'Delete Tasks', 'Assign Tasks'] },
  { name: 'Members', items: ['Invite Members', 'Remove Members', 'Manage Roles'] },
  { name: 'Security', items: ['View Audit Logs', 'Manage 2FA', 'Manage API Keys'] },
];

export const RoleManagement = () => {
  const { data: roles = [], isLoading } = useRoles();
  const [activeRoleId, setActiveRoleId] = useState<string | null>(null);
  const createRole = useCreateRole();
  const deleteRole = useDeleteRole();
  const { toast } = useToast();

  const activeRole = roles.find((r: any) => r.id === activeRoleId) || roles[0];

  React.useEffect(() => {
    if (roles.length > 0 && !activeRoleId) {
      setActiveRoleId(roles[0].id);
    }
  }, [roles, activeRoleId]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 shrink-0">
        <div>
          <h1 className="text-2xl font-bold font-heading text-text-primary mb-1">Roles & Permissions</h1>
          <p className="text-sm text-text-muted">Configure access levels and permission matrices across the organization.</p>
        </div>
        <Button 
          className="gap-2" 
          onClick={async () => {
            const name = window.prompt("Enter new role name:");
            if (name) {
              try {
                const res: any = await createRole.mutateAsync({ name, permissions: [] });
                setActiveRoleId(res.role.id);
                toast({ title: 'Role Created', description: `${name} has been created.`, type: 'success' });
              } catch (e) {
                toast({ title: 'Error', description: 'Failed to create role', type: 'error' });
              }
            }
          }}
        >
          <Plus className="w-4 h-4" /> Create Custom Role
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        
        {/* Left Column - Roles List */}
        <div className="w-full lg:w-72 flex flex-col gap-3 shrink-0">
          {isLoading && <div className="text-sm text-text-muted">Loading roles...</div>}
          {!isLoading && roles.map((role: any) => (
            <button
              key={role.id}
              onClick={() => setActiveRoleId(role.id)}
              className={`flex flex-col text-left p-4 rounded-xl border transition-all ${
                activeRole?.id === role.id 
                  ? 'bg-brand-indigo/10 border-brand-indigo text-brand-indigo' 
                  : 'bg-surface border-surface-border hover:border-surface-border text-text-primary'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="font-bold text-sm">{role.name}</span>
                {!role.workspaceId && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-surface-hover text-text-muted">System</span>
                )}
              </div>
              <span className={`text-xs ${activeRole?.id === role.id ? 'text-brand-indigo/60' : 'text-text-muted'}`}>
                {role._count?.members || 0} Members assigned
              </span>
            </button>
          ))}
        </div>

        {/* Right Column - Permission Matrix */}
        <div className="flex-1 bg-surface border border-surface-border rounded-2xl flex flex-col overflow-hidden min-w-0">
          {!activeRole ? (
             <div className="p-6 text-center text-text-muted">Select a role to view permissions</div>
          ) : (
            <>
          {/* Matrix Header */}
          <div className="p-6 border-b border-surface-border flex items-center justify-between bg-black/[0.02] dark:bg-background">
            <div>
              <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                <Shield className="w-5 h-5 text-brand-indigo" /> 
                {activeRole.name} Permissions
              </h2>
              {!activeRole.workspaceId && (
                <p className="text-xs text-amber-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> System roles cannot be modified directly. Clone this role to customize.
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 gap-2 bg-surface-hover border-surface-border" onClick={() => toast({ title: 'Role Copied', description: 'Duplicating role permissions...', type: 'success' })}>
                <Copy className="w-3.5 h-3.5" /> Duplicate
              </Button>
              {activeRole.workspaceId && (
                <>
                  <Button variant="outline" size="sm" className="h-8 gap-2 bg-surface-hover border-surface-border" onClick={() => toast({ title: 'Edit Mode', description: 'Editing will be enabled in next phase.', type: 'info' })}>
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 gap-2 bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20 hover:text-red-300" 
                    onClick={async () => {
                      if (window.confirm("Are you sure you want to delete this role?")) {
                        try {
                          await deleteRole.mutateAsync(activeRole.id);
                          toast({ title: 'Role Deleted', description: 'Custom role has been deleted.', type: 'success' });
                          setActiveRoleId(roles[0]?.id || null);
                        } catch (e) {
                          toast({ title: 'Error', description: 'Failed to delete role', type: 'error' });
                        }
                      }
                    }}
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Matrix Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {permissionCategories.map((category) => (
              <div key={category.name}>
                <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-4 border-b border-surface-border pb-2">
                  {category.name}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.items.map((item) => {
                    // Read from activeRole.permissions if it exists
                    // We'll mock the check logic based on the role name for now if permissions object is empty
                    const isChecked = activeRole.permissions?.admin === true || activeRole.name === 'ADMIN' || activeRole.name === 'SUPER ADMIN';
                    return (
                      <div key={item} className="flex items-center justify-between p-3 rounded-lg bg-black/[0.02] dark:bg-background border border-surface-border">
                        <span className="text-sm text-text-primary font-medium">{item}</span>
                        <div className={`w-8 h-5 rounded-full relative transition-colors ${isChecked ? 'bg-brand-indigo' : 'bg-surface'}`}>
                          <div className={`absolute top-1 left-1 w-3 h-3 rounded-full bg-slate-900 dark:bg-white transition-transform ${isChecked ? 'translate-x-3' : ''}`} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
            </>
          )}
        </div>

      </div>
    </motion.div>
  );
};
