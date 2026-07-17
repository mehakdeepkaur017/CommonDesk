import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Download, Activity, AlertCircle, Search } from 'lucide-react';
import { useAnalytics } from '../../../hooks/queries/useAnalytics';
import { Button } from '../../../components/ui/Button';

// Modular Components
import { ExecutiveSummary } from './components/ExecutiveSummary';
import { TopPerformers } from './components/TopPerformers';
import { ExecutiveKPIs } from './components/ExecutiveKPIs';
import { ProjectPerformance } from './components/ProjectPerformance';
import { TeamProductivity } from './components/TeamProductivity';
import { TaskAnalytics } from './components/TaskAnalytics';
import { UpcomingWorkload } from './components/UpcomingWorkload';
import { DeadlineIntelligence } from './components/DeadlineIntelligence';
import { MemberActivityMonitor } from './components/MemberActivityMonitor';
const timeFilters = [
  { value: 'today', label: 'Today' },
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: 'this_month', label: 'This Month' },
  { value: 'this_quarter', label: 'This Quarter' },
  { value: 'all', label: 'All Time' },
];

export const AnalyticsCenter = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [searchQuery, setSearchQuery] = useState('');
  const { data, isLoading, error } = useAnalytics(timeRange);

  const filteredData = useMemo(() => {
    if (!data) return null;
    if (!searchQuery.trim()) return data;

    const q = searchQuery.toLowerCase();
    
    return {
      ...data,
      projectPerformance: data.projectPerformance.filter((p: any) => p.name.toLowerCase().includes(q)),
      teamProductivity: data.teamProductivity.filter((m: any) => m.name.toLowerCase().includes(q)),
      memberActivityMonitor: data.memberActivityMonitor.filter((m: any) => m.name.toLowerCase().includes(q)),
      activityTimeline: data.activityTimeline.filter((a: any) => 
        a.actorName.toLowerCase().includes(q) || 
        (a.projectName && a.projectName.toLowerCase().includes(q)) ||
        (a.taskTitle && a.taskTitle.toLowerCase().includes(q))
      )
    };
  }, [data, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Activity className="w-8 h-8 text-brand-indigo animate-bounce" />
          <p className="text-text-muted font-medium">Aggregating enterprise intelligence...</p>
        </div>
      </div>
    );
  }

  if (error || !filteredData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-text-primary mb-2">Analytics Unavailable</h3>
        <p className="text-text-muted mb-6">We encountered an issue while aggregating your workspace data. Please try again.</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  const handleExport = (format: 'pdf' | 'csv') => {
    if (format === 'pdf') {
      window.print();
    } else {
      alert(`Exporting Analytics as ${format.toUpperCase()}...`);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-16 max-w-7xl mx-auto">
      
      {/* Executive Summary */}
      <ExecutiveSummary summary={filteredData.executiveSummary} />

      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 py-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div>
          <h1 className="text-2xl font-bold font-heading text-text-primary mb-1">Intelligence Center</h1>
          <p className="text-sm text-text-muted">Enterprise-grade decisions backed by real-time data.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 print:hidden">
          <div className="relative w-full sm:w-auto">
            <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search projects, members..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 pl-9 pr-4 py-2 bg-surface border border-surface-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-brand-indigo shadow-sm"
            />
          </div>

          <div className="flex items-center bg-surface border border-surface-border rounded-lg p-1 shadow-sm overflow-x-auto w-full sm:w-auto">
            {timeFilters.map(filter => (
              <button
                key={filter.value}
                onClick={() => setTimeRange(filter.value)}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors whitespace-nowrap ${
                  timeRange === filter.value 
                    ? 'bg-brand-indigo text-white shadow-sm' 
                    : 'text-text-muted hover:text-text-primary hover:bg-surface-hover'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-surface-border mx-1 hidden xl:block" />

          <Button variant="outline" className="gap-2 text-xs w-full sm:w-auto justify-center" onClick={() => handleExport('pdf')}>
            <Download className="w-3 h-3" /> PDF
          </Button>
        </div>
      </div>

      <div className="space-y-8 mt-6">
        {/* Row 1: KPIs */}
        <ExecutiveKPIs kpis={filteredData.kpis} />

        {/* Row 2: Top Performers (Full Width) */}
        <TopPerformers performers={filteredData.topPerformers} />

        {/* Row 3: Deep Task Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TaskAnalytics analytics={filteredData.taskAnalytics} />
          <UpcomingWorkload forecast={filteredData.workloadForecast} />
        </div>

        {/* Row 4: Comparison Table */}
        <ProjectPerformance projects={filteredData.projectPerformance} />

        {/* Row 5: Member Activity & Legacy Deadlines (fallback) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <MemberActivityMonitor members={filteredData.memberActivityMonitor} />
          </div>
          <div className="lg:col-span-1">
            <DeadlineIntelligence deadlines={filteredData.upcomingDeadlines} />
          </div>
        </div>
      </div>

    </motion.div>
  );
};
