import { Request, Response, NextFunction } from "express";
import * as labelService from "../services/labelService";

export const createLabel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceId = (req as any).workspaceId as string;
    const label = await labelService.createLabel(workspaceId, req.body);
    res.status(201).json({ label });
  } catch (error) {
    next(error);
  }
};

export const listLabels = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceId = (req as any).workspaceId as string;
    const labels = await labelService.listLabels(workspaceId);
    res.status(200).json({ labels });
  } catch (error) {
    next(error);
  }
};

export const deleteLabel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceId = (req as any).workspaceId as string;
    await labelService.deleteLabel(req.params.id as string, workspaceId);
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};
