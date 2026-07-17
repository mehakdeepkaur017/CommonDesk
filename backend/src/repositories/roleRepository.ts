import prisma from "../lib/prisma";

export const findRolesByWorkspace = async (workspaceId: string) => {
  return prisma.role.findMany({
    where: { workspaceId },
    include: {
      _count: { select: { memberships: true } }
    },
  });
};

export const findRoleById = async (id: string, workspaceId: string) => {
  return prisma.role.findFirst({
    where: { id, OR: [{ workspaceId }, { workspaceId: null }] },
    include: { permissions: true },
  });
};

export const createRole = async (workspaceId: string, name: string, permissions: string[]) => {
  return prisma.role.create({
    data: {
      name,
      workspaceId,
      permissions: {
        create: permissions.map(p => ({ action: p })),
      },
    },
  });
};

export const updateRole = async (id: string, workspaceId: string, name?: string, permissions?: string[]) => {
  if (name) {
    await prisma.role.update({ where: { id }, data: { name } });
  }
  if (permissions) {
    await prisma.permission.deleteMany({ where: { roleId: id } });
    await prisma.permission.createMany({
      data: permissions.map(p => ({ roleId: id, action: p })),
    });
  }
  return findRoleById(id, workspaceId);
};

export const deleteRole = async (id: string, workspaceId: string) => {
  return prisma.role.delete({ where: { id, workspaceId } });
};
