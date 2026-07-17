import React, { useState } from "react";
import type { Task } from "../../types";
import { MessageSquare, Paperclip, Clock, CheckCircle2, Circle, MoreHorizontal } from "lucide-react";
import { TaskSlideOut } from "./TaskSlideOut";
import { useUpdateTask } from "../../hooks/queries/useTasks";
import { motion } from "framer-motion";

interface Props {
  tasks: Task[];
}

export const TaskListView = ({ tasks }: Props) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const updateTask = useUpdateTask();

  const handleToggleStatus = (e: React.MouseEvent, task: Task) => {
    e.stopPropagation();
    const newStatus = task.status === "done" ? "todo" : "done";
    updateTask.mutate({ taskId: task.id, data: { status: newStatus } });
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-black/[0.02] dark:bg-background border border-surface-border rounded-2xl">
      <div className="grid grid-cols-12 gap-4 p-4 border-b border-surface-border bg-surface-hover/50 text-xs font-semibold text-text-muted uppercase tracking-wider">
        <div className="col-span-6 sm:col-span-5">Task Name</div>
        <div className="col-span-3 sm:col-span-2">Status</div>
        <div className="hidden sm:block col-span-2">Due Date</div>
        <div className="hidden sm:block col-span-2">Priority</div>
        <div className="col-span-3 sm:col-span-1 text-right">Actions</div>
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 p-2 space-y-1">
        {tasks.map((task, i) => (
          <motion.div 
            key={task.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setSelectedTask(task)}
            className="grid grid-cols-12 gap-4 p-3 items-center rounded-xl hover:bg-surface-hover cursor-pointer transition-colors group"
          >
            <div className="col-span-6 sm:col-span-5 flex items-center gap-3 overflow-hidden">
              <button 
                onClick={(e) => handleToggleStatus(e, task)}
                className={`shrink-0 ${task.status === "done" ? "text-emerald-500" : "text-text-muted hover:text-brand-indigo transition-colors"}`}
              >
                {task.status === "done" ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
              </button>
              <div className="truncate">
                <div className={`text-sm font-medium truncate ${task.status === "done" ? "text-text-muted line-through" : "text-text-primary"}`}>
                  {task.title}
                </div>
                <div className="flex items-center gap-3 text-xs text-text-muted mt-0.5">
                  {(task.comments?.length ?? 0) > 0 && (
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" /> {task.comments?.length}
                    </span>
                  )}
                  {(task.attachments?.length ?? 0) > 0 && (
                    <span className="flex items-center gap-1">
                      <Paperclip className="w-3 h-3" /> {task.attachments?.length}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="col-span-3 sm:col-span-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                task.status === "done" ? "bg-emerald-500/20 text-emerald-400" :
                task.status === "review" ? "bg-purple-500/20 text-purple-400" :
                task.status === "in_progress" ? "bg-blue-500/20 text-blue-400" :
                "bg-surface border border-surface-border text-text-secondary"
              }`}>
                {task.status.replace("_", " ")}
              </span>
            </div>

            <div className="hidden sm:flex col-span-2 items-center gap-1.5 text-xs text-text-secondary">
              <Clock className="w-3.5 h-3.5" />
              {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No date"}
            </div>

            <div className="hidden sm:block col-span-2">
              {task.priority && (
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  task.priority === "high" ? "bg-red-500/20 text-red-400" :
                  task.priority === "medium" ? "bg-amber-400/20 text-amber-400" :
                  "bg-emerald-500/20 text-emerald-400"
                }`}>
                  {task.priority}
                </span>
              )}
            </div>

            <div className="col-span-3 sm:col-span-1 flex items-center justify-end">
              <button 
                onClick={(e) => { e.stopPropagation(); /* Menu logic */ }}
                className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface opacity-0 group-hover:opacity-100 transition-all"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedTask && (
        <TaskSlideOut task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </div>
  );
};
