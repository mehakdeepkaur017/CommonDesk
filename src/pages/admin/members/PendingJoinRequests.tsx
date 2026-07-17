import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../components/feedback/ToastContext';
import { apiClient } from '../../../api/axios';

export const PendingJoinRequests = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedRequests, setSelectedRequests] = React.useState<string[]>([]);

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['workspace', 'join-requests'],
    queryFn: async () => {
      const res = await apiClient.get('/workspaces/current/join-requests');
      return res;
    }
  });

  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.post(`/workspaces/current/join-requests/${id}/approve`);
    },
    onSuccess: () => {
      toast({ title: 'Request Approved', description: 'User has been added as a Member.', type: 'success' });
      queryClient.invalidateQueries({ queryKey: ['workspace', 'join-requests'] });
      queryClient.invalidateQueries({ queryKey: ['workspace', 'members'] });
    }
  });

  const rejectMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.post(`/workspaces/current/join-requests/${id}/reject`);
    },
    onSuccess: () => {
      toast({ title: 'Request Rejected', description: 'Join request has been rejected.', type: 'info' });
      queryClient.invalidateQueries({ queryKey: ['workspace', 'join-requests'] });
    }
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRequests(requests.map((r: any) => r.id));
    } else {
      setSelectedRequests([]);
    }
  };

  const handleBulkApprove = async () => {
    if (selectedRequests.length === 0) return;
    toast({ title: 'Approving...', description: `Processing ${selectedRequests.length} requests.`, type: 'info' });
    try {
      await Promise.all(selectedRequests.map(id => apiClient.post(`/workspaces/current/join-requests/${id}/approve`)));
      queryClient.invalidateQueries({ queryKey: ['workspace', 'join-requests'] });
      queryClient.invalidateQueries({ queryKey: ['workspace', 'members'] });
      queryClient.invalidateQueries({ queryKey: ['workspace-stats'] });
      setSelectedRequests([]);
      toast({ title: 'Bulk Approved', description: `Approved ${selectedRequests.length} requests.`, type: 'success' });
    } catch {
      toast({ title: 'Error', description: 'Failed to approve some requests.', type: 'error' });
    }
  };

  const handleBulkReject = async () => {
    if (selectedRequests.length === 0) return;
    try {
      await Promise.all(selectedRequests.map(id => apiClient.post(`/workspaces/current/join-requests/${id}/reject`)));
      queryClient.invalidateQueries({ queryKey: ['workspace', 'join-requests'] });
      queryClient.invalidateQueries({ queryKey: ['workspace-stats'] });
      setSelectedRequests([]);
      toast({ title: 'Bulk Rejected', description: `Rejected ${selectedRequests.length} requests.`, type: 'info' });
    } catch {
      toast({ title: 'Error', description: 'Failed to reject some requests.', type: 'error' });
    }
  };

  if (isLoading) {
    return (
      <div className="bg-surface border border-surface-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-border bg-black/[0.02] dark:bg-background">
                <th className="px-6 py-4 w-10"></th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Requested At</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[1, 2, 3].map(i => (
                <tr key={i}>
                  <td className="px-6 py-4"><div className="h-4 w-4 bg-surface-hover rounded animate-pulse" /></td>
                  <td className="px-6 py-4"><div className="h-10 w-48 bg-surface-hover rounded animate-pulse" /></td>
                  <td className="px-6 py-4"><div className="h-6 w-24 bg-surface-hover rounded animate-pulse" /></td>
                  <td className="px-6 py-4"><div className="h-6 w-20 bg-surface-hover rounded animate-pulse" /></td>
                  <td className="px-6 py-4 flex justify-end gap-2"><div className="h-8 w-20 bg-surface-hover rounded animate-pulse inline-block" /><div className="h-8 w-24 bg-surface-hover rounded animate-pulse inline-block" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="bg-surface border border-surface-border rounded-2xl p-12 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-surface-hover mb-4">
          <Clock className="w-5 h-5 text-text-muted" />
        </div>
        <h3 className="text-lg font-bold text-text-primary mb-1">No pending requests</h3>
        <p className="text-sm text-text-muted">When users ask to join your workspace via the join code, they will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {selectedRequests.length > 0 && (
        <div className="bg-surface border border-surface-border p-4 rounded-xl flex items-center justify-between">
          <span className="text-sm font-medium text-text-primary">{selectedRequests.length} requests selected</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-red-500/20 text-red-400 hover:bg-red-500/10" onClick={handleBulkReject}>
              Reject Selected
            </Button>
            <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white" onClick={handleBulkApprove}>
              Approve Selected
            </Button>
          </div>
        </div>
      )}

      <div className="bg-surface border border-surface-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-border bg-black/[0.02] dark:bg-background">
                <th className="px-6 py-4 w-10">
                  <input type="checkbox" onChange={handleSelectAll} checked={selectedRequests.length === requests.length && requests.length > 0} className="rounded border-surface-border bg-surface-hover text-brand-indigo focus:ring-brand-indigo" />
                </th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Requested At</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
            {requests.map((request: any) => (
              <motion.tr 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                key={request.id} 
                className="hover:bg-black/[0.02] dark:bg-background transition-colors"
              >
                <td className="px-6 py-4">
                  <input type="checkbox" checked={selectedRequests.includes(request.id)} onChange={(e) => {
                    if (e.target.checked) setSelectedRequests([...selectedRequests, request.id]);
                    else setSelectedRequests(selectedRequests.filter(id => id !== request.id));
                  }} className="rounded border-surface-border bg-surface-hover text-brand-indigo focus:ring-brand-indigo" />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-indigo to-brand-violet flex items-center justify-center text-sm font-bold text-text-primary shrink-0">
                      {request.user.name.split(' ').map((n: any) => n[0]).join('').substring(0,2)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-text-primary">{request.user.name}</p>
                      <p className="text-xs text-text-muted">{request.user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-text-secondary">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-surface-hover text-text-primary">
                    MEMBER
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                      onClick={() => rejectMutation.mutate(request.id)}
                      disabled={rejectMutation.isPending || approveMutation.isPending}
                    >
                      <XCircle className="w-4 h-4 mr-1" /> Reject
                    </Button>
                    <Button 
                      size="sm"
                      className="bg-emerald-500 hover:bg-emerald-600 text-white"
                      onClick={() => approveMutation.mutate(request.id)}
                      disabled={approveMutation.isPending || rejectMutation.isPending}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1" /> Approve
                    </Button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
};
