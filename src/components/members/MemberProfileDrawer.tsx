import React from "react";
import { motion } from "framer-motion";
import { X, Mail, Calendar, Shield, FolderKanban, CheckSquare, Activity, Settings } from "lucide-react";
import { Button } from "../ui/Button";
import type { Member } from "../../types";

interface Props {
  member: Member | null;
  onClose: () => void;
}

export const MemberProfileDrawer = ({ member: _member, onClose }: Props) => {
  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-brand-navy/60 backdrop-blur-sm z-50 lg:bg-transparent lg:backdrop-blur-none"
      />

      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-surface border-l border-surface-border shadow-2xl z-50 flex flex-col"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border">
          <h2 className="text-sm font-semibold text-text-primary">Member Profile</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors p-1.5 rounded-lg hover:bg-surface-hover">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 p-6 space-y-8">
          
          {/* Profile Header */}
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full border-4 border-surface-border bg-surface-hover flex items-center justify-center shrink-0">
              <span className="text-3xl text-surface-border">?</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold font-heading text-text-primary mb-1">User Name Placeholder</h1>
              <div className="flex items-center gap-2 text-sm text-text-secondary mb-3">
                <Mail className="w-4 h-4" /> user@example.com
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-brand-indigo/20 text-brand-indigo inline-flex items-center gap-1">
                <Shield className="w-3 h-3" /> Member
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-4 rounded-xl border border-surface-border bg-black/[0.02] dark:bg-background">
              <div className="text-xs text-text-muted mb-1 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Joined Date</div>
              <div className="text-sm font-medium text-text-primary">Oct 24, 2026</div>
            </div>
            <div className="glass-card p-4 rounded-xl border border-surface-border bg-black/[0.02] dark:bg-background">
              <div className="text-xs text-text-muted mb-1 flex items-center gap-1.5"><Activity className="w-3.5 h-3.5" /> Last Active</div>
              <div className="text-sm font-medium text-text-primary">Just now</div>
            </div>
          </div>

          {/* API Ready Placeholders */}
          
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-brand-indigo" /> Assigned Projects
            </h3>
            <div className="w-full h-24 rounded-xl border border-surface-border bg-black/[0.01] dark:bg-background flex items-center justify-center text-text-muted text-sm">
              Fetching projects data...
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-emerald-400" /> Active Tasks
            </h3>
            <div className="w-full h-32 rounded-xl border border-surface-border bg-black/[0.01] dark:bg-background flex items-center justify-center text-text-muted text-sm">
              Fetching assigned tasks...
            </div>
          </div>

        </div>
      </motion.div>
    </>
  );
};
