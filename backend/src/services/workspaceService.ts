import * as workspaceRepository from "../repositories/workspaceRepository";
import { logAudit } from "./auditService";
import * as notificationService from "./notificationService";
import { z } from "zod";
import { updateWorkspaceSchema } from "../validations/workspaceValidation";
import prisma from "../lib/prisma";

export const listWorkspaces = async (userId: string) => {
  const memberships = await prisma.membership.findMany({
    where: { userId, status: "active", workspace: { deletedAt: null } },
    include: { workspace: true, role: true },
  });
  return memberships.map(m => ({ ...m.workspace, role: m.role }));
};

export const createWorkspace = async (userId: string, data: any) => {
  // We need an admin role ID to assign to the creator.
  // In a real scenario, roles might be created per workspace or global.
  // Here we'll create the workspace and a default ADMIN role for it.
  
  const workspace = await prisma.workspace.create({
    data: {
      name: data.name,
      slug: data.slug || data.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    }
  });

  const adminRole = await prisma.role.create({
    data: {
      name: "ADMIN",
      workspaceId: workspace.id,
      permissions: {
        create: {
          action: "*"
        }
      }
    }
  });

  await prisma.membership.create({
    data: {
      userId,
      workspaceId: workspace.id,
      roleId: adminRole.id,
      status: "active"
    }
  });

  await logAudit({
    workspaceId: workspace.id,
    userId,
    action: "WORKSPACE_CREATED",
    entityType: "Workspace",
    entityId: workspace.id,
    details: { name: data.name },
  });

  return workspace;
};

export const getCurrentWorkspace = async (workspaceId: string) => {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
  });
  if (!workspace) throw { status: 404, message: "Workspace not found" };
  return workspace;
};

export const getWorkspaceStats = async (workspaceId: string) => {
  const [membersCount, pendingRequestsCount, projectsCount] = await Promise.all([
    prisma.membership.count({ where: { workspaceId, status: "active" } }),
    prisma.joinRequest.count({ where: { workspaceId, status: "pending" } }),
    prisma.project.count({ where: { workspaceId, archived: false } })
  ]);
  return { 
    membersCount, 
    pendingRequestsCount, 
    projectsCount,
    storageUsed: "0 MB",
    activeSessions: 1,
    failedLogins: 0
  };
};

export const updateWorkspace = async (workspaceId: string, userId: string, data: z.infer<typeof updateWorkspaceSchema>) => {
  const workspace = await workspaceRepository.updateWorkspace(workspaceId, data);
  
  await logAudit({
    workspaceId,
    userId,
    action: "WORKSPACE_UPDATED",
    entityType: "Workspace",
    entityId: workspaceId,
    details: data,
  });

  await notificationService.notifyWorkspaceUpdated(workspaceId, data);
  return workspace;
};

export const deleteWorkspace = async (workspaceId: string, userId: string) => {
  await workspaceRepository.softDeleteWorkspace(workspaceId);
  
  await logAudit({
    workspaceId,
    userId,
    action: "WORKSPACE_DELETED",
    entityType: "Workspace",
    entityId: workspaceId,
  });
};

// getAuditLogs removed, using auditService directly

export const getJoinRequests = async (workspaceId: string) => {
  return await prisma.joinRequest.findMany({
    where: { workspaceId, status: "pending" },
    include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } } },
    orderBy: { createdAt: "desc" }
  });
};

export const approveJoinRequest = async (workspaceId: string, requestId: string) => {
  const request = await prisma.joinRequest.findFirst({ where: { id: requestId, workspaceId } });
  if (!request) throw { status: 404, message: "Join request not found" };

  await prisma.$transaction(async (tx) => {
    await tx.joinRequest.update({
      where: { id: requestId },
      data: { status: "approved" }
    });

    let memberRole = await tx.role.findFirst({ where: { name: "MEMBER", workspaceId: null } });
    if (!memberRole) {
      memberRole = await tx.role.create({ data: { name: "MEMBER" } });
    }

    await tx.membership.create({
      data: {
        userId: request.userId,
        workspaceId,
        roleId: memberRole.id
      }
    });
  });

  // Notify the user they were approved
  await notificationService.createNotification(
    workspaceId,
    request.userId,
    "JOIN_APPROVED",
    "Join Request Approved",
    "Welcome to the workspace! You can now access all member features.",
    "/dashboard"
  );

  // Notify admins
  const user = await prisma.user.findUnique({ where: { id: request.userId } });
  await notificationService.notifyAdmins(workspaceId, {
    type: "MEMBER_ADDED",
    title: "New Member Added",
    message: `${user?.name} has joined the workspace.`,
    link: "/admin/members"
  });
};

export const rejectJoinRequest = async (workspaceId: string, requestId: string) => {
  await prisma.joinRequest.update({
    where: { id: requestId, workspaceId },
    data: { status: "rejected" }
  });
};

export const regenerateCode = async (workspaceId: string) => {
  const joinCode = 'CD-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  return await prisma.workspace.update({
    where: { id: workspaceId },
    data: { joinCode }
  });
};

export const updateLogoUrl = async (workspaceId: string, logoUrl: string) => {
  return await prisma.workspace.update({
    where: { id: workspaceId },
    data: { logoUrl }
  });
};
