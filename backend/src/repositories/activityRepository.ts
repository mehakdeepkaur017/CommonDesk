import prisma from "../lib/prisma";
import { Prisma } from "@prisma/client";

export const createActivity = async (data: Prisma.ActivityUncheckedCreateInput) => {
  return prisma.activity.create({ data });
};

export const listActivity = async (workspaceId: string, skip: number, take: number, filters: any) => {
  return prisma.activity.findMany({
    where: { workspaceId, ...filters },
    skip,
    take,
    orderBy: { createdAt: "desc" },
    include: {
      actor: { select: { id: true, name: true, avatarUrl: true } },
      project: { select: { id: true, name: true } },
      task: { select: { id: true, title: true } },
    },
  });
};

export const countActivity = async (workspaceId: string, filters: any) => {
  return prisma.activity.count({
    where: { workspaceId, ...filters },
  });
};
