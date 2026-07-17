import prisma from "../lib/prisma";
import { Prisma } from "@prisma/client";

export const createTask = async (data: any) => {
  return prisma.task.create({ data, include: { assignees: { select: { id: true, name: true, avatarUrl: true } } } });
};

export const getTaskById = async (id: string, workspaceId: string) => {
  return prisma.task.findFirst({
    where: { id, workspaceId },
    include: {
      assignees: { select: { id: true, name: true, avatarUrl: true } },
      createdBy: { select: { id: true, name: true, avatarUrl: true } },
      labels: { include: { label: true } },
      project: { select: { id: true, name: true } },
      checklist: { orderBy: { position: 'asc' } },
      subtasks: {
        include: {
          assignees: { select: { id: true, name: true, avatarUrl: true } },
          _count: { select: { comments: true } }
        }
      }
    },
  });
};

export const listTasks = async (workspaceId: string, skip: number, take: number, filters: any) => {
  const where: any = { workspaceId, ...filters };
  if (where.archived === 'all') {
    delete where.archived;
  } else if (where.archived === undefined) {
    where.archived = false;
  }

  return prisma.task.findMany({
    where,
    skip,
    take,
    orderBy: [{ status: "asc" }, { position: "asc" }],
    include: {
      assignees: { select: { id: true, name: true, avatarUrl: true } },
      labels: { include: { label: true } },
      _count: { select: { comments: true, attachments: true, subtasks: true, checklist: true } },
      project: { select: { id: true, name: true } },
    },
  });
};

export const countTasks = async (workspaceId: string, filters: any) => {
  const where: any = { workspaceId, ...filters };
  if (where.archived === 'all') {
    delete where.archived;
  } else if (where.archived === undefined) {
    where.archived = false;
  }
  return prisma.task.count({
    where,
  });
};

export const updateTask = async (id: string, workspaceId: string, data: any) => {
  return prisma.task.update({
    where: { id },
    data,
    include: { assignees: { select: { id: true, name: true, avatarUrl: true } } },
  });
};

export const getMaxPositionInStatus = async (projectId: string, status: string) => {
  const max = await prisma.task.aggregate({
    where: { projectId, status, archived: false },
    _max: { position: true },
  });
  return max._max.position || 0;
};

export const addChecklistItem = async (data: Prisma.TaskChecklistItemUncheckedCreateInput) => {
  return prisma.taskChecklistItem.create({ data });
};

export const updateChecklistItem = async (id: string, taskId: string, data: Prisma.TaskChecklistItemUpdateInput) => {
  return prisma.taskChecklistItem.update({
    where: { id },
    data,
  });
};

export const deleteChecklistItem = async (id: string, taskId: string) => {
  return prisma.taskChecklistItem.delete({
    where: { id },
  });
};

export const deleteTask = async (taskId: string, workspaceId: string) => {
  return prisma.task.delete({
    where: { id: taskId, workspaceId },
  });
};
