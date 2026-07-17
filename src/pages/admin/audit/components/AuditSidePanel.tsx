import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldAlert, Clock, User, Globe, Activity, FileJson } from 'lucide-react';

interface AuditSidePanelProps {
  log: any | null;
  onClose: () => void;
}

export const AuditSidePanel = ({ log, onClose }: AuditSidePanelProps) => {
  if (!log) return null;

  let metadata = null;
  try {
    if (log.details) {
      metadata = JSON.parse(log.details);
    }
  } catch (e) {
    // Ignore JSON parse error
  }

  const renderBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return <span className="px-2 py-1 rounded bg-red-500/10 text-red-500 text-xs font-bold border border-red-500/20">CRITICAL</span>;
      case 'ERROR': return <span className="px-2 py-1 rounded bg-orange-500/10 text-orange-500 text-xs font-bold border border-orange-500/20">ERROR</span>;
      case 'WARNING': return <span className="px-2 py-1 rounded bg-yellow-500/10 text-yellow-500 text-xs font-bold border border-yellow-500/20">WARNING</span>;
      default: return <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-500 text-xs font-bold border border-emerald-500/20">INFO</span>;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex justify-end"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full max-w-md h-full bg-surface border-l border-surface-border shadow-2xl flex flex-col z-50"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-surface-border shrink-0 bg-surface-hover">
            <div>
              <h2 className="text-lg font-bold font-heading text-text-primary">Event Details</h2>
              <p className="text-xs text-text-muted mt-1">{log.id}</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-surface-border text-text-muted hover:text-text-primary transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Primary Details */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-text-muted">Severity</span>
                {renderBadge(log.severity)}
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-text-muted">Event Action</span>
                <span className="text-sm font-bold text-text-primary">{log.action}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-text-muted">Timestamp</span>
                <div className="flex items-center gap-2 text-sm text-text-primary">
                  <Clock className="w-4 h-4 text-text-muted" />
                  {new Date(log.createdAt).toLocaleString()}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-text-muted">Actor</span>
                <div className="flex items-center gap-2 text-sm text-text-primary">
                  {log.user?.avatarUrl ? (
                    <img src={log.user.avatarUrl} alt="Avatar" className="w-5 h-5 rounded-full" />
                  ) : (
                    <User className="w-4 h-4 text-text-muted" />
                  )}
                  {log.user?.name || 'System User'}
                </div>
              </div>
            </div>

            <hr className="border-surface-border" />

            {/* Target Entity */}
            <div>
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4" /> Entity Targeted
              </h3>
              <div className="bg-surface-hover rounded-xl p-4 space-y-3 border border-surface-border">
                <div className="flex justify-between">
                  <span className="text-xs text-text-muted">Type</span>
                  <span className="text-xs font-bold text-text-primary">{log.entityType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-text-muted">Name</span>
                  <span className="text-xs font-bold text-text-primary">{log.entityName || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-text-muted">ID</span>
                  <span className="text-[10px] font-mono text-text-primary break-all ml-4 text-right">{log.entityId}</span>
                </div>
              </div>
            </div>

            <hr className="border-surface-border" />

            {/* Network Details */}
            <div>
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
                <Globe className="w-4 h-4" /> Client Details
              </h3>
              <div className="bg-surface-hover rounded-xl p-4 space-y-3 border border-surface-border">
                <div className="flex justify-between">
                  <span className="text-xs text-text-muted">IP Address</span>
                  <span className="text-xs font-mono text-text-primary">{log.ipAddress || 'Unknown'}</span>
                </div>
                <div>
                  <span className="text-xs text-text-muted block mb-1">User Agent</span>
                  <p className="text-[10px] text-text-primary leading-relaxed break-words bg-background p-2 rounded border border-surface-border/50">
                    {log.userAgent || 'Unknown Agent'}
                  </p>
                </div>
              </div>
            </div>

            {/* Metadata Payload */}
            {metadata && (
              <>
                <hr className="border-surface-border" />
                <div>
                  <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
                    <FileJson className="w-4 h-4" /> Metadata Payload
                  </h3>
                  <div className="bg-[#1e1e1e] rounded-xl p-4 overflow-x-auto border border-surface-border">
                    <pre className="text-[11px] text-[#d4d4d4] font-mono whitespace-pre-wrap">
                      {JSON.stringify(metadata, null, 2)}
                    </pre>
                  </div>
                </div>
              </>
            )}

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
