import React, { useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Download, RefreshCw, Users, FolderKanban, CheckSquare, FileBox, TrendingUp } from "lucide-react";
import { Button } from "../../components/ui/Button";

const statCards = [
  { id: "projects", label: "Active Projects", icon: FolderKanban, color: "text-brand-indigo", bg: "bg-brand-indigo/10" },
  { id: "tasks", label: "Completed Tasks", icon: CheckSquare, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { id: "members", label: "Team Members", icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
  { id: "files", label: "Files Stored", icon: FileBox, color: "text-brand-violet", bg: "bg-brand-violet/10" },
];

export const AnalyticsPage = () => {
  const [dateRange, setDateRange] = useState("30d");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Enforcement: Zero dummy analytics data. API-ready architecture.
  const hasData = false; 

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 h-full flex flex-col max-w-6xl mx-auto"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-text-primary mb-1">Analytics & Insights</h1>
          <p className="text-sm text-text-muted">Monitor workspace productivity, growth, and member activity.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <select className="h-9 rounded-lg border border-surface-border bg-surface-hover px-3 py-1 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-indigo/50">
            <option value="7d" className="bg-surface">Last 7 Days</option>
            <option value="30d" className="bg-surface">Last 30 Days</option>
            <option value="90d" className="bg-surface">Last 3 Months</option>
            <option value="year" className="bg-surface">This Year</option>
          </select>

          <Button 
            variant="outline" 
            size="sm" 
            className="bg-surface-hover border-surface-border hover:bg-surface h-9 w-9 p-0 justify-center"
            onClick={handleRefresh}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-brand-indigo" : ""}`} />
          </Button>

          <Button variant="outline" size="sm" className="bg-surface-hover border-surface-border hover:bg-surface h-9">
            <Download className="w-4 h-4 mr-2" /> Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards Scaffold */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-5 rounded-2xl border border-surface-border bg-black/[0.02] dark:bg-background"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <span className="text-[10px] font-bold text-text-muted bg-surface-hover px-1.5 py-0.5 rounded uppercase tracking-wider">Loading</span>
            </div>
            <div className="text-sm font-medium text-text-secondary mb-1">{stat.label}</div>
            <div className="text-3xl font-bold font-heading text-text-primary mb-2">--</div>
            <div className="flex items-center gap-1 text-xs text-text-muted">
              <TrendingUp className="w-3.5 h-3.5" /> Waiting for API
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Area */}
      <div className="flex-1 min-h-[400px] grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart */}
        <div className="lg:col-span-2 glass-card rounded-2xl border border-surface-border bg-black/[0.02] dark:bg-background p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-text-primary">Workspace Productivity</h3>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-brand-indigo/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-brand-indigo/20">
              <BarChart3 className="w-8 h-8 text-brand-indigo opacity-80" />
            </div>
            <p className="text-sm font-medium text-text-primary mb-1">No data available yet</p>
            <p className="text-xs text-text-muted max-w-xs">
              Productivity charts will appear here once tasks are completed and projects are active.
            </p>
          </div>
        </div>

        {/* Secondary Charts */}
        <div className="space-y-6 flex flex-col">
          
          <div className="flex-1 glass-card rounded-2xl border border-surface-border bg-black/[0.02] dark:bg-background p-6 flex flex-col">
             <div className="flex items-center justify-between mb-4">
               <h3 className="text-sm font-bold text-text-primary">Task Distribution</h3>
             </div>
             <div className="flex-1 flex items-center justify-center border-2 border-dashed border-surface-border rounded-xl">
               <span className="text-xs text-text-muted">Chart Scaffold</span>
             </div>
          </div>

          <div className="flex-1 glass-card rounded-2xl border border-surface-border bg-black/[0.02] dark:bg-background p-6 flex flex-col">
             <div className="flex items-center justify-between mb-4">
               <h3 className="text-sm font-bold text-text-primary">Member Activity</h3>
             </div>
             <div className="flex-1 flex items-center justify-center border-2 border-dashed border-surface-border rounded-xl">
               <span className="text-xs text-text-muted">Chart Scaffold</span>
             </div>
          </div>

        </div>

      </div>
    </motion.div>
  );
};
