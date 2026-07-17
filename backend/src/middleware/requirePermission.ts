import { Request, Response, NextFunction } from "express";

export const requirePermission = (action: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Expecting req.membership to be populated by requireWorkspace middleware
    const membership = (req as any).membership;
    
    if (!membership) {
      return res.status(403).json({ error: true, code: "FORBIDDEN", message: "Workspace membership required" });
    }

    // Admins always have access
    if (membership.role.name === "ADMIN") {
      return next();
    }

    // Check custom permissions for this action
    const hasPermission = membership.role.permissions?.some((p: any) => p.action === action);
    
    if (!hasPermission) {
      return res.status(403).json({ 
        error: true, 
        code: "FORBIDDEN", 
        message: "You don't have permission to perform this action in this workspace." 
      });
    }

    next();
  };
};
