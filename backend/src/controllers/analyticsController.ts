import { Request, Response, NextFunction } from "express";
import * as analyticsService from "../services/analyticsService";

export const getAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceId = (req as any).workspaceId as string;
    const timeRange = (req.query.timeRange as string) || '30d';
    const data = await analyticsService.getWorkspaceAnalytics(workspaceId, timeRange);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
