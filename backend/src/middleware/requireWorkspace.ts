import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";

export const requireWorkspace = async (req: Request, res: Response, next: NextFunction) => {
  const workspaceId = req.headers["x-workspace-id"] as string;
  const user = (req as any).user;

  if (!workspaceId) {
    return res.status(400).json({ error: true, code: "BAD_REQUEST", message: "x-workspace-id header is required" });
  }

  if (!user) {
    return res.status(401).json({ error: true, code: "UNAUTHORIZED", message: "Authentication required" });
  }

  try {
    const membership = await prisma.membership.findUnique({
      where: {
        userId_workspaceId: {
          userId: user.userId,
          workspaceId,
        },
      },
      include: {
        role: {
          include: {
            permissions: true
          }
        },
      },
    });

    if (!membership || membership.status !== "active") {
      return res.status(403).json({ error: true, code: "FORBIDDEN", message: "Not an active member of this workspace" });
    }

    (req as any).workspaceId = workspaceId;
    (req as any).membership = membership;
    next();
  } catch (error) {
    next(error);
  }
};
