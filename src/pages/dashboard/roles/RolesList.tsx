import React from "react";
import { motion } from "framer-motion";
import { ShieldAlert, ShieldCheck, Shield } from "lucide-react";
import { Button } from "../../../components/ui/Button";

const roles = [
  {
    id: "super_admin",
    name: "Super Admin",
    description: "Has full access to all workspace settings, billing, and organizations.",
    icon: ShieldAlert,
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    count: 1
  },
  {
    id: "org_admin",
    name: "Organization Admin",
    description: "Can manage members, roles, and projects within their specific organization.",
    icon: ShieldCheck,
    color: "text-brand-indigo",
    bg: "bg-brand-indigo/10",
    border: "border-brand-indigo/20",
    count: 3
  },
  {
    id: "member",
    name: "Member",
    description: "Can view and participate in assigned projects and tasks.",
    icon: Shield,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    count: 24
  }
];

export const RolesList = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 h-full flex flex-col max-w-5xl mx-auto"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-text-primary mb-1">Roles & Permissions</h1>
          <p className="text-sm text-text-muted">Configure access levels for your workspace members.</p>
        </div>
        <Button>
          Create Custom Role
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {roles.map((role, i) => (
          <motion.div
            key={role.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`glass-card rounded-2xl p-6 border ${role.border} bg-black/[0.02] dark:bg-background flex flex-col h-full hover:bg-black/[0.04] dark:bg-surface transition-colors relative overflow-hidden`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${role.bg}`}>
              <role.icon className={`w-6 h-6 ${role.color}`} />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">{role.name}</h3>
            <p className="text-sm text-text-secondary mb-6 flex-1">{role.description}</p>
            
            <div className="flex items-center justify-between pt-4 border-t border-surface-border">
              <div className="text-sm font-medium text-text-muted">
                <span className="text-text-primary">{role.count}</span> Assigned
              </div>
              <button className="text-sm font-medium text-brand-indigo hover:text-brand-violet transition-colors">
                View matrix
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex-1 rounded-2xl border border-surface-border bg-black/[0.02] dark:bg-background p-8 flex flex-col min-h-[400px]">
         <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-text-primary">Permission Matrix</h3>
            <span className="px-3 py-1 bg-surface-hover border border-surface-border rounded-full text-xs text-text-muted">API Ready Scaffold</span>
         </div>
         
         <div className="flex-1 border-2 border-dashed border-surface-border rounded-xl flex items-center justify-center">
            <div className="text-center text-text-muted">
              <Shield className="w-8 h-8 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Select a role above to view and edit its detailed permission matrix.</p>
            </div>
         </div>
      </div>
    </motion.div>
  );
};
