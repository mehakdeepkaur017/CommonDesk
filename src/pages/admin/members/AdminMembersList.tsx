import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Filter, MoreVertical, Shield, 
  Download, Users, Activity, ShieldCheck, Ban, UserPlus
} from 'lucide-react';
import { useMembers, useUpdateMemberRole, useUpdateMemberStatus, useRemoveMember } from '../../../hooks/queries/useMembers';
import { Button } from '../../../components/ui/Button';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { useToast } from '../../../components/feedback/ToastContext';
import { Link } from 'react-router-dom';

const MemberRow = ({ member }: { member: any }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    action: 'admin' | 'member' | 'suspend' | 'reactivate' | 'remove' | null;
    title: string;
    description: string;
    type: 'danger' | 'warning' | 'info';
    isLoading: boolean;
  }>({
    isOpen: false,
    action: null,
    title: '',
    description: '',
    type: 'danger',
    isLoading: false
  });

  const updateRole = useUpdateMemberRole();
  const updateStatus = useUpdateMemberStatus();
  const removeMember = useRemoveMember();
  const { toast } = useToast();

  const handleAction = async (action: 'admin' | 'member' | 'suspend' | 'reactivate' | 'remove') => {
    setShowDropdown(false);
    
    if (action === 'remove') {
      setConfirmConfig({ isOpen: true, action, title: 'Remove Member', description: `Are you sure you want to remove ${member.name} from the workspace? They will lose all access immediately.`, type: 'danger', isLoading: false });
    } else if (action === 'suspend') {
      setConfirmConfig({ isOpen: true, action, title: 'Suspend Member', description: `Are you sure you want to suspend ${member.name}? They will not be able to log in until reactivated.`, type: 'warning', isLoading: false });
    } else if (action === 'admin') {
      setConfirmConfig({ isOpen: true, action, title: 'Promote to Admin', description: `Are you sure you want to promote ${member.name} to Admin? They will have full access to workspace settings and billing.`, type: 'warning', isLoading: false });
    } else if (action === 'member') {
      setConfirmConfig({ isOpen: true, action, title: 'Demote to Member', description: `Are you sure you want to demote ${member.name} to Member? They will lose administrative privileges.`, type: 'warning', isLoading: false });
    } else {
      executeAction(action);
    }
  };

  const executeAction = async (action: 'admin' | 'member' | 'suspend' | 'reactivate' | 'remove') => {
    try {
      setConfirmConfig(prev => ({ ...prev, isLoading: true }));
      if (action === 'admin') await updateRole.mutateAsync({ memberId: member.membershipId, roleId: 'ADMIN' });
      if (action === 'member') await updateRole.mutateAsync({ memberId: member.membershipId, roleId: 'MEMBER' });
      if (action === 'suspend') await updateStatus.mutateAsync({ memberId: member.membershipId, status: 'suspended' });
      if (action === 'reactivate') await updateStatus.mutateAsync({ memberId: member.membershipId, status: 'active' });
      if (action === 'remove') await removeMember.mutateAsync(member.membershipId);
      toast({ title: 'Success', description: 'Action completed successfully.', type: 'success' });
    } catch (error: any) {
      toast({ title: 'Action Failed', description: error.response?.data?.message || 'Unknown error', type: 'error' });
    } finally {
      setConfirmConfig(prev => ({ ...prev, isOpen: false, isLoading: false }));
    }
  };

  return (
    <>
    <tr className="hover:bg-black/[0.02] dark:bg-background transition-colors group">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-indigo to-brand-violet flex items-center justify-center text-sm font-bold text-text-primary shrink-0">
            {member.name.split(' ').map((n: any) => n[0]).join('').substring(0,2)}
          </div>
          <div>
            <p className="text-sm font-bold text-text-primary">{member.name}</p>
            <p className="text-xs text-text-muted">{member.email}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <Shield className={`w-4 h-4 ${member.role === 'ADMIN' ? 'text-purple-400' : 'text-text-muted'}`} />
          <span className="text-sm text-text-primary capitalize">{member.role.toLowerCase()}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          member.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
          'bg-orange-500/10 text-orange-400 border border-orange-500/20'
        }`}>
          {member.status}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${member.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-surface-border'}`} />
          <span className="text-xs text-text-secondary">{member.status === 'active' ? 'Online' : 'Offline'}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {member.status === 'active' ? (
            <button 
              onClick={() => handleAction('suspend')} 
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 transition-colors"
            >
              Suspend
            </button>
          ) : (
            <button 
              onClick={() => handleAction('reactivate')} 
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors"
            >
              Reactivate
            </button>
          )}
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {showDropdown && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-surface border border-surface-border rounded-xl shadow-xl py-2 z-10 text-left">
                {member.role !== 'ADMIN' && (
                  <button onClick={() => handleAction('admin')} className="w-full px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors text-left">Make Admin</button>
                )}
                {member.role !== 'MEMBER' && (
                  <button onClick={() => handleAction('member')} className="w-full px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors text-left">Make Member</button>
                )}
                {member.role !== 'ADMIN' || member.role !== 'MEMBER' ? <hr className="my-1 border-surface-border" /> : null}
                <button onClick={() => handleAction('remove')} className="w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors text-left">Remove from Workspace</button>
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
    <ConfirmDialog 
      isOpen={confirmConfig.isOpen}
      onClose={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
      onConfirm={() => confirmConfig.action && executeAction(confirmConfig.action)}
      title={confirmConfig.title}
      description={confirmConfig.description}
      type={confirmConfig.type}
      isLoading={confirmConfig.isLoading}
    />
    </>
  );
};

