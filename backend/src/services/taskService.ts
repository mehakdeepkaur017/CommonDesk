import * as taskRepository from "../repositories/taskRepository";
import { logActivity } from "./activityService";
import { logAudit } from "./auditService";
import * as notificationService from "./notificationService";
import { z } from "zod";
import { createTaskSchema, updateTaskSchema, bulkTaskOperationSchema, addChecklistItemSchema, updateChecklistItemSchema } from "../validations/taskValidation";

export const createTask = async (workspaceId: string, userId: string, data: z.infer<typeof createTaskSchema>) => {
  let position = data.position;
  if (position === undefined) {
    const maxPos = await taskRepository.getMaxPositionInStatus(data.projectId, data.status || "backlog");
    position = maxPos + 1024; // Leave gap for drag-and-drop
  }

  const task = await taskRepository.createTask({
    workspaceId,
    projectId: data.projectId,
    title: data.title,
    description: data.description,
    status: data.status,
    priority: data.priority,
    position,
    dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    estimatedTime: data.estimatedTime,
    assignees: data.assigneeIds && data.assigneeIds.length > 0 ? {
      connect: data.assigneeIds.map(id => ({ id }))
    } : undefined,
    parentId: data.parentId,
    createdById: userId,
  });

  await logActivity(workspaceId, userId, "TASK_CREATED", data.projectId, task.id);
  await logAudit({
    workspaceId,
    userId,
    action: "TASK_CREATED",
    entityType: "Task",
    entityId: task.id,
  });

  if (data.assigneeIds && data.assigneeIds.length > 0) {
    for (const assigneeId of data.assigneeIds) {
      if (assigneeId !== userId) {
        await notificationService.createNotification(
          workspaceId,
          assigneeId,
          "TASK_ASSIGNED",
          "New Task Assigned",
          `You have been assigned to: ${task.title}`,
          `/dashboard/tasks` // generic link for now, or modal trigger
        );
      }
    }
  }

  return task;
};

export const getTask = async (taskId: string, workspaceId: string) => {
  const task = await taskRepository.getTaskById(taskId, workspaceId);
  if (!task) throw { status: 404, message: "Task not found" };
  return task;
};

export const listTasks = async (workspaceId: string, page: number, limit: number, filters: any = {}) => {
  const skip = (page - 1) * limit;
  const items = await taskRepository.listTasks(workspaceId, skip, limit, filters);
  const totalItems = await taskRepository.countTasks(workspaceId, filters);

  return {
    items,
    page,
    limit,
    totalPages: Math.ceil(totalItems / limit),
    totalItems,
  };
};

export const updateTask = async (taskId: string, workspaceId: string, userId: string, data: z.infer<typeof updateTaskSchema>) => {
  const task = await getTask(taskId, workspaceId);
  
  const updateData: any = { ...data };
  delete updateData.assigneeIds; // Remove raw field; handled via relation below
  if (data.dueDate !== undefined) updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
  if (data.assigneeIds) {
    updateData.assignees = {
      set: data.assigneeIds.map(id => ({ id }))
    };
  }

  const updated = await taskRepository.updateTask(taskId, workspaceId, updateData);

  if (data.status && data.status !== task.status) {
    await logActivity(workspaceId, userId, "TASK_STATUS_CHANGED", task.projectId, taskId, { from: task.status, to: data.status });
  } else if (data.assigneeIds && JSON.stringify(data.assigneeIds.sort()) !== JSON.stringify(task.assignees.map((a: any) => a.id).sort())) {
    await logActivity(workspaceId, userId, "TASK_ASSIGNED", task.projectId, taskId, { assigneeIds: data.assigneeIds });
  } else {
    await logActivity(workspaceId, userId, "TASK_UPDATED", task.projectId, taskId);
  }

  await logAudit({
    workspaceId,
    userId,
    action: "TASK_UPDATED",
    entityType: "Task",
    entityId: task.id,
    details: data,
  });

  if (data.status === "completed" && task.status !== "completed") {
    if (task.createdById !== userId) {
      await notificationService.createNotification(
        workspaceId,
        task.createdById,
        "TASK_COMPLETED",
        "Task Completed",
        `Task "${task.title}" has been completed`,
        `/dashboard/tasks`
      );
    }
  }

  if (data.assigneeIds) {
    const oldAssigneeIds = task.assignees.map((a: any) => a.id);
    const newAssignees = data.assigneeIds.filter(id => !oldAssigneeIds.includes(id));
    for (const assigneeId of newAssignees) {
      if (assigneeId !== userId) {
        await notificationService.createNotification(
          workspaceId,
          assigneeId,
          "TASK_ASSIGNED",
          "Added to Task",
          `You were added to task: ${task.title}`,
          `/dashboard/tasks`
        );
      }
    }
  }

  return updated;
};

export const deleteTask = async (taskId: string, workspaceId: string, userId: string) => {
  const task = await getTask(taskId, workspaceId);
  
  await taskRepository.deleteTask(taskId, workspaceId);

  await logActivity(workspaceId, userId, "TASK_DELETED", task.projectId, undefined, { taskId, title: task.title });
  await logAudit({
    workspaceId,
    userId,
    action: "TASK_DELETED",
    entityType: "Task",
    entityId: task.id,
  });
};

export const bulkTasksOperation = async (workspaceId: string, userId: string, data: z.infer<typeof bulkTaskOperationSchema>) => {
  const { taskIds, action, value } = data;
    for (const taskId of taskIds) {
      const task = await getTask(taskId, workspaceId);
      if (!task) continue;
  
      if (action === "delete") {
        await deleteTask(taskId, workspaceId, userId);
      } else if (action === "archive") {
        await updateTask(taskId, workspaceId, userId, { archived: true });
      } else if (action === "restore") {
        await updateTask(taskId, workspaceId, userId, { archived: false });
      } else if (action === "status") {
        await updateTask(taskId, workspaceId, userId, { status: value });
      } else if (action === "priority") {
        await updateTask(taskId, workspaceId, userId, { priority: value });
      } else if (action === "assign") {
        await updateTask(taskId, workspaceId, userId, { assigneeIds: value });
      }
    }
};

export const addChecklistItem = async (taskId: string, workspaceId: string, userId: string, data: z.infer<typeof addChecklistItemSchema>) => {
  const task = await getTask(taskId, workspaceId);
  const position = data.position || 0; // simple position logic
  
  const item = await taskRepository.addChecklistItem({
    taskId,
    title: data.title,
    position,
  });

  await logActivity(workspaceId, userId, "TASK_CHECKLIST_UPDATED", task.projectId, taskId);
  return item;
};

export const updateChecklistItem = async (itemId: string, taskId: string, workspaceId: string, userId: string, data: z.infer<typeof updateChecklistItemSchema>) => {
  const task = await getTask(taskId, workspaceId);
  const updated = await taskRepository.updateChecklistItem(itemId, taskId, data);
  await logActivity(workspaceId, userId, "TASK_CHECKLIST_UPDATED", task.projectId, taskId);
  return updated;
};

export const removeChecklistItem = async (itemId: string, taskId: string, workspaceId: string, userId: string) => {
  const task = await getTask(taskId, workspaceId);
  await taskRepository.deleteChecklistItem(itemId, taskId);
  await logActivity(workspaceId, userId, "TASK_CHECKLIST_UPDATED", task.projectId, taskId);
};
