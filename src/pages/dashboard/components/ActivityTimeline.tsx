import React from "react";
import { Activity } from "lucide-react";
import type { ActivityLog } from "../../../types";

export const ActivityTimeline = () => {
  const activities: ActivityLog[] = [];
  const isLoading = false;

  return (
    <div className="glass-card rounded-3xl p-6 md:p-8 border border-surface-border bg-black/[0.02] dark:bg-background flex flex-col min-h-[400px]">
      <div className="mb-6">
        <h2 className="text-xl font-bold font-heading text-text-primary">Recent Activity</h2>
        <p className="text-sm text-text-muted mt-1">Latest updates across the workspace.</p>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        {isLoading ? (
          <div className="text-sm text-text-muted">Loading activity...</div>
        ) : activities.length === 0 ? (
          <div className="max-w-xs mx-auto">
            <div className="w-16 h-16 bg-brand-indigo/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-brand-indigo/20">
              <Activity className="w-8 h-8 text-brand-indigo opacity-80" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">No recent activity</h3>
            <p className="text-sm text-text-muted">
              Activity logs will appear here once your team starts collaborating.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};
