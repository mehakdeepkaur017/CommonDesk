import { Request, Response, NextFunction } from "express";

export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Expecting req.membership to be populated by requireWorkspace middleware
    const membership = (req as any).membership;
    if (!membership) {
      return res.status(403).json({ error: true, code: "FORBIDDEN", message: "Workspace membership required" });
    }

    if (!allowedRoles.includes(membership.role.name)) {
      return res.status(403).json({ error: true, code: "FORBIDDEN", message: "Insufficient permissions" });
    }

    next();
  };
};
