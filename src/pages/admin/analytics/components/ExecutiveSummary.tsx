import React from 'react';
import { Target } from 'lucide-react';

interface ExecutiveSummaryProps {
  summary: string;
}

export const ExecutiveSummary = ({ summary }: ExecutiveSummaryProps) => {
  return (
    <div className="bg-gradient-to-r from-brand-indigo to-brand-violet rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
      <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold font-heading">Executive Summary</h2>
        </div>
        <p className="text-lg font-medium leading-relaxed max-w-4xl opacity-95">
          {summary || "No sufficient data to generate a workspace summary."}
        </p>
      </div>
    </div>
  );
};
