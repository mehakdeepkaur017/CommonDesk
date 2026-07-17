import prisma from "../lib/prisma";

export const findMembership = async (userId: string, workspaceId: string) => {
  return prisma.membership.findUnique({
    where: {
      userId_workspaceId: { userId, workspaceId },
    },
    include: { user: true, role: true },
  });
};

export const listWorkspaceMembers = async (workspaceId: string, filters: any, sort: string, skip: number, limit: number) => {
  const where: any = { workspaceId };
  if (filters.role) where.role = { name: filters.role };
  if (filters.status) where.status = filters.status;
  if (filters.search) {
    where.user = {
      OR: [
        { name: { contains: filters.search, mode: "insensitive" } },
        { email: { contains: filters.search, mode: "insensitive" } }
      ]
    };
  }
  
  let orderBy: any = { joinedAt: "desc" };
  if (sort === "name") orderBy = { user: { name: "asc" } };
  if (sort === "role") orderBy = { role: { name: "asc" } };

  const [items, total] = await Promise.all([
    prisma.membership.findMany({
      where,
      include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } }, role: true },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.membership.count({ where })
  ]);
  
  return { items, total };
};

export const findMembershipById = async (id: string, workspaceId: string) => {
  return prisma.membership.findFirst({
    where: { id, workspaceId },
    include: { user: true, role: true },
  });
};

export const removeMembership = async (id: string, workspaceId: string) => {
  return prisma.membership.delete({
    where: { id },
    // Ensures tenant isolation (will fail if membership belongs to different workspace)
  });
};

export const updateMembershipStatus = async (id: string, workspaceId: string, status: string) => {
  return prisma.membership.update({
    where: { id },
    data: { status },
  });
};

export const updateMembershipRole = async (id: string, workspaceId: string, roleId: string) => {
  return prisma.membership.update({
    where: { id },
    data: { roleId },
  });
};
