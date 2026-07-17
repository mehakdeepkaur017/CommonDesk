import { Request, Response, NextFunction } from "express";
import * as dashboardService from "../services/dashboardService";

export const getMemberDashboard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceId = (req as any).workspaceId as string;
    const userId = (req as any).user.userId as string;
    const data = await dashboardService.getMemberDashboard(workspaceId, userId);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const getAdminDashboard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceId = (req as any).workspaceId as string;
    const data = await dashboardService.getAdminDashboard(workspaceId);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
