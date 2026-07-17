import prisma from "../lib/prisma";
import { Prisma } from "@prisma/client";

export const createProject = async (data: Prisma.ProjectUncheckedCreateInput) => {
  return prisma.project.create({ data });
};

export const getProjectById = async (id: string, workspaceId: string) => {
  return prisma.project.findFirst({
    where: { id, workspaceId },
    include: {
      owner: { select: { id: true, name: true, email: true, avatarUrl: true } },
      members: {
        include: {
          user: { select: { id: true, name: true, email: true, avatarUrl: true } },
        },
      },
    },
  });
};

export const listProjects = async (workspaceId: string, skip: number, take: number, filters: any) => {
  return prisma.project.findMany({
    where: { workspaceId, ...filters },
    skip,
    take,
    orderBy: { updatedAt: "desc" },
    include: {
      owner: { select: { id: true, name: true, avatarUrl: true } },
      members: { select: { userId: true, role: true } },
      _count: { select: { tasks: true, members: true } },
    },
  });
};

export const countProjects = async (workspaceId: string, filters: any) => {
  return prisma.project.count({
    where: { workspaceId, ...filters },
  });
};

export const updateProject = async (id: string, workspaceId: string, data: Prisma.ProjectUpdateInput) => {
  return prisma.project.update({
    where: { id },
    data,
  });
};

export const addProjectMember = async (projectId: string, userId: string, role: string) => {
  return prisma.projectMember.create({
    data: { projectId, userId, role },
  });
};

export const removeProjectMember = async (projectId: string, userId: string) => {
  return prisma.projectMember.delete({
    where: { projectId_userId: { projectId, userId } },
  });
};
