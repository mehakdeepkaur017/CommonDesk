import { Request, Response, NextFunction } from "express";
import * as notificationService from "../services/notificationService";

export const listNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceId = (req as any).workspaceId as string;
    const userId = (req as any).user.userId as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    const notifications = await notificationService.listNotifications(userId, workspaceId, skip, limit);
    res.status(200).json({ notifications, page, limit });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId as string;
    await notificationService.markAsRead(req.params.id as string, userId);
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceId = (req as any).workspaceId as string;
    const userId = (req as any).user.userId as string;
    await notificationService.markAllAsRead(userId, workspaceId);
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};
