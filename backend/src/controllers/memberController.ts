import { Request, Response, NextFunction } from "express";
import * as memberService from "../services/memberService";

export const listMembers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceId = (req as any).workspaceId;
    const { role, status, search, sort, page = "1", limit = "50" } = req.query;
    const filters = {
      role: role as string,
      status: status as string,
      search: search as string,
    };
    const members = await memberService.listMembers(workspaceId, filters, sort as string, parseInt(page as string), parseInt(limit as string));
    res.status(200).json(members);
  } catch (error) {
    next(error);
  }
};

export const removeMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceId = (req as any).workspaceId;
    const adminId = (req as any).user.userId as string;
    await memberService.removeMember(req.params.id as string, workspaceId, adminId);
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const suspendMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceId = (req as any).workspaceId;
    const adminId = (req as any).user.userId as string;
    await memberService.suspendMember(req.params.id as string, workspaceId, adminId);
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const reactivateMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceId = (req as any).workspaceId;
    const adminId = (req as any).user.userId as string;
    await memberService.reactivateMember(req.params.id as string, workspaceId, adminId);
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const updateRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceId = (req as any).workspaceId;
    const adminId = (req as any).user.userId as string;
    const { roleId } = req.body;
    await memberService.updateRole(req.params.id as string, workspaceId, adminId, roleId);
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};
