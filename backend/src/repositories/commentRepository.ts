import prisma from "../lib/prisma";
import { Prisma } from "@prisma/client";

export const createComment = async (data: Prisma.CommentUncheckedCreateInput) => {
  return prisma.comment.create({
    data,
    include: {
      author: { select: { id: true, name: true, avatarUrl: true } },
    },
  });
};

export const getCommentById = async (id: string) => {
  return prisma.comment.findUnique({
    where: { id },
  });
};

export const listComments = async (taskId: string, skip: number, take: number) => {
  return prisma.comment.findMany({
    where: { taskId },
    skip,
    take,
    orderBy: { createdAt: "asc" },
    include: {
      author: { select: { id: true, name: true, avatarUrl: true } },
    },
  });
};

export const countComments = async (taskId: string) => {
  return prisma.comment.count({ where: { taskId } });
};

export const updateComment = async (id: string, content: string) => {
  return prisma.comment.update({
    where: { id },
    data: { content },
  });
};

export const deleteComment = async (id: string) => {
  return prisma.comment.delete({ where: { id } });
};
