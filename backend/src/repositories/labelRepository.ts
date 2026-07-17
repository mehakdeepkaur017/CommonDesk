import prisma from "../lib/prisma";
import { Prisma } from "@prisma/client";

export const createLabel = async (data: Prisma.LabelUncheckedCreateInput) => {
  return prisma.label.create({ data });
};

export const listLabels = async (workspaceId: string) => {
  return prisma.label.findMany({
    where: { workspaceId },
    orderBy: { name: "asc" },
  });
};

export const deleteLabel = async (id: string, workspaceId: string) => {
  return prisma.label.deleteMany({
    where: { id, workspaceId },
  });
};

export const assignLabelToTask = async (taskId: string, labelId: string) => {
  return prisma.taskLabel.create({
    data: { taskId, labelId },
  });
};

export const removeLabelFromTask = async (taskId: string, labelId: string) => {
  return prisma.taskLabel.delete({
    where: { taskId_labelId: { taskId, labelId } },
  });
};
