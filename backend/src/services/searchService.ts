import prisma from "../lib/prisma";

export const searchWorkspace = async (workspaceId: string, query: string, skip: number, take: number) => {
  const [projects, tasks, members] = await Promise.all([
    prisma.project.findMany({
      where: {
        workspaceId,
        archived: false,
        name: { contains: query, mode: "insensitive" },
      },
      take,
      skip,
      select: { id: true, name: true, description: true, status: true },
    }),
    prisma.task.findMany({
      where: {
        workspaceId,
        archived: false,
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      take,
      skip,
      select: { id: true, title: true, status: true, projectId: true },
    }),
    prisma.membership.findMany({
      where: {
        workspaceId,
        user: { name: { contains: query, mode: "insensitive" } },
      },
      take,
      skip,
      select: { user: { select: { id: true, name: true, avatarUrl: true } }, role: { select: { name: true } } },
    }),
  ]);

  return {
    projects,
    tasks,
    members,
  };
};
