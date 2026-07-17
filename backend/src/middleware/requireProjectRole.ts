import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";

export const requireProjectRole = (
  allowedRoles: string[], 
  getProjectId: (req: Request) => Promise<string | null> | string | null,
  allowNullProject: boolean = false
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const membership = (req as any).membership;
      const user = (req as any).user;
      const workspaceId = (req as any).workspaceId;

      if (!membership || !user || !workspaceId) {
        return res.status(401).json({ error: true, code: "UNAUTHORIZED", message: "Authentication required" });
      }

      // Workspace Admins bypass all project-level restrictions
      if (membership.role.name === "ADMIN") {
        return next();
      }

      const projectId = await getProjectId(req);

      if (!projectId) {
        if (allowNullProject) {
          // If project is null and allowNullProject is true, it means it's a workspace level entity.
          // Since they are not an ADMIN (bypassed above), they are forbidden.
          return res.status(403).json({ error: true, code: "FORBIDDEN", message: "Only workspace admins can modify workspace-level assets." });
        }
        return res.status(400).json({ error: true, code: "BAD_REQUEST", message: "Could not resolve project ID for authorization" });
      }

      const projectMember = await prisma.projectMember.findUnique({
        where: {
          projectId_userId: {
            projectId: projectId,
            userId: user.userId
          }
        }
      });

      if (!projectMember) {
        // Not a project member. Are they trying to view a public project? 
        // This middleware is for action authorization, not basic viewing. 
        // We assume modifying actions strictly require project membership.
        return res.status(403).json({ 
          error: true, 
          code: "FORBIDDEN", 
          message: "You must be a member of this project to perform this action." 
        });
      }

      // For standard 'member' permissions, being any projectMember is often enough. 
      // But we check allowedRoles.
      if (allowedRoles.length > 0 && !allowedRoles.includes(projectMember.role)) {
        return res.status(403).json({ 
          error: true, 
          code: "FORBIDDEN", 
          message: `Project ${allowedRoles.join(" or ")} role required to perform this action.` 
        });
      }

      // Store project member info for later use
      (req as any).projectRole = projectMember.role;
      next();
    } catch (error) {
      next(error);
    }
  };
};
