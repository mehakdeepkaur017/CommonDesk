import React from 'react';
import { Zap, ShieldAlert, AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface Recommendation {
  priority: string;
  reason: string;
  resource: string;
  suggestedAction: string;
}

export const SmartRecommendations = ({ recommendations }: { recommendations: Recommendation[] }) => {
  const getPriorityStyles = (priority: string) => {
    switch(priority) {
      case 'Critical': return 'bg-red-500/10 border-red-500/20 text-red-500';
      case 'High': return 'bg-orange-400/10 border-orange-400/20 text-orange-400';
      case 'Medium': return 'bg-blue-500/10 border-blue-500/20 text-blue-500';
      default: return 'bg-surface-hover border-surface-border text-text-muted';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch(priority) {
      case 'Critical': return <ShieldAlert className="w-4 h-4 shrink-0" />;
      case 'High': return <AlertTriangle className="w-4 h-4 shrink-0" />;
      case 'Medium': return <AlertCircle className="w-4 h-4 shrink-0" />;
      default: return <Info className="w-4 h-4 shrink-0" />;
    }
  };

  return (
    <div className="bg-surface border border-surface-border p-5 rounded-2xl flex flex-col h-full">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg bg-yellow-500/10 text-yellow-500 flex items-center justify-center">
          <Zap className="w-4 h-4" />
        </div>
        <h3 className="text-lg font-bold text-text-primary">Smart Recommendations</h3>
      </div>
      
      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        {recommendations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <Zap className="w-8 h-8 text-text-muted mb-2 opacity-50" />
            <p className="text-sm font-medium text-text-muted">No recommendations at this time.</p>
          </div>
        ) : (
          recommendations.map((rec, idx) => (
            <div key={idx} className={`p-4 rounded-xl border ${getPriorityStyles(rec.priority)}`}>
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {getPriorityIcon(rec.priority)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase tracking-wider font-bold opacity-80">{rec.priority}</span>
                    <span className="text-[10px] uppercase tracking-wider font-bold opacity-50">• {rec.resource}</span>
                  </div>
                  <p className="text-sm font-bold text-text-primary mb-1">{rec.reason}</p>
                  <p className="text-sm font-medium opacity-90 leading-tight">Action: {rec.suggestedAction}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
