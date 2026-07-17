import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Download, Activity } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import type { ActivityLog } from "../../../types";
import { useActivity } from "../../../hooks/queries/useActivity";

export const ActivityLogPage = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useActivity({ page, limit: 50 });
  const activityLogs = data?.items || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 h-full flex flex-col"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-text-primary mb-1">Activity Log</h1>
          <p className="text-sm text-text-muted">Workspace audit trail and historical events.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative hidden lg:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input 
              type="text" 
              placeholder="Search logs..." 
              className="h-9 bg-surface-hover border border-surface-border rounded-lg pl-9 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-indigo/50 transition-all w-48 focus:w-64"
            />
          </div>

          <Button 
            variant="outline" 
            size="sm" 
            className={`bg-surface-hover border-surface-border hover:bg-surface h-9 w-9 p-0 justify-center ${filterOpen ? 'bg-surface' : ''}`}
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <Filter className="w-4 h-4" />
          </Button>

          <Button variant="outline" size="sm" className="bg-surface-hover border-surface-border hover:bg-surface h-9">
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
        </div>
      </div>

      {filterOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="flex flex-wrap items-center gap-4 p-4 rounded-xl border border-surface-border bg-black/[0.02] dark:bg-background"
        >
          <select className="h-9 rounded-lg border border-surface-border bg-surface-hover px-3 py-1 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-indigo/50 min-w-[140px]">
            <option value="all" className="bg-surface">All Time</option>
            <option value="today" className="bg-surface">Today</option>
            <option value="week" className="bg-surface">This Week</option>
            <option value="month" className="bg-surface">This Month</option>
          </select>
          
          <select className="h-9 rounded-lg border border-surface-border bg-surface-hover px-3 py-1 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-indigo/50 min-w-[140px]">
            <option value="all" className="bg-surface">All Members</option>
          </select>

          <select className="h-9 rounded-lg border border-surface-border bg-surface-hover px-3 py-1 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-indigo/50 min-w-[140px]">
            <option value="all" className="bg-surface">All Categories</option>
            <option value="projects" className="bg-surface">Projects</option>
            <option value="tasks" className="bg-surface">Tasks</option>
            <option value="files" className="bg-surface">Files</option>
            <option value="settings" className="bg-surface">Settings</option>
          </select>
        </motion.div>
      )}

      {/* Timeline Area */}
      <div className="flex-1 rounded-2xl border border-surface-border bg-black/[0.02] dark:bg-background p-8 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full min-h-[400px]">
            <div className="w-8 h-8 border-4 border-brand-indigo/20 border-t-brand-indigo rounded-full animate-spin" />
          </div>
        ) : activityLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center h-full min-h-[400px]">
            <div className="w-20 h-20 bg-gradient-to-br from-brand-indigo/20 to-brand-violet/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-surface-border">
              <Activity className="w-10 h-10 text-brand-indigo opacity-80" />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2 font-heading">No activity to show</h3>
            <p className="text-sm text-text-muted mb-8 max-w-sm">
              Workspace events will appear here once you and your team start collaborating.
            </p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
            {activityLogs.map((log: any) => (
              <div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-surface-border bg-surface shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_0_4px_var(--bg-background)] z-10">
                  <Activity className="w-4 h-4 text-brand-indigo" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-surface-border bg-surface shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-text-primary text-sm">{log.actor?.name || 'System'}</span>
                    <time className="text-xs text-text-muted font-medium">{new Date(log.createdAt).toLocaleString()}</time>
                  </div>
                  <div className="text-sm text-text-secondary">{log.action.replace(/_/g, ' ')}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};
