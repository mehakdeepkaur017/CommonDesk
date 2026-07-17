import prisma from "../lib/prisma";
import { notificationQueue } from "../jobs/queues";

export const notifyWorkspaceUpdated = async (workspaceId: string, payload: any) => {
  // Push real-time event to BullMQ
  await notificationQueue.add("send_realtime", {
    workspaceId,
    event: "workspace_updated",
    payload,
  });
};

export const createNotification = async (workspaceId: string, userId: string, type: string, title: string, message: string, link?: string) => {
  const notification = await prisma.notification.create({
    data: {
      workspaceId,
      userId,
      type,
      title,
      message,
      link,
    }
  });

  await notificationQueue.add("send_realtime", {
    workspaceId,
    event: "notification_created",
    payload: notification,
  });

  return notification;
};

export const notifyAdmins = async (workspaceId: string, data: { type?: string, title: string, message: string, link?: string }) => {
  const admins = await prisma.membership.findMany({
    where: { workspaceId, role: { name: "ADMIN" }, status: "active" }
  });
  
  for (const admin of admins) {
    await createNotification(
      workspaceId,
      admin.userId,
      data.type || "SYSTEM_ALERT",
      data.title,
      data.message,
      data.link
    );
  }
};

export const listNotifications = async (userId: string, workspaceId: string, skip: number, take: number) => {
  return prisma.notification.findMany({
    where: { userId, workspaceId },
    skip,
    take,
    orderBy: { createdAt: "desc" },
  });
};

export const markAsRead = async (notificationId: string, userId: string) => {
  return prisma.notification.updateMany({
    where: { id: notificationId, userId },
    data: { read: true },
  });
};

export const markAllAsRead = async (userId: string, workspaceId: string) => {
  return prisma.notification.updateMany({
    where: { userId, workspaceId, read: false },
    data: { read: true },
  });
};
