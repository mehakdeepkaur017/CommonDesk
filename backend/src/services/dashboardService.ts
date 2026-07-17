import prisma from "../lib/prisma";
import { redis } from "../lib/redis";

export const getMemberDashboard = async (workspaceId: string, userId: string) => {
  const cacheKey = `dashboard:member:${workspaceId}:${userId}`;
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const [assignedTasks, recentProjects, recentActivity, unreadNotifications] = await Promise.all([
    prisma.task.findMany({
      where: { workspaceId, assigneeId: userId, archived: false },
      orderBy: { dueDate: "asc" },
      take: 5,
    }),
    prisma.project.findMany({
      where: { workspaceId, archived: false, members: { some: { userId } } },
      orderBy: { updatedAt: "desc" },
      take: 5,
    }),
    prisma.activity.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { actor: { select: { name: true, avatarUrl: true } }, project: { select: { name: true } }, task: { select: { title: true } } }
    }),
    prisma.notification.count({
      where: { workspaceId, userId, read: false },
    })
  ]);

  const result = { assignedTasks, recentProjects, recentActivity, unreadNotifications };
  await redis.setex(cacheKey, 60 * 5, JSON.stringify(result)); // Cache for 5 mins
  return result;
};

export const getAdminDashboard = async (workspaceId: string) => {
  const cacheKey = `dashboard:admin:${workspaceId}`;
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const [totalMembers, totalProjects, totalTasks, storageUsed, recentAuditLogs] = await Promise.all([
    prisma.membership.count({ where: { workspaceId } }),
    prisma.project.count({ where: { workspaceId, archived: false } }),
    prisma.task.count({ where: { workspaceId, archived: false } }),
    prisma.workspace.findUnique({ where: { id: workspaceId }, select: { storageUsedGB: true } }),
    prisma.auditLog.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { user: { select: { name: true, email: true } } }
    })
  ]);

  const result = { totalMembers, totalProjects, totalTasks, storageUsed: storageUsed?.storageUsedGB || 0, recentAuditLogs };
  await redis.setex(cacheKey, 60 * 5, JSON.stringify(result)); // Cache for 5 mins
  return result;
};
