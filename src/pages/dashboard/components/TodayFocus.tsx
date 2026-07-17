import React from "react";
import { CheckCircle2, Circle, CheckSquare, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import type { Task } from "../../../types";
import { useAuth } from "../../../context/AuthContext";
import { useTasks } from "../../../hooks/queries/useTasks";
import { Link } from "react-router-dom";

export const TodayFocus = () => {
  const { user } = useAuth();
  const { data, isLoading } = useTasks({ assigneeId: user?.id, status: 'todo' });
  const tasks = data?.items?.slice(0, 5) || [];

  return (
    <section className="p-6 rounded-2xl bg-black/[0.02] dark:bg-background border border-surface-border min-h-[300px] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-emerald-500" /> Today's Focus
          </h3>
          <p className="text-xs text-text-muted">Tasks requiring your attention.</p>
        </div>
        <Link to="/dashboard/tasks" className="text-xs text-brand-indigo hover:text-brand-indigo/80 font-medium">View All Tasks</Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center relative">
        {isLoading ? (
          <div className="w-full space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 w-full bg-surface-hover rounded-xl animate-pulse" />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-surface-border rounded-xl bg-black/[0.01] dark:bg-background h-[200px] w-full">
            <CheckSquare className="w-12 h-12 text-black/10 dark:text-white/10 mb-4" />
            <p className="text-sm font-medium text-text-muted">You're all caught up!</p>
            <p className="text-xs text-text-muted mt-1">There are no pending tasks assigned to you for today.</p>
          </div>
        ) : (
          <div className="w-full space-y-4">
             {tasks.map((task: any) => (
                <Link to={`/dashboard/tasks`} key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-surface hover:bg-surface-hover border border-surface-border transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0 group-hover:scale-105 transition-transform">
                      <CheckSquare className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-text-primary">{task.title}</p>
                      <p className="text-xs text-text-muted mt-0.5">{task.project?.name || 'No Project'}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-surface-border group-hover:text-emerald-500 transition-colors" />
                </Link>
             ))}
          </div>
        )}
      </div>
    </section>
  );
};
