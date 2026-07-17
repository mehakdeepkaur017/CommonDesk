import prisma from "../lib/prisma";
import { Prisma } from "@prisma/client";

export const findWorkspaceById = async (id: string) => {
  return prisma.workspace.findFirst({ where: { id, deletedAt: null } });
};

export const updateWorkspace = async (id: string, data: Prisma.WorkspaceUpdateInput) => {
  return prisma.workspace.update({
    where: { id },
    data,
  });
};

export const softDeleteWorkspace = async (id: string) => {
  return prisma.workspace.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};
