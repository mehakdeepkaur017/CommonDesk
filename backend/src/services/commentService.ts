import * as commentRepository from "../repositories/commentRepository";
import { getTask } from "./taskService";
import { logActivity } from "./activityService";
import { z } from "zod";
import { createCommentSchema, updateCommentSchema } from "../validations/commentValidation";

export const addComment = async (taskId: string, workspaceId: string, userId: string, data: z.infer<typeof createCommentSchema>) => {
  const task = await getTask(taskId, workspaceId);
  
  const comment = await commentRepository.createComment({
    taskId,
    authorId: userId,
    content: data.content,
  });

  await logActivity(workspaceId, userId, "COMMENT_ADDED", task.projectId, taskId, { commentId: comment.id });

  return comment;
};

export const listComments = async (taskId: string, workspaceId: string, page: number, limit: number) => {
  await getTask(taskId, workspaceId); // Validate access
  const skip = (page - 1) * limit;
  const items = await commentRepository.listComments(taskId, skip, limit);
  const totalItems = await commentRepository.countComments(taskId);

  return {
    items,
    page,
    limit,
    totalPages: Math.ceil(totalItems / limit),
    totalItems,
  };
};

export const updateComment = async (commentId: string, workspaceId: string, userId: string, data: z.infer<typeof updateCommentSchema>) => {
  const comment = await commentRepository.getCommentById(commentId);
  if (!comment) throw { status: 404, message: "Comment not found" };
  if (comment.authorId !== userId) throw { status: 403, message: "Can only update own comments" };

  await getTask(comment.taskId, workspaceId); // Validate access

  return commentRepository.updateComment(commentId, data.content);
};

export const deleteComment = async (commentId: string, workspaceId: string, userId: string) => {
  const comment = await commentRepository.getCommentById(commentId);
  if (!comment) throw { status: 404, message: "Comment not found" };
  if (comment.authorId !== userId) throw { status: 403, message: "Can only delete own comments" };

  await getTask(comment.taskId, workspaceId); // Validate access

  await commentRepository.deleteComment(commentId);
};
