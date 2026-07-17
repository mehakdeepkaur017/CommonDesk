import * as labelRepository from "../repositories/labelRepository";
import { getTask } from "./taskService";
import { logActivity } from "./activityService";
import { z } from "zod";
import { createLabelSchema, assignLabelSchema } from "../validations/labelValidation";

export const createLabel = async (workspaceId: string, data: z.infer<typeof createLabelSchema>) => {
  return labelRepository.createLabel({
    workspaceId,
    name: data.name,
    color: data.color,
  });
};

export const listLabels = async (workspaceId: string) => {
  return labelRepository.listLabels(workspaceId);
};

export const deleteLabel = async (labelId: string, workspaceId: string) => {
  return labelRepository.deleteLabel(labelId, workspaceId);
};

export const assignLabel = async (taskId: string, workspaceId: string, userId: string, data: z.infer<typeof assignLabelSchema>) => {
  const task = await getTask(taskId, workspaceId);
  const taskLabel = await labelRepository.assignLabelToTask(taskId, data.labelId);

  await logActivity(workspaceId, userId, "LABEL_ADDED", task.projectId, taskId, { labelId: data.labelId });
  return taskLabel;
};

export const removeLabel = async (taskId: string, workspaceId: string, userId: string, labelId: string) => {
  const task = await getTask(taskId, workspaceId);
  await labelRepository.removeLabelFromTask(taskId, labelId);

  await logActivity(workspaceId, userId, "LABEL_REMOVED", task.projectId, taskId, { labelId });
};
