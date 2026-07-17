import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Filter, Download, Calendar, Activity, 
  ShieldAlert, AlertCircle, Clock, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../components/feedback/ToastContext';
import { useAudit } from '../../../hooks/queries/useAudit';
import { AuditSidePanel } from './components/AuditSidePanel';
import { apiClient } from '../../../api/axios';
import { useWorkspace } from '../../../hooks/queries/useWorkspace';

const EVENT_MAP: Record<string, string> = {
  "WORKSPACE_CREATED": "Workspace created",
  "WORKSPACE_UPDATED": "Workspace settings updated",
  "WORKSPACE_DELETED": "Workspace deleted",
  "MEMBER_INVITED": "Invited a new member",
  "MEMBER_JOINED": "Member joined workspace",
  "MEMBER_JOIN_REQUESTED": "New join request submitted",
  "MEMBER_SUSPENDED": "Suspended member",
  "MEMBER_REMOVED": "Removed member",
  "MEMBER_REACTIVATED": "Reactivated member",
  "ROLE_UPDATED": "Updated member role",
  "ROLE_CREATED": "Created a custom role",
  "ROLE_DELETED": "Deleted a custom role",
  "PROJECT_CREATED": "Created a new project",
  "PROJECT_UPDATED": "Updated project details",
  "PROJECT_DELETED": "Deleted project",
  "PROJECT_ARCHIVED": "Archived project",
  "TASK_CREATED": "Created a task",
  "TASK_UPDATED": "Updated a task",
  "TASK_DELETED": "Deleted a task",
  "FILE_UPLOADED": "Uploaded a file",
  "FILE_DELETED": "Deleted a file",
  "FILE_RENAMED": "Renamed a file",
  "FILE_ARCHIVED": "Archived a file",
  "FILE_RESTORED": "Restored a file",
  "FILE_UPDATED": "Updated a file",
  "FILE_VERSION_CREATED": "Uploaded a new file version",
  "INVITATION_CREATED": "Created an invitation",
  "INVITATION_REVOKED": "Revoked an invitation",
  "LOGIN": "Logged in",
  "FAILED_LOGIN": "Failed login attempt",
};

