import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { TaskCard } from "./TaskCard";
import type { Task } from "../../types";
import { Plus } from "lucide-react";

interface Props {
  id: string;
  title: string;
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

export const KanbanColumn = ({ id, title, tasks, onTaskClick }: Props) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="flex flex-col w-[320px] shrink-0 h-full">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-text-primary tracking-tight">{title}</h3>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-surface border border-surface-border text-text-muted shadow-sm">
            {tasks.length}
          </span>
        </div>
        <button className="text-text-muted hover:text-text-primary transition-colors p-1 hover:bg-surface-hover rounded-md">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div 
        ref={setNodeRef}
        className={`flex-1 rounded-3xl transition-all duration-300 p-2.5 flex flex-col gap-3 ${
          isOver 
            ? "bg-brand-indigo/5 border-2 border-brand-indigo/20 shadow-inner" 
            : "bg-surface-hover border border-surface-border/50"
        }`}
      >
        {tasks.length === 0 ? (
          <div className="flex-1 border-2 border-dashed border-surface-border rounded-2xl flex items-center justify-center text-xs font-semibold text-text-muted">
            Drop tasks here
          </div>
        ) : (
          <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} onClick={() => onTaskClick?.(task)} />
            ))}
          </SortableContext>
        )}
      </div>
    </div>
  );
};
