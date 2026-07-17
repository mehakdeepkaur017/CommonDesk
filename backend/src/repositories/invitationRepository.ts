import prisma from "../lib/prisma";

export const createInvitation = async (email: string, token: string, workspaceId: string, roleId: string, invitedById: string, expiresInDays: number = 7) => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expiresInDays);

  return prisma.invitation.create({
    data: {
      email,
      token,
      workspaceId,
      roleId,
      invitedById,
      expiresAt,
    },
  });
};

export const findInvitationByToken = async (token: string) => {
  return prisma.invitation.findUnique({
    where: { token },
    include: { workspace: true, role: true, invitedBy: true },
  });
};

export const findInvitationById = async (id: string, workspaceId: string) => {
  return prisma.invitation.findFirst({
    where: { id, workspaceId },
  });
};

export const updateInvitationStatus = async (id: string, status: string) => {
  return prisma.invitation.update({
    where: { id },
    data: { status },
  });
};

export const findActiveInvitation = async (email: string, workspaceId: string) => {
  return prisma.invitation.findFirst({
    where: {
      email,
      workspaceId,
      status: "pending",
      expiresAt: { gt: new Date() },
    },
  });
};
