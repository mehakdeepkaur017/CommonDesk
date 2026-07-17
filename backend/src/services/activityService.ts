import * as activityRepository from "../repositories/activityRepository";
import { notifyWorkspaceUpdated } from "./notificationService";

export const logActivity = async (
  workspaceId: string,
  actorId: string,
  action: string,
  projectId?: string,
  taskId?: string,
  details?: any
) => {
  const activity = await activityRepository.createActivity({
    workspaceId,
    actorId,
    action,
    projectId,
    taskId,
    details: details ? JSON.stringify(details) : null,
  });

  // Emitting event hook for real-time frontend integration later
  await notifyWorkspaceUpdated(workspaceId, { type: "activity_created", activityId: activity.id });
  return activity;
};

export const listActivity = async (workspaceId: string, page: number, limit: number, filters: any = {}) => {
  const skip = (page - 1) * limit;
  const items = await activityRepository.listActivity(workspaceId, skip, limit, filters);
  const totalItems = await activityRepository.countActivity(workspaceId, filters);

  return {
    items,
    page,
    limit,
    totalPages: Math.ceil(totalItems / limit),
    totalItems,
  };
};
