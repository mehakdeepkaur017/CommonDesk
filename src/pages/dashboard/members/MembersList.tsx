import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Users } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { MemberProfileDrawer } from "../../../components/members/MemberProfileDrawer";
import { useToast } from '../../../components/feedback/ToastContext';
import { useMembers } from '../../../hooks/queries/useMembers';
import type { Member } from "../../../types";

export const MembersList = () => {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const { toast } = useToast();

  const { data, isLoading } = useMembers();
  const members = data?.items || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 h-full flex flex-col"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-text-primary mb-1">Team Members</h1>
          <p className="text-sm text-text-muted">Manage workspace access and member roles.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative hidden sm:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input 
              type="text" 
              placeholder="Search members..." 
              className="h-9 bg-surface-hover border border-surface-border rounded-lg pl-9 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-indigo/50 transition-all w-48 focus:w-64"
            />
          </div>

          <Button variant="outline" size="sm" className="bg-surface-hover border-surface-border hover:bg-surface h-9 w-9 p-0 justify-center" onClick={() => toast({ title: 'Filters', description: 'Advanced member filtering coming soon.', type: 'info' })}>
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content Area / Data Table */}
      <div className="flex-1 rounded-2xl border border-surface-border bg-black/[0.02] dark:bg-background flex flex-col min-h-[400px] overflow-hidden">
        {isLoading ? (
           <div className="flex-1 flex items-center justify-center">
             <div className="w-8 h-8 border-4 border-brand-indigo/20 border-t-brand-indigo rounded-full animate-spin" />
           </div>
        ) : members.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-brand-indigo/20 to-brand-violet/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-surface-border">
              <Users className="w-10 h-10 text-brand-indigo opacity-80" />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2 font-heading">No team members yet</h3>
            <p className="text-sm text-text-muted max-w-sm">
              Your workspace team members will appear here.
            </p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-sm text-text-primary">
              <thead className="text-xs uppercase text-text-muted border-b border-surface-border bg-black/[0.02] dark:bg-background">
                <tr>
                  <th className="px-6 py-4 font-semibold">Member</th>
                  <th className="px-6 py-4 font-semibold">Role</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Joined Date</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {members.map((member: any) => (
                  <tr key={member.id} className="hover:bg-surface-hover transition-colors cursor-pointer" onClick={() => setSelectedMember(member)}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-indigo/20 text-brand-indigo flex items-center justify-center font-bold text-xs">
                          {(member.name || member.email || "U").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold">{member.name || member.email}</p>
                          <p className="text-xs text-text-muted">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 capitalize">{member.role?.toLowerCase() || 'Member'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${member.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                        {member.status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-text-muted">{new Date(member.joinedAt || Date.now()).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                       <Button variant="outline" size="sm" className="h-8">View</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedMember && (
          <MemberProfileDrawer member={selectedMember} onClose={() => setSelectedMember(null)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
};
