import { Request, Response, NextFunction } from "express";
import * as invitationService from "../services/invitationService";

export const inviteMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceId = (req as any).workspaceId;
    const adminId = (req as any).user.userId;
    const invitation = await invitationService.inviteMember(workspaceId, adminId, req.body);
    res.status(201).json({ invitation });
  } catch (error) {
    next(error);
  }
};

export const acceptInvitation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.params;
    await invitationService.acceptInvitation(token as string);
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};
