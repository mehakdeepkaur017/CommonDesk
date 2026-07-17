import { z } from "zod";
import { registerOrgSchema, joinOrgSchema, loginSchema } from "../validations/authValidation";
import * as userRepository from "../repositories/userRepository";
import * as tokenRepository from "../repositories/tokenRepository";
import { hashPassword, comparePassword, generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/authUtils";
import prisma from "../lib/prisma";
import * as notificationService from "./notificationService";
import { logAudit } from "./auditService";

const generateJoinCode = () => {
  return 'CD-' + Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const registerOrg = async (data: z.infer<typeof registerOrgSchema>) => {
  const existingUser = await userRepository.findUserByEmail(data.email);
  if (existingUser) {
    throw { status: 400, message: "Email already in use" };
  }

  const hashedPassword = await hashPassword(data.password);
  
  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: data.email,
        passwordHash: hashedPassword,
        name: data.name,
        role: "ADMIN",
      }
    });

    const slug = data.organizationName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const joinCode = generateJoinCode();
    
    const workspace = await tx.workspace.create({
      data: {
        name: data.organizationName,
        slug: slug + '-' + joinCode.toLowerCase(),
        joinCode: joinCode
      }
    });
    
    let adminRole = await tx.role.findFirst({ where: { name: "ADMIN", workspaceId: null } });
    if (!adminRole) {
      adminRole = await tx.role.create({ data: { name: "ADMIN" } });
    }
    
    await tx.membership.create({
      data: {
        userId: user.id,
        workspaceId: workspace.id,
        roleId: adminRole.id
      }
    });
    
    return { user, workspace };
  });

  const accessToken = generateAccessToken(result.user.id);
  const refreshToken = generateRefreshToken(result.user.id);
  await tokenRepository.saveRefreshToken(refreshToken, result.user.id);

  // Audit: workspace creation
  await logAudit({
    workspaceId: result.workspace.id,
    userId: result.user.id,
    action: "WORKSPACE_CREATED",
    entityType: "Workspace",
    entityName: result.workspace.name,
    entityId: result.workspace.id,
    category: "Workspace",
  });

  return { 
    user: { id: result.user.id, email: result.user.email, name: result.user.name, role: result.user.role }, 
    workspace: result.workspace, 
    accessToken, 
    refreshToken 
  };
};

export const joinOrg = async (data: z.infer<typeof joinOrgSchema>) => {
  const existingUser = await userRepository.findUserByEmail(data.email);
  if (existingUser) {
    throw { status: 400, message: "Email already in use" };
  }

  const workspace = await prisma.workspace.findUnique({ where: { joinCode: data.workspaceCode } });
  if (!workspace) {
    throw { status: 404, message: "Invalid workspace code" };
  }
  
  if (!workspace.publicJoinEnabled) {
    throw { status: 403, message: "Join requests are disabled for this workspace" };
  }

  const hashedPassword = await hashPassword(data.password);
  
  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: data.email,
        passwordHash: hashedPassword,
        name: data.name,
        role: "MEMBER",
      }
    });

    const joinRequest = await tx.joinRequest.create({
      data: {
        userId: user.id,
        workspaceId: workspace.id,
        status: "pending"
      }
    });
    
    const admins = await tx.membership.findMany({
      where: { workspaceId: workspace.id, role: { name: "ADMIN" } }
    });
    
    if (admins.length > 0) {
      await notificationService.notifyAdmins(workspace.id, {
        title: "New Join Request",
        message: `${user.name} has requested to join the workspace.`,
        link: "/admin/members"
      });
    }
    
    return { user, joinRequest };
  });

  const accessToken = generateAccessToken(result.user.id);
  const refreshToken = generateRefreshToken(result.user.id);
  await tokenRepository.saveRefreshToken(refreshToken, result.user.id);

  // Audit: member join request
  await logAudit({
    workspaceId: workspace.id,
    userId: result.user.id,
    action: "MEMBER_JOIN_REQUESTED",
    entityType: "Membership",
    entityName: result.user.name,
    entityId: result.joinRequest.id,
    category: "Members",
  });

  return { 
    user: { id: result.user.id, email: result.user.email, name: result.user.name, role: result.user.role }, 
    joinRequest: result.joinRequest, 
    accessToken, 
    refreshToken 
  };
};

export const login = async (data: z.infer<typeof loginSchema>) => {
  const user = await userRepository.findUserByEmail(data.email);
  if (!user) {
    throw { status: 401, message: "Invalid credentials" };
  }

  const isPasswordValid = await comparePassword(data.password, user.passwordHash);
  if (!isPasswordValid) {
    throw { status: 401, message: "Invalid credentials" };
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);
  await tokenRepository.saveRefreshToken(refreshToken, user.id);

  // Audit: login event across all user workspaces
  try {
    const memberships = await prisma.membership.findMany({
      where: { userId: user.id, status: "active" },
      select: { workspaceId: true },
    });
    for (const m of memberships) {
      await logAudit({
        workspaceId: m.workspaceId,
        userId: user.id,
        action: "LOGIN",
        entityType: "Auth",
        entityName: user.email,
        entityId: user.id,
        category: "Security",
      });
    }
  } catch (_) { /* never fail login for audit */ }

  return { user: { id: user.id, email: user.email, name: user.name, avatarUrl: user.avatarUrl, role: user.role }, accessToken, refreshToken };
};

export const refresh = async (refreshToken: string) => {
  if (!refreshToken) throw { status: 401, message: "Refresh token missing" };

  const savedToken = await tokenRepository.findRefreshToken(refreshToken);
  if (!savedToken) throw { status: 401, message: "Invalid refresh token" };

  try {
    const payload = verifyRefreshToken(refreshToken);
    const user = await userRepository.findUserById(payload.userId);
    if (!user) throw { status: 401, message: "User not found" };

    await tokenRepository.deleteRefreshToken(refreshToken);
    const newAccessToken = generateAccessToken(user.id);
    const newRefreshToken = generateRefreshToken(user.id);
    await tokenRepository.saveRefreshToken(newRefreshToken, user.id);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  } catch (error) {
    throw { status: 401, message: "Invalid or expired refresh token" };
  }
};

export const logout = async (refreshToken: string) => {
  if (refreshToken) {
    await tokenRepository.deleteRefreshToken(refreshToken);
  }
};

export const getMe = async (userId: string) => {
  const user = await userRepository.findUserById(userId);
  if (!user) throw { status: 404, message: "User not found" };
  return { id: user.id, email: user.email, name: user.name, avatarUrl: user.avatarUrl, role: user.role };
};

export const updateProfile = async (userId: string, data: { name?: string }) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { name: data.name },
    select: { id: true, name: true, email: true, avatarUrl: true },
  });
  return user;
};

export const updateAvatar = async (userId: string, avatarUrl: string) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { avatarUrl },
    select: { id: true, name: true, email: true, avatarUrl: true },
  });
  return user;
};

export const getJoinStatus = async (userId: string) => {
  const joinRequest = await prisma.joinRequest.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: { workspace: { select: { name: true, logoUrl: true } } }
  });
  
  if (!joinRequest) {
    throw { status: 404, message: "No join request found" };
  }
  
  return joinRequest;
};
