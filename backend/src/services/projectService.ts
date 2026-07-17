import * as projectRepository from "../repositories/projectRepository";
import { logActivity } from "./activityService";
import { logAudit } from "./auditService";
import * as notificationService from "./notificationService";
import { z } from "zod";
import { createProjectSchema, updateProjectSchema } from "../validations/projectValidation";
import prisma from "../lib/prisma";

export const createProject = async (workspaceId: string, userId: string, data: z.infer<typeof createProjectSchema>) => {
  const project = await projectRepository.createProject({
    workspaceId,
    name: data.name,
    description: data.description,
    status: data.status,
    visibility: data.visibility,
    priority: data.priority,
    startDate: data.startDate ? new Date(data.startDate) : undefined,
    endDate: data.endDate ? new Date(data.endDate) : undefined,
    ownerId: userId,
    createdById: userId,
  });

  // Automatically add the creator as a project owner
  await projectRepository.addProjectMember(project.id, userId, "owner");

  // Process any assigned members
  if (data.members && data.members.length > 0) {
    for (const member of data.members) {
      if (member.userId !== userId) {
        await projectRepository.addProjectMember(project.id, member.userId, member.role);
      }
    }
  }

  await logActivity(workspaceId, userId, "PROJECT_CREATED", project.id);
  await logAudit({
    workspaceId,
    userId,
    action: "PROJECT_CREATED",
    entityType: "Project",
    entityId: project.id,
  });

  return project;
};

export const getProject = async (projectId: string, workspaceId: string, currentUserId?: string) => {
  const project = await projectRepository.getProjectById(projectId, workspaceId);
  if (!project) throw { status: 404, message: "Project not found" };
  
  // Calculate analytics
  const tasks = await prisma.task.findMany({ where: { projectId, archived: false } });
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "done").length;
  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  let currentUserRole = null;
  if (currentUserId) {
    const member = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId: currentUserId } }
    });
    if (member) {
      currentUserRole = member.role;
    }
  }

  return {
    ...project,
    currentUserRole,
    analytics: {
      totalTasks,
      completedTasks,
      openTasks: totalTasks - completedTasks,
      progress,
    }
  };
};

export const listProjects = async (workspaceId: string, page: number, limit: number, filters: any = {}) => {
  const skip = (page - 1) * limit;
  const items = await projectRepository.listProjects(workspaceId, skip, limit, filters);
  const totalItems = await projectRepository.countProjects(workspaceId, filters);

  return {
    items,
    page,
    limit,
    totalPages: Math.ceil(totalItems / limit),
    totalItems,
  };
};

export const updateProject = async (projectId: string, workspaceId: string, userId: string, data: z.infer<typeof updateProjectSchema>) => {
  const project = await getProject(projectId, workspaceId, userId);
  
  // Extract members before building Prisma update payload
  const { members, ...rest } = data as any;
  const updateData: any = { ...rest };
  if (rest.startDate) updateData.startDate = new Date(rest.startDate);
  if (rest.endDate) updateData.endDate = new Date(rest.endDate);

  const updated = await projectRepository.updateProject(projectId, workspaceId, updateData);

  // Sync project members if provided
  if (members && Array.isArray(members)) {
    // Always preserve the project owner
    const ownerId = (project as any).ownerId || userId;
    
    // Delete all existing members
    await prisma.projectMember.deleteMany({ where: { projectId } });
    
    // Re-add the owner as "owner" role
    await prisma.projectMember.create({
      data: { projectId, userId: ownerId, role: "owner" },
    });
    
    // Add all new members (skip if they are the owner, already added)
    for (const m of members) {
      if (m.userId !== ownerId) {
        await prisma.projectMember.create({
          data: { projectId, userId: m.userId, role: m.role || "member" },
        });
      }
    }
  }

  await logActivity(workspaceId, userId, "PROJECT_UPDATED", projectId, undefined, data);
  await logAudit({
    workspaceId,
    userId,
    action: "PROJECT_UPDATED",
    entityType: "Project",
    entityId: project.id,
    details: data,
  });

  return updated;
};

export const deleteProject = async (projectId: string, workspaceId: string, userId: string) => {
  const project = await getProject(projectId, workspaceId, userId);
  
  await projectRepository.updateProject(projectId, workspaceId, { archived: true });

  await logActivity(workspaceId, userId, "PROJECT_DELETED", projectId);
  await logAudit({
    workspaceId,
    userId,
    action: "PROJECT_DELETED",
    entityType: "Project",
    entityId: project.id,
  });
};

export const addProjectMember = async (projectId: string, workspaceId: string, adminId: string, userId: string, role: string = "member") => {
  const project = await getProject(projectId, workspaceId, adminId);
  const member = await projectRepository.addProjectMember(projectId, userId, role);
  
  await logActivity(workspaceId, adminId, "PROJECT_MEMBER_ADDED", projectId, undefined, { addedUserId: userId });
  return member;
};

export const removeProjectMember = async (projectId: string, workspaceId: string, adminId: string, userId: string) => {
  const project = await getProject(projectId, workspaceId, adminId);
  await projectRepository.removeProjectMember(projectId, userId);
  
  await logActivity(workspaceId, adminId, "PROJECT_MEMBER_REMOVED", projectId, undefined, { removedUserId: userId });
};
