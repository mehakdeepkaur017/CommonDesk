import crypto from "crypto";
import * as invitationRepository from "../repositories/invitationRepository";
import prisma from "../lib/prisma";
import { env } from "../config/env";
import { logAudit } from "./auditService";
import { emailQueue } from "../jobs/queues";
import { z } from "zod";
import { inviteMemberSchema } from "../validations/invitationValidation";

export const inviteMember = async (workspaceId: string, adminId: string, data: z.infer<typeof inviteMemberSchema>) => {
  const activeInvite = await invitationRepository.findActiveInvitation(data.email, workspaceId);
  if (activeInvite) {
    throw { status: 400, message: "An active invitation already exists for this email" };
  }

  const token = crypto.randomBytes(32).toString("hex");
  const invitation = await invitationRepository.createInvitation(data.email, token, workspaceId, data.roleId, adminId);

  await logAudit({
    workspaceId,
    userId: adminId,
    action: "MEMBER_INVITED",
    entityType: "Invitation",
    entityId: invitation.id,
    details: { email: data.email, roleId: data.roleId },
  });

  await emailQueue.add("send_invitation_email", { email: data.email, token, adminId, workspaceId });
  return invitation;
};

export const acceptInvitation = async (token: string) => {
  const invitation = await invitationRepository.findInvitationByToken(token);
  if (!invitation) throw { status: 404, message: "Invitation not found" };
  if (invitation.status !== "pending") throw { status: 400, message: "Invitation no longer valid" };
  if (invitation.expiresAt < new Date()) throw { status: 400, message: "Invitation expired" };

  // Note: Actual user creation/linking logic will happen here in production
  // For now, we update the status
  await invitationRepository.updateInvitationStatus(invitation.id, "accepted");

  await logAudit({
    workspaceId: invitation.workspaceId,
    action: "INVITATION_ACCEPTED",
    entityType: "Invitation",
    entityId: invitation.id,
    details: { email: invitation.email },
  });

  return { success: true };
};
