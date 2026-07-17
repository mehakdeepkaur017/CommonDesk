import { Request, Response, NextFunction } from "express";
import * as workspaceService from "../services/workspaceService";

export const listWorkspaces = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const workspaces = await workspaceService.listWorkspaces(userId);
    res.status(200).json(workspaces);
  } catch (error) {
    next(error);
  }
};

export const createWorkspace = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const workspace = await workspaceService.createWorkspace(userId, req.body);
    res.status(201).json({ workspace });
  } catch (error) {
    next(error);
  }
};

export const getCurrentWorkspace = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceId = (req as any).workspaceId;
    const membership = (req as any).membership;
    const user = (req as any).user;
    const workspace = await workspaceService.getCurrentWorkspace(workspaceId);
    
    const workspaceWithUser = {
      ...workspace,
      currentUser: {
        id: user.userId,
        role: membership.role.name,
        permissions: membership.role.permissions || []
      }
    };

    res.status(200).json({ workspace: workspaceWithUser });
  } catch (error) {
    next(error);
  }
};

export const getWorkspaceStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceId = (req as any).workspaceId;
    const stats = await workspaceService.getWorkspaceStats(workspaceId);
    res.status(200).json(stats);
  } catch (error) {
    next(error);
  }
};

export const updateWorkspace = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceId = (req as any).workspaceId;
    const userId = (req as any).user.userId;
    const workspace = await workspaceService.updateWorkspace(workspaceId, userId, req.body);
    res.status(200).json({ workspace });
  } catch (error) {
    next(error);
  }
};

export const deleteWorkspace = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceId = (req as any).workspaceId;
    const userId = (req as any).user.userId;
    await workspaceService.deleteWorkspace(workspaceId, userId);
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

import * as auditService from "../services/auditService";

export const getAuditLogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceId = (req as any).workspaceId;
    const { page, limit, q, category, severity, memberId, startDate, endDate } = req.query;

    const result = await auditService.getAuditLogs({
      workspaceId,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      q: q as string,
      category: category as string,
      severity: severity as string,
      memberId: memberId as string,
      startDate: startDate as string,
      endDate: endDate as string,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getJoinRequests = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceId = (req as any).workspaceId;
    const requests = await workspaceService.getJoinRequests(workspaceId);
    res.status(200).json(requests);
  } catch (error) {
    next(error);
  }
};

export const approveJoinRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceId = (req as any).workspaceId;
    const { id } = req.params;
    await workspaceService.approveJoinRequest(workspaceId, id as string);
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const rejectJoinRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceId = (req as any).workspaceId;
    const { id } = req.params;
    await workspaceService.rejectJoinRequest(workspaceId, id as string);
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const regenerateCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceId = (req as any).workspaceId;
    const workspace = await workspaceService.regenerateCode(workspaceId);
    res.status(200).json({ workspace });
  } catch (error) {
    next(error);
  }
};

export const uploadLogo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceId = (req as any).workspaceId;
    
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Build the public URL for the uploaded file
    const logoUrl = `/uploads/${req.file.filename}`;
    
    // Update the workspace's logoUrl
    const workspace = await workspaceService.updateLogoUrl(workspaceId, logoUrl);
    res.status(200).json({ workspace, logoUrl });
  } catch (error) {
    next(error);
  }
};
