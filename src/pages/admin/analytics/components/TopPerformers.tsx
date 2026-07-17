import React from 'react';
import { Medal, Trophy, Award, Star } from 'lucide-react';

interface TopPerformersProps {
  performers: {
    mostTasksCompleted: { name: string, value: string } | null;
    highestCompletionRate: { name: string, value: string } | null;
    mostActiveMember: { name: string, value: string } | null;
    bestProject: { name: string, value: string } | null;
  }
}

export const TopPerformers = ({ performers }: TopPerformersProps) => {
  const renderCard = (title: string, icon: React.ReactNode, data: { name: string, value: string } | null, bgClass: string, textClass: string) => {
    return (
      <div className={`p-4 rounded-xl border border-surface-border bg-black/[0.02] dark:bg-white/[0.02] flex items-center justify-between group overflow-hidden relative`}>
        <div className={`absolute top-0 right-0 w-16 h-16 ${bgClass} opacity-10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-125`} />
        <div>
          <p className="text-xs font-bold text-text-muted mb-1 flex items-center gap-1.5">
            {icon} {title}
          </p>
          {data ? (
            <>
              <h4 className="text-lg font-black text-text-primary">{data.name}</h4>
              <p className={`text-xs font-bold mt-1 ${textClass}`}>{data.value}</p>
            </>
          ) : (
            <p className="text-sm font-medium text-text-muted italic">Not enough data</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-surface border border-surface-border p-5 rounded-2xl flex flex-col h-full">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center">
          <Trophy className="w-4 h-4" />
        </div>
        <h3 className="text-lg font-bold text-text-primary">Top Performers Leaderboard</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {renderCard(
          "Most Tasks Completed", 
          <Medal className="w-3.5 h-3.5 text-yellow-500" />, 
          performers.mostTasksCompleted, 
          "bg-yellow-500", 
          "text-yellow-500"
        )}
        
        {renderCard(
          "Highest Completion", 
          <Medal className="w-3.5 h-3.5 text-gray-400" />, 
          performers.highestCompletionRate, 
          "bg-gray-400", 
          "text-gray-400"
        )}
        
        {renderCard(
          "Most Active Member", 
          <Award className="w-3.5 h-3.5 text-orange-600" />, 
          performers.mostActiveMember, 
          "bg-orange-600", 
          "text-orange-600"
        )}
        
        {renderCard(
          "Best Project", 
          <Star className="w-3.5 h-3.5 text-brand-indigo" />, 
          performers.bestProject, 
          "bg-brand-indigo", 
          "text-brand-indigo"
        )}
      </div>
    </div>
  );
};
