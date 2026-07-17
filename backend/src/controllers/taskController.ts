import { Request, Response, NextFunction } from "express";
import * as taskService from "../services/taskService";
import * as commentService from "../services/commentService";
import * as labelService from "../services/labelService";

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceId = (req as any).workspaceId as string;
    const userId = (req as any).user.userId as string;
    const task = await taskService.createTask(workspaceId, userId, req.body);
    res.status(201).json({ task });
  } catch (error) {
    next(error);
  }
};

export const getTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceId = (req as any).workspaceId as string;
    const task = await taskService.getTask(req.params.id as string, workspaceId);
    res.status(200).json({ task });
  } catch (error) {
    next(error);
  }
};

export const listTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceId = (req as any).workspaceId as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    
    const filters: any = {};
    if (req.query.projectId) filters.projectId = req.query.projectId;
    if (req.query.status) filters.status = req.query.status;
    if (req.query.assigneeId) filters.assignees = { some: { id: req.query.assigneeId } };
    if (req.query.priority) filters.priority = req.query.priority;
    if (req.query.archived) {
      if (req.query.archived === 'all') {
        filters.archived = 'all';
      } else {
        filters.archived = req.query.archived === 'true';
      }
    }

    if (req.query.search) {
      filters.OR = [
        { title: { contains: req.query.search, mode: "insensitive" } },
        { description: { contains: req.query.search, mode: "insensitive" } }
      ];
    }

    if (req.query.due) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      if (req.query.due === "today") {
        filters.dueDate = { gte: today, lt: tomorrow };
      } else if (req.query.due === "overdue") {
        filters.dueDate = { lt: today };
        filters.status = { notIn: ["completed", "cancelled"] };
      }
    }

    const data = await taskService.listTasks(workspaceId, page, limit, filters);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceId = (req as any).workspaceId as string;
    const userId = (req as any).user.userId as string;
    
    const membership = (req as any).membership;
    const projectRole = (req as any).projectRole;
    
    // Check if standard member is modifying someone else's task
    if (membership && membership.role.name !== "ADMIN" && projectRole !== "owner" && projectRole !== "manager") {
      const taskToCheck = await taskService.getTask(req.params.id as string, workspaceId);
      const isAssigned = taskToCheck.assignees?.some((a: any) => a.id === userId);
      if (!isAssigned && taskToCheck.createdById !== userId) {
        return res.status(403).json({ error: true, message: "You can only update tasks assigned to you or created by you." });
      }
    }

    const task = await taskService.updateTask(req.params.id as string, workspaceId, userId, req.body);
    res.status(200).json({ task });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceId = (req as any).workspaceId as string;
    const userId = (req as any).user.userId as string;
    await taskService.deleteTask(req.params.id as string, workspaceId, userId);
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const bulkTasksOperation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceId = (req as any).workspaceId as string;
    const userId = (req as any).user.userId as string;
    await taskService.bulkTasksOperation(workspaceId, userId, req.body);
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const addChecklistItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceId = (req as any).workspaceId as string;
    const userId = (req as any).user.userId as string;
    const item = await taskService.addChecklistItem(req.params.id as string, workspaceId, userId, req.body);
    res.status(201).json({ item });
  } catch (error) {
    next(error);
  }
};

export const updateChecklistItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceId = (req as any).workspaceId as string;
    const userId = (req as any).user.userId as string;
    const item = await taskService.updateChecklistItem(req.params.itemId as string, req.params.id as string, workspaceId, userId, req.body);
    res.status(200).json({ item });
  } catch (error) {
    next(error);
  }
};

export const removeChecklistItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceId = (req as any).workspaceId as string;
    const userId = (req as any).user.userId as string;
    await taskService.removeChecklistItem(req.params.itemId as string, req.params.id as string, workspaceId, userId);
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

// Comment Endpoints
export const addComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceId = (req as any).workspaceId as string;
    const userId = (req as any).user.userId as string;
    const comment = await commentService.addComment(req.params.id as string, workspaceId, userId, req.body);
    res.status(201).json({ comment });
  } catch (error) {
    next(error);
  }
};

export const listComments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceId = (req as any).workspaceId as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const data = await commentService.listComments(req.params.id as string, workspaceId, page, limit);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

// Task Labels
export const assignLabel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceId = (req as any).workspaceId as string;
    const userId = (req as any).user.userId as string;
    const taskLabel = await labelService.assignLabel(req.params.id as string, workspaceId, userId, req.body);
    res.status(201).json({ taskLabel });
  } catch (error) {
    next(error);
  }
};
