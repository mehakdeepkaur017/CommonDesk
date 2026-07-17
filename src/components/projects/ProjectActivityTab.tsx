import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, MessageSquare, CheckSquare, FileText, UserPlus, FolderKanban, LogIn, Clock } from "lucide-react";
import { useActivity } from "../../hooks/queries/useActivity";

interface Props {
  projectId: string;
}

export const ProjectActivityTab = ({ projectId }: Props) => {
  const { data: activityData, isLoading } = useActivity({ projectId, limit: 50 });
  const activities = activityData?.items || [];

  const getActivityConfig = (action: string) => {
    switch (action) {
      case "PROJECT_CREATED":
        return { icon: FolderKanban, color: "text-emerald-500", bg: "bg-emerald-500/10", label: "created the project" };
      case "PROJECT_UPDATED":
        return { icon: Activity, color: "text-amber-500", bg: "bg-amber-500/10", label: "updated project settings" };
      case "TASK_CREATED":
        return { icon: CheckSquare, color: "text-brand-indigo", bg: "bg-brand-indigo/10", label: "created a new task" };
      case "TASK_UPDATED":
        return { icon: Activity, color: "text-brand-indigo", bg: "bg-brand-indigo/10", label: "updated a task" };
      case "FILE_UPLOADED":
        return { icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10", label: "uploaded a file" };
      case "FILE_DELETED":
        return { icon: FileText, color: "text-rose-500", bg: "bg-rose-500/10", label: "deleted a file" };
      case "PROJECT_MEMBER_ADDED":
        return { icon: UserPlus, color: "text-purple-500", bg: "bg-purple-500/10", label: "added a member" };
      case "PROJECT_MEMBER_REMOVED":
        return { icon: UserPlus, color: "text-rose-500", bg: "bg-rose-500/10", label: "removed a member" };
      default:
        return { icon: Activity, color: "text-text-muted", bg: "bg-surface-border", label: "performed an action" };
    }
  };

  const parseDetails = (details: string | null) => {
    if (!details) return null;
    try {
      return JSON.parse(details);
    } catch {
      return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <div className="w-8 h-8 border-4 border-brand-indigo/20 border-t-brand-indigo rounded-full animate-spin" />
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center p-16 text-text-muted bg-surface/30 rounded-2xl border border-surface-border border-dashed">
        <Activity className="w-12 h-12 mx-auto mb-4 opacity-20" />
        <h3 className="text-lg font-bold text-text-primary mb-1">No activity yet</h3>
        <p className="text-sm">Activity will appear here when tasks are created, members are added, etc.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="bg-surface border border-surface-border rounded-2xl p-6">
        <h3 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-brand-indigo" /> Project Timeline
        </h3>
        
        <div className="relative pl-6 border-l-2 border-surface-border space-y-8 pb-4">
          <AnimatePresence>
            {activities.map((activity: any, index: number) => {
              const config = getActivityConfig(activity.action);
              const details = parseDetails(activity.details);
              
              return (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={activity.id}
                  className="relative"
                >
                  <div className={`absolute -left-[37px] top-1 w-8 h-8 rounded-full flex items-center justify-center border-4 border-surface ${config.bg} ${config.color} shadow-sm z-10`}>
                    <config.icon className="w-3.5 h-3.5" />
                  </div>
                  
                  <div className="bg-background border border-surface-border rounded-xl p-4 shadow-sm hover:border-brand-indigo/30 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-sm text-text-primary">
                        <span className="font-bold text-brand-indigo cursor-pointer hover:underline">{activity.actor.name}</span>
                        {" "}<span className="text-text-muted">{config.label}</span>
                      </p>
                      <span className="text-xs text-text-muted whitespace-nowrap ml-4">
                        {new Date(activity.createdAt).toLocaleString(undefined, {
                          month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
                        })}
                      </span>
                    </div>
                    
                    {details && (
                      <div className="mt-2 text-sm text-text-secondary bg-surface-hover rounded-lg p-3 border border-surface-border/50">
                        {activity.action === "TASK_CREATED" && details.title && (
                          <span className="font-medium">"{details.title}"</span>
                        )}
                        {activity.action === "FILE_UPLOADED" && details.filename && (
                          <span className="font-medium text-blue-500/90">{details.filename}</span>
                        )}
                        {activity.action === "PROJECT_MEMBER_ADDED" && details.addedUserId && (
                          <span className="font-medium">New member added</span>
                        )}
                        {/* Fallback for other details */}
                        {!(activity.action === "TASK_CREATED" && details.title) &&
                         !(activity.action === "FILE_UPLOADED" && details.filename) &&
                         !(activity.action === "PROJECT_MEMBER_ADDED" && details.addedUserId) && (
                          <pre className="text-xs whitespace-pre-wrap font-mono text-text-muted">
                            {JSON.stringify(details, null, 2)}
                          </pre>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
