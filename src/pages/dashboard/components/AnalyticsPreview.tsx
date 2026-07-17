import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BarChart3 } from "lucide-react";

export const AnalyticsPreview = () => {
  return (
    <div className="glass-card rounded-3xl p-6 md:p-8 border border-surface-border bg-black/[0.02] dark:bg-background h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold font-heading text-text-primary">Analytics</h2>
          <p className="text-sm text-text-muted mt-1">Weekly performance overview.</p>
        </div>
        <Link to="/dashboard/analytics" className="hidden sm:flex items-center text-sm font-medium text-brand-indigo hover:text-brand-violet transition-colors">
          Full report <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-blue-500/20">
          <BarChart3 className="w-6 h-6 text-blue-400 opacity-80" />
        </div>
        <p className="text-sm text-text-muted">
          Analytics data is gathering and will appear here shortly.
        </p>
      </div>
    </div>
  );
};