export const AuditCenter = () => {
  const { data: workspace } = useWorkspace();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('');
  const [severity, setSeverity] = useState('');
  const [selectedLog, setSelectedLog] = useState<any | null>(null);

  const { toast } = useToast();

  // Debounce search
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const { data, isLoading, isError } = useAudit({
    page,
    limit: 15,
    q: debouncedSearch || undefined,
    category: category || undefined,
    severity: severity || undefined,
  });

  const logs = data?.logs || [];
  const pagination = data?.pagination;

  const handleExportCSV = async () => {
    try {
      toast({ title: 'Export Started', description: 'Your security log export is being generated.', type: 'info' });
      
      const res = await apiClient.get('/workspaces/current/audit-logs', {
        params: {
          q: debouncedSearch || undefined,
          category: category || undefined,
          severity: severity || undefined,
          limit: 10000 // Export up to 10k logs
        }
      });

      const exportLogs = (res as any).logs || [];
      if (exportLogs.length === 0) {
        toast({ title: 'Export Failed', description: 'No logs found to export.', type: 'error' });
        return;
      }

      // Build CSV
      const headers = ['Timestamp', 'Action', 'Category', 'Severity', 'Actor', 'Actor Email', 'Entity Type', 'Entity Name', 'Entity ID', 'IP Address', 'User Agent', 'Details'];
      const csvContent = [
        headers.join(','),
        ...exportLogs.map((log: any) => [
          `"${new Date(log.createdAt).toISOString()}"`,
          `"${log.action}"`,
          `"${log.category}"`,
          `"${log.severity}"`,
          `"${log.user?.name || 'System'}"`,
          `"${log.user?.email || ''}"`,
          `"${log.entityType}"`,
          `"${log.entityName || ''}"`,
          `"${log.entityId}"`,
          `"${log.ipAddress || ''}"`,
          `"${(log.userAgent || '').replace(/"/g, '""')}"`,
          `"${(log.details || '').replace(/"/g, '""')}"`
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `Audit_Export_${workspace?.slug || 'workspace'}_${new Date().getTime()}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({ title: 'Export Complete', description: 'CSV file downloaded successfully.', type: 'success' });
    } catch (err) {
      console.error(err);
      toast({ title: 'Export Failed', description: 'Could not generate CSV export.', type: 'error' });
    }
  };

  const renderBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL': return <span className="px-2 py-1 rounded bg-red-500/10 text-red-500 text-xs font-bold border border-red-500/20">CRITICAL</span>;
      case 'ERROR': return <span className="px-2 py-1 rounded bg-orange-500/10 text-orange-500 text-xs font-bold border border-orange-500/20">ERROR</span>;
      case 'WARNING': return <span className="px-2 py-1 rounded bg-yellow-500/10 text-yellow-500 text-xs font-bold border border-yellow-500/20">WARNING</span>;
      default: return <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-500 text-xs font-bold border border-emerald-500/20">INFO</span>;
    }
  };

  const getReadableEvent = (log: any) => {
    const readableAction = EVENT_MAP[log.action] || log.action.replace(/_/g, ' ').toLowerCase();
    const actor = log.user?.name ? log.user.name.split(' ')[0] : 'System';
    
    if (log.entityName) {
      return `${actor} ${readableAction} "${log.entityName}"`;
    }
    return `${actor} ${readableAction} (${log.entityType})`;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-text-primary mb-1">Audit Center</h1>
          <p className="text-sm text-text-muted">Immutable organizational activity logs for compliance and security.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2" onClick={handleExportCSV}>
            <Download className="w-4 h-4" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="bg-surface border border-surface-border rounded-2xl p-4 flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events, IP addresses, or users..."
            className="w-full h-10 bg-surface-hover border border-surface-border rounded-lg pl-10 pr-4 text-sm text-text-primary focus:outline-none focus:border-brand-indigo transition-colors"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select 
            className="h-10 px-3 bg-surface-hover border border-surface-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-brand-indigo"
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          >
            <option value="">All Categories</option>
            <option value="Workspace">Workspace</option>
            <option value="Members">Members</option>
            <option value="Projects">Projects</option>
            <option value="Tasks">Tasks</option>
            <option value="Files">Files</option>
            <option value="Security">Security</option>
          </select>

          <select 
            className="h-10 px-3 bg-surface-hover border border-surface-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-brand-indigo"
            value={severity}
            onChange={(e) => { setSeverity(e.target.value); setPage(1); }}
          >
            <option value="">All Severities</option>
            <option value="INFO">INFO</option>
            <option value="WARNING">WARNING</option>
            <option value="ERROR">ERROR</option>
            <option value="CRITICAL">CRITICAL</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-surface border border-surface-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-surface-border bg-black/[0.02] dark:bg-background">
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider w-48">Timestamp</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Event</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider w-40">Actor</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider w-36">IP Address</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider w-32">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider w-24 text-right">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              
              {isLoading && (
                [1, 2, 3, 4, 5].map(i => (
                  <tr key={i}>
                    <td className="px-6 py-4"><div className="h-5 w-32 bg-surface-hover rounded animate-pulse" /></td>
                    <td className="px-6 py-4"><div className="h-5 w-48 bg-surface-hover rounded animate-pulse" /></td>
                    <td className="px-6 py-4"><div className="h-5 w-32 bg-surface-hover rounded animate-pulse" /></td>
                    <td className="px-6 py-4"><div className="h-5 w-24 bg-surface-hover rounded animate-pulse" /></td>
                    <td className="px-6 py-4"><div className="h-5 w-24 bg-surface-hover rounded animate-pulse" /></td>
                    <td className="px-6 py-4 text-right"><div className="h-5 w-16 bg-surface-hover rounded animate-pulse ml-auto" /></td>
                  </tr>
                ))
              )}

              {!isLoading && logs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-surface-hover mb-4 border border-surface-border">
                      <Activity className="w-5 h-5 text-text-muted" />
                    </div>
                    <h3 className="text-sm font-bold text-text-primary mb-1">No audit events have been recorded yet.</h3>
                    <p className="text-xs text-text-muted max-w-sm mx-auto">Activity will automatically appear as members interact with the workspace.</p>
                  </td>
                </tr>
              )}
              
              {!isLoading && logs.map((log: any) => (
                <tr 
                  key={log.id} 
                  onClick={() => setSelectedLog(log)}
                  className="hover:bg-surface-hover cursor-pointer transition-colors group"
                >
                  <td className="px-6 py-4 text-xs text-text-muted whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-primary font-medium group-hover:text-brand-indigo transition-colors">
                    {getReadableEvent(log)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-text-primary">
                      {log.user?.avatarUrl ? (
                        <img src={log.user.avatarUrl} alt="" className="w-5 h-5 rounded-full" />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-surface-hover border border-surface-border flex items-center justify-center">
                          <User className="w-3 h-3 text-text-muted" />
                        </div>
                      )}
                      {log.user?.name || "System"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-text-muted">
                    {log.ipAddress || "-"}
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-text-muted tracking-wider">
                    {log.category}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {renderBadge(log.severity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        {!isLoading && pagination && pagination.totalPages > 1 && (
          <div className="border-t border-surface-border p-4 flex items-center justify-between bg-black/[0.01] dark:bg-white/[0.01]">
            <div className="text-xs text-text-muted font-medium">
              Showing {(page - 1) * pagination.limit + 1} to {Math.min(page * pagination.limit, pagination.total)} of {pagination.total} events
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                className="h-8 w-8 p-0" 
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="text-xs font-bold text-text-primary px-2">{page} / {pagination.totalPages}</div>
              <Button 
                variant="outline" 
                className="h-8 w-8 p-0" 
                disabled={page === pagination.totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <AuditSidePanel log={selectedLog} onClose={() => setSelectedLog(null)} />
    </motion.div>
  );
};
