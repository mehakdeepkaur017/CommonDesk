import React, { useState, useEffect } from "react";
import type { 
  DragStartEvent,
  DragOverEvent,
  DragEndEvent
} from "@dnd-kit/core";
import { 
  DndContext, 
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { KanbanColumn } from "./KanbanColumn";
import { TaskCard } from "./TaskCard";
import { TaskSlideOut } from "./TaskSlideOut";
import type { Task } from "../../types";
import { useUpdateTask } from "../../hooks/queries/useTasks";
import { Button } from "../ui/Button";
import { CreateTaskWizard } from "./CreateTaskWizard";
import { useParams } from "react-router-dom";

interface KanbanBoardProps {
  tasks?: Task[];
}

export const KanbanBoard = ({ tasks = [] }: KanbanBoardProps) => {
  const { id: projectId } = useParams();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [selectedTaskForDrawer, setSelectedTaskForDrawer] = useState<Task | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const updateTask = useUpdateTask();

  // Local state for optimistic UI updates during drag
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const columns = [
    { id: "todo", title: "To Do", tasks: localTasks.filter(t => t.status === "todo") },
    { id: "in_progress", title: "In Progress", tasks: localTasks.filter(t => t.status === "in_progress") },
    { id: "review", title: "Review", tasks: localTasks.filter(t => t.status === "review") },
    { id: "done", title: "Done", tasks: localTasks.filter(t => t.status === "done") },
  ];

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = localTasks.find(t => t.id === active.id);
    if (task) setActiveTask(task);
  };

  const handleDragOver = (_event: DragOverEvent) => {
    // Optionally handle visual feedback when dragging over columns
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    // 'over.id' could be the column ID or another task ID.
    // If it's a task, find its status. If it's a column, use its ID.
    const overId = over.id as string;
    const newStatus = ["todo", "in_progress", "review", "done"].includes(overId) 
      ? overId 
      : localTasks.find(t => t.id === overId)?.status;

    if (!newStatus) return;

    const task = localTasks.find(t => t.id === taskId);
    if (task && task.status !== newStatus) {
      // Optimistic update
      setLocalTasks(prev => prev.map(t => 
        t.id === taskId ? { ...t, status: newStatus as any } : t
      ));
      
      // API call
      updateTask.mutate({ id: taskId, data: { status: newStatus } });
    }
  };

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold font-heading text-text-primary tracking-tight">Board</h2>
        <Button 
          size="sm" 
          variant="secondary" 
          className="font-semibold shadow-sm rounded-xl"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Add Task
        </Button>
      </div>
      
      <div className="flex-1 flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-surface-border scrollbar-track-transparent pr-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          {columns.map((col) => (
            <KanbanColumn 
              key={col.id} 
              id={col.id} 
              title={col.title} 
              tasks={col.tasks} 
              onTaskClick={(task) => setSelectedTaskForDrawer(task)}
            />
          ))}

          <DragOverlay>
            {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
          </DragOverlay>
        </DndContext>
      </div>

      {selectedTaskForDrawer && (
        <TaskSlideOut 
          task={selectedTaskForDrawer} 
          onClose={() => setSelectedTaskForDrawer(null)} 
        />
      )}

      {isCreateModalOpen && projectId && (
        <CreateTaskWizard 
          projectId={projectId || tasks[0]?.projectId || ""} 
          onClose={() => setIsCreateModalOpen(false)} 
        />
      )}
    </div>
  );
};
