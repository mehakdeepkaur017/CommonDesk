import React from 'react';
import { motion } from 'framer-motion';
import { Link2, Copy, CheckCircle2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../components/feedback/ToastContext';
import { useWorkspace } from '../../../hooks/queries/useWorkspace';
import { PendingJoinRequests } from '../members/PendingJoinRequests';

export const AdminInvitationsList = () => {
  const { data: workspace } = useWorkspace();
  const { toast } = useToast();

  const handleCopyLink = () => {
    if (workspace?.joinCode) {
      const joinUrl = `${window.location.origin}/auth/join-organization?code=${workspace.joinCode}`;
      navigator.clipboard.writeText(joinUrl);
      toast({ title: 'Link Copied', description: 'Invite link copied to clipboard.', type: 'success' });
    }
  };

  const handleCopyCode = () => {
    if (workspace?.joinCode) {
      navigator.clipboard.writeText(workspace.joinCode);
      toast({ title: 'Code Copied', description: 'Workspace code copied to clipboard.', type: 'success' });
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-10">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-heading text-text-primary mb-2">Invitations</h1>
        <p className="text-sm text-text-muted">Invite users to your workspace and manage pending join requests.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column - Workspace Link */}
        <div className="lg:col-span-1 space-y-6">
          <section className="bg-surface border border-surface-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Link2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-text-primary">Workspace Link</h2>
                <p className="text-sm text-text-muted">Share this link for users to request access.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Direct Link</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    readOnly 
                    value={workspace?.joinCode ? `${window.location.origin}/auth/join-organization?code=${workspace.joinCode}` : 'Loading...'}
                    className="flex-1 w-full h-11 bg-black/[0.02] dark:bg-background border border-surface-border rounded-xl px-4 text-sm text-text-muted cursor-not-allowed truncate"
                  />
                  <Button type="button" variant="outline" className="h-11 px-4 gap-2 shrink-0" onClick={handleCopyLink}>
                    <Copy className="w-4 h-4" /> Copy
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Join Code (For existing users)</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    readOnly 
                    value={workspace?.joinCode || 'Loading...'}
                    className="flex-1 w-full h-11 bg-black/[0.02] dark:bg-background border border-surface-border rounded-xl px-4 text-xl font-mono tracking-[0.2em] font-bold text-brand-indigo cursor-not-allowed text-center"
                  />
                  <Button type="button" variant="outline" className="h-11 px-4 gap-2 shrink-0" onClick={handleCopyCode}>
                    <Copy className="w-4 h-4" /> Copy
                  </Button>
                </div>
              </div>
              
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex gap-3 mt-4">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-xs text-text-secondary leading-relaxed">
                  Users joining via the link or code will be placed in the <strong className="text-text-primary">Pending Join Requests</strong> queue.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column - Pending Requests */}
        <div className="lg:col-span-2">
          <section className="bg-surface border border-surface-border rounded-2xl p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-text-primary">Pending Join Requests</h2>
              <p className="text-sm text-text-muted">Review and approve users requesting to join your workspace.</p>
            </div>
            <PendingJoinRequests />
          </section>
        </div>
      </div>

    </motion.div>
  );
};
