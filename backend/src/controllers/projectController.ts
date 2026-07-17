import { Request, Response, NextFunction } from "express";
import * as projectService from "../services/projectService";

export const createProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceId = (req as any).workspaceId as string;
    const userId = (req as any).user.userId as string;
    const project = await projectService.createProject(workspaceId, userId, req.body);
    res.status(201).json({ project });
  } catch (error) {
    next(error);
  }
};

export const getProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceId = (req as any).workspaceId as string;
    const userId = (req as any).user.userId as string;
    const project = await projectService.getProject(req.params.id as string, workspaceId, userId);
    res.status(200).json({ project });
  } catch (error) {
    next(error);
  }
};

export const listProjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceId = (req as any).workspaceId as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    
    // Simplistic filtering via query strings
    const filters: any = {};
    if (req.query.status) filters.status = req.query.status;
    if (req.query.archived) filters.archived = req.query.archived === "true";

    const membership = (req as any).membership;
    if (membership && membership.role.name !== "ADMIN") {
      filters.members = {
        some: {
          userId: (req as any).user.userId
        }
      };
    }

    const data = await projectService.listProjects(workspaceId, page, limit, filters);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceId = (req as any).workspaceId as string;
    const userId = (req as any).user.userId as string;
    const project = await projectService.updateProject(req.params.id as string, workspaceId, userId, req.body);
    res.status(200).json({ project });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceId = (req as any).workspaceId as string;
    const userId = (req as any).user.userId as string;
    await projectService.deleteProject(req.params.id as string, workspaceId, userId);
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const addMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceId = (req as any).workspaceId as string;
    const adminId = (req as any).user.userId as string;
    const member = await projectService.addProjectMember(req.params.id as string, workspaceId, adminId, req.body.userId, req.body.role);
    res.status(201).json({ member });
  } catch (error) {
    next(error);
  }
};

export const removeMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceId = (req as any).workspaceId as string;
    const adminId = (req as any).user.userId as string;
    await projectService.removeProjectMember(req.params.id as string, workspaceId, adminId, req.params.userId as string);
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};
