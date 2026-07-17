import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Clock, MessageSquare, Paperclip } from "lucide-react";
import type { Task } from "../../types";

interface Props {
  task: Task;
  isOverlay?: boolean;
  onClick?: () => void;
}

export const TaskCard = ({ task, isOverlay, onClick }: Props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { type: "Task", task } });

  const style = {
    transition: transition || "transform 250ms cubic-bezier(0.18, 0.67, 0.6, 1.22)",
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging && !isOverlay) {
    return (
      <div 
        ref={setNodeRef} 
        style={style} 
        className="h-28 w-full rounded-2xl bg-surface-hover border-2 border-dashed border-brand-indigo/30 opacity-60"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={`rounded-2xl p-4 transition-all duration-200 cursor-grab active:cursor-grabbing group ${
        isOverlay 
          ? "bg-surface premium-shadow-hover border border-surface-border rotate-2 scale-105 z-50" 
          : "bg-surface border border-surface-border hover:border-surface-border/80 hover:bg-surface premium-shadow hover:-translate-y-0.5"
      }`}
    >
      <div className="flex items-center gap-2 mb-3">
        {task.priority && (
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest ${
            task.priority === "high" ? "bg-red-500/10 text-red-500 border border-red-500/20" :
            task.priority === "medium" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
            "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
          }`}>
            {task.priority}
          </span>
        )}
      </div>
      
      <h4 className="text-sm font-semibold text-text-primary mb-4 leading-snug group-hover:text-brand-indigo transition-colors">{task.title}</h4>
      
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-surface-border/60">
        <div className="flex items-center gap-3 text-xs font-medium text-text-muted">
          {task.dueDate && (
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> {task.dueDate}
            </div>
          )}
          {(task.comments?.length ?? 0) > 0 && (
            <div className="flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" /> {task.comments?.length}
            </div>
          )}
          {(task.attachments?.length ?? 0) > 0 && (
            <div className="flex items-center gap-1.5">
              <Paperclip className="w-3.5 h-3.5" /> {task.attachments?.length}
            </div>
          )}
        </div>
        
        {task.assignees && task.assignees.length > 0 && (
          <div className="flex items-center -space-x-2">
            {task.assignees.slice(0, 3).map((a: any) => (
              a.avatarUrl ? (
                <img key={a.id} src={a.avatarUrl} alt={a.name} className="w-6 h-6 rounded-full border-2 border-background premium-shadow" />
              ) : (
                <div key={a.id} className="w-6 h-6 rounded-full bg-brand-indigo text-white flex items-center justify-center text-[9px] font-bold border-2 border-background">
                  {a.name?.substring(0, 2).toUpperCase()}
                </div>
              )
            ))}
            {task.assignees.length > 3 && (
              <div className="w-6 h-6 rounded-full bg-surface-hover text-text-muted flex items-center justify-center text-[9px] font-bold border-2 border-background">
                +{task.assignees.length - 3}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
