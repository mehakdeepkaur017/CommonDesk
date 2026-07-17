import * as memberRepository from "../repositories/memberRepository";
import { logAudit } from "./auditService";
import prisma from "../lib/prisma";

export const listMembers = async (workspaceId: string, filters: any = {}, sort: string = "joined", page: number = 1, limit: number = 50) => {
  const skip = (page - 1) * limit;
  const { items, total } = await memberRepository.listWorkspaceMembers(workspaceId, filters, sort, skip, limit);
  return {
    items: items.map(m => ({
      id: m.user.id,
      membershipId: m.id,
      name: m.user.name,
      email: m.user.email,
      avatarUrl: m.user.avatarUrl,
      role: m.role?.name || "MEMBER",
      status: m.status,
      joinedAt: m.joinedAt,
    })),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  };
};

export const removeMember = async (membershipId: string, workspaceId: string, adminId: string) => {
  const membership = await memberRepository.findMembershipById(membershipId, workspaceId);
  if (!membership) throw { status: 404, message: "Membership not found" };

  await memberRepository.removeMembership(membershipId, workspaceId);

  await logAudit({
    workspaceId,
    userId: adminId,
    action: "MEMBER_REMOVED",
    entityType: "Membership",
    entityId: membershipId,
    details: { removedUserId: membership.userId },
  });
};

export const suspendMember = async (membershipId: string, workspaceId: string, adminId: string) => {
  const membership = await memberRepository.findMembershipById(membershipId, workspaceId);
  if (!membership) throw { status: 404, message: "Membership not found" };

  await memberRepository.updateMembershipStatus(membershipId, workspaceId, "suspended");

  await logAudit({
    workspaceId,
    userId: adminId,
    action: "MEMBER_SUSPENDED",
    entityType: "Membership",
    entityId: membershipId,
  });
};

export const reactivateMember = async (membershipId: string, workspaceId: string, adminId: string) => {
  const membership = await memberRepository.findMembershipById(membershipId, workspaceId);
  if (!membership) throw { status: 404, message: "Membership not found" };

  await memberRepository.updateMembershipStatus(membershipId, workspaceId, "active");

  await logAudit({
    workspaceId,
    userId: adminId,
    action: "MEMBER_REACTIVATED",
    entityType: "Membership",
    entityId: membershipId,
  });
};

export const updateRole = async (membershipId: string, workspaceId: string, adminId: string, roleName: string) => {
  const membership = await memberRepository.findMembershipById(membershipId, workspaceId);
  if (!membership) throw { status: 404, message: "Membership not found" };

  // Cannot change own role
  if (membership.userId === adminId) {
    throw { status: 403, message: "Cannot modify your own role" };
  }

  // Find the role by name
  let targetRole = await prisma.role.findFirst({
    where: { 
      name: roleName.toUpperCase(), 
      OR: [{ workspaceId: null }, { workspaceId }]
    }
  });

  if (!targetRole) {
    targetRole = await prisma.role.create({
      data: { name: roleName.toUpperCase(), workspaceId }
    });
  }

  await memberRepository.updateMembershipRole(membershipId, workspaceId, targetRole.id);

  await logAudit({
    workspaceId,
    userId: adminId,
    action: "MEMBER_ROLE_UPDATED",
    entityType: "Membership",
    entityId: membershipId,
    details: { newRoleId: targetRole.id },
  });
};
