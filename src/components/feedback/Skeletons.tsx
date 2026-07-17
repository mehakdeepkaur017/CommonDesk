import React from "react";

export const CardSkeleton = () => (
  <div className="glass-card rounded-2xl border border-surface-border bg-black/[0.02] dark:bg-background p-5 animate-pulse">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-12 h-12 rounded-xl bg-surface-hover"></div>
      <div className="space-y-2 flex-1">
        <div className="h-4 bg-surface-hover rounded w-1/3"></div>
        <div className="h-3 bg-surface-hover rounded w-1/4"></div>
      </div>
    </div>
    <div className="space-y-2 mb-6">
      <div className="h-3 bg-surface-hover rounded w-full"></div>
      <div className="h-3 bg-surface-hover rounded w-5/6"></div>
    </div>
    <div className="flex items-center justify-between pt-4 border-t border-surface-border">
      <div className="w-16 h-3 bg-surface-hover rounded"></div>
      <div className="w-8 h-8 rounded-full bg-surface-hover"></div>
    </div>
  </div>
);

export const TableSkeleton = ({ rows = 5 }: { rows?: number }) => (
  <div className="w-full animate-pulse border border-surface-border rounded-2xl bg-black/[0.02] dark:bg-background overflow-hidden">
    <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border bg-black/[0.01] dark:bg-background">
      <div className="h-4 bg-surface-hover rounded w-1/4"></div>
      <div className="h-4 bg-surface-hover rounded w-1/6"></div>
      <div className="h-4 bg-surface-hover rounded w-1/6 hidden sm:block"></div>
      <div className="h-4 bg-surface-hover rounded w-1/6 hidden sm:block"></div>
    </div>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center justify-between px-6 py-4 border-b border-surface-border last:border-0">
        <div className="flex items-center gap-3 w-1/4">
          <div className="w-8 h-8 rounded-full bg-surface-hover shrink-0"></div>
          <div className="h-3 bg-surface-hover rounded w-24"></div>
        </div>
        <div className="h-3 bg-surface-hover rounded w-16"></div>
        <div className="h-3 bg-surface-hover rounded w-20 hidden sm:block"></div>
        <div className="h-8 w-8 bg-surface-hover rounded-lg hidden sm:block"></div>
      </div>
    ))}
  </div>
);

export const ChartSkeleton = () => (
  <div className="w-full h-full min-h-[300px] rounded-2xl border border-surface-border bg-black/[0.02] dark:bg-background p-6 flex flex-col animate-pulse">
    <div className="flex items-center justify-between mb-8">
      <div className="h-5 bg-surface-hover rounded w-40"></div>
      <div className="h-8 w-24 bg-surface-hover rounded-lg"></div>
    </div>
    <div className="flex-1 flex items-end gap-2">
      {Array.from({ length: 12 }).map((_, i) => (
        <div 
          key={i} 
          className="flex-1 bg-surface-hover rounded-t-sm" 
          style={{ height: `${Math.max(20, Math.random() * 100)}%` }}
        />
      ))}
    </div>
  </div>
);
