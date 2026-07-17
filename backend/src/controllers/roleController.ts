import { Request, Response, NextFunction } from "express";
import * as roleService from "../services/roleService";

export const listRoles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceId = (req as any).workspaceId;
    const roles = await roleService.listRoles(workspaceId);
    res.status(200).json({ roles });
  } catch (error) {
    next(error);
  }
};

export const createRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceId = (req as any).workspaceId;
    const adminId = (req as any).user.userId;
    const role = await roleService.createRole(workspaceId, adminId, req.body);
    res.status(201).json({ role });
  } catch (error) {
    next(error);
  }
};

export const updateRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceId = (req as any).workspaceId as string;
    const adminId = (req as any).user.userId as string;
    const role = await roleService.updateRole(req.params.id as string, workspaceId, adminId, req.body);
    res.status(200).json({ role });
  } catch (error) {
    next(error);
  }
};

export const deleteRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceId = (req as any).workspaceId as string;
    const adminId = (req as any).user.userId as string;
    await roleService.deleteRole(req.params.id as string, workspaceId, adminId);
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};