export const AdminMembersList = () => {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useMembers({ search });
  const members = data?.items || [];
  const { toast } = useToast();

  const filteredMembers = members;

  const stats = {
    total: filteredMembers.length,
    active: filteredMembers.filter((m: any) => m.status === 'active').length,
    admins: filteredMembers.filter((m: any) => m.role === 'ADMIN').length,
    suspended: filteredMembers.filter((m: any) => m.status === 'suspended').length,
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-text-primary mb-2">Member Directory</h1>
          <p className="text-sm text-text-muted">Manage user access, roles, and online presence across the workspace.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2" onClick={() => toast({ title: 'Export Started', description: 'Your member export is being generated.', type: 'success' })}>
            <Download className="w-4 h-4" /> Export
          </Button>
          <Link to="/admin/invitations">
            <Button className="gap-2">
              <UserPlus className="w-4 h-4" /> Invite Members
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Members', value: stats.total, icon: Users, color: 'text-brand-indigo', bg: 'bg-brand-indigo/10' },
          { label: 'Active Now', value: stats.active, icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Administrators', value: stats.admins, icon: ShieldCheck, color: 'text-purple-400', bg: 'bg-purple-500/10' },
          { label: 'Suspended', value: stats.suspended, icon: Ban, color: 'text-red-400', bg: 'bg-red-500/10' },
        ].map((stat, i) => (
          <div key={i} className="bg-surface border border-surface-border rounded-xl p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary leading-none">{stat.value}</p>
              <p className="text-xs text-text-muted mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or role..."
            className="w-full h-11 bg-surface border border-surface-border rounded-xl pl-10 pr-4 text-sm text-text-primary focus:outline-none focus:border-brand-indigo transition-colors"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-surface border border-surface-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-border bg-black/[0.02] dark:bg-background">
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Member</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Online Presence</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              
              {isLoading && (
                [1, 2, 3].map(i => (
                  <tr key={i}>
                    <td className="px-6 py-4"><div className="h-10 w-48 bg-surface-hover rounded animate-pulse" /></td>
                    <td className="px-6 py-4"><div className="h-6 w-24 bg-surface-hover rounded animate-pulse" /></td>
                    <td className="px-6 py-4"><div className="h-6 w-20 bg-surface-hover rounded animate-pulse" /></td>
                    <td className="px-6 py-4"><div className="h-6 w-20 bg-surface-hover rounded animate-pulse" /></td>
                    <td className="px-6 py-4 text-right"><div className="h-8 w-8 bg-surface-hover rounded animate-pulse inline-block" /></td>
                  </tr>
                ))
              )}

              {!isLoading && filteredMembers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-surface-hover mb-4">
                      <Search className="w-5 h-5 text-text-muted" />
                    </div>
                    <h3 className="text-base font-bold text-text-primary mb-1">No members found</h3>
                    <p className="text-sm text-text-muted">Adjust your search or filters to find what you're looking for.</p>
                  </td>
                </tr>
              )}

              {!isLoading && filteredMembers.map((member: any) => (
                <MemberRow key={member.id} member={member} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
