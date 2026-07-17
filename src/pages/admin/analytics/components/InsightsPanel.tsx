import React from 'react';
import { Lightbulb, Sparkles } from 'lucide-react';

export const InsightsPanel = ({ insights }: { insights: string[] }) => {
  return (
    <div className="h-full border border-brand-violet/20 bg-gradient-to-br from-brand-indigo/5 to-brand-violet/5 p-6 rounded-2xl flex flex-col justify-between">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-brand-violet/10 text-brand-violet flex items-center justify-center">
          <Sparkles className="w-4 h-4" />
        </div>
        <h3 className="text-lg font-bold text-brand-violet">Algorithmic Insights</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight, idx) => (
          <div key={idx} className="flex items-start gap-3 bg-white/40 dark:bg-black/20 p-4 rounded-xl border border-white/20 dark:border-white/5">
            <Lightbulb className="w-5 h-5 text-brand-violet shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-text-primary leading-relaxed">{insight}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
