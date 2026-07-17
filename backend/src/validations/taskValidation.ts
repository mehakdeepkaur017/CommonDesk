import { z } from "zod";

const taskStatusEnum = z.enum(["todo", "in_progress", "review", "completed", "blocked", "cancelled"]);

export const createTaskSchema = z.object({
  projectId: z.string().uuid(),
  title: z.string().min(2, "Task title must be at least 2 characters"),
  description: z.string().optional(),
  status: taskStatusEnum.optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
  position: z.number().optional(), // Provided by frontend on drag and drop, or calculated by backend
  dueDate: z.string().datetime().optional(),
  estimatedTime: z.number().min(0).optional(),
  assigneeIds: z.array(z.string().uuid()).optional(),
  parentId: z.string().uuid().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().optional(),
  status: taskStatusEnum.optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
  position: z.number().optional(),
  dueDate: z.string().datetime().optional().nullable(),
  estimatedTime: z.number().min(0).optional().nullable(),
  assigneeIds: z.array(z.string().uuid()).optional(),
  archived: z.boolean().optional(),
});

export const addChecklistItemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  position: z.number().optional(),
});

export const updateChecklistItemSchema = z.object({
  title: z.string().min(1).optional(),
  isCompleted: z.boolean().optional(),
  position: z.number().optional(),
});

export const bulkTaskOperationSchema = z.object({
  taskIds: z.array(z.string().uuid()).min(1, "Must select at least one task"),
  action: z.enum(["status", "priority", "assign", "delete", "archive", "restore", "move"]),
  value: z.any().optional(), // Depends on action (e.g. status value, assigneeId, or projectId)
});
