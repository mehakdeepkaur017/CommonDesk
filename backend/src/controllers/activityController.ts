import { Request, Response, NextFunction } from "express";
import * as activityService from "../services/activityService";

export const listActivity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceId = (req as any).workspaceId as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;

    const filters: any = {};
    if (req.query.projectId) filters.projectId = req.query.projectId;
    if (req.query.taskId) filters.taskId = req.query.taskId;

    const data = await activityService.listActivity(workspaceId, page, limit, filters);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
