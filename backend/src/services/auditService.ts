import prisma from "../lib/prisma";
import { requestContext } from "../middleware/requestContext";

export const logAudit = async (params: {
  workspaceId: string;
  userId?: string;
  action: string;
  entityType: string;
  entityName?: string;
  entityId: string;
  category?: string;
  severity?: string;
  details?: any;
}) => {
  try {
    // Extract context
    const context = requestContext.getStore();
    const ipAddress = context?.ipAddress;
    const userAgent = context?.userAgent;

    // Auto-calculate Category if not provided
    let category = params.category;
    if (!category) {
      const type = params.entityType.toUpperCase();
      if (type.includes("TASK")) category = "Tasks";
      else if (type.includes("PROJECT")) category = "Projects";
      else if (type.includes("MEMBER") || type.includes("INVITATION") || type.includes("ROLE")) category = "Members";
      else if (type.includes("FILE") || type.includes("ATTACHMENT")) category = "Files";
      else if (type.includes("WORKSPACE")) category = "Workspace";
      else if (type.includes("AUTH") || type.includes("SECURITY")) category = "Security";
      else category = "General";
    }

    // Auto-calculate Severity if not provided
    let severity = params.severity;
    if (!severity) {
      const action = params.action.toUpperCase();
      if (action.includes("DELETE") || action.includes("REMOVE") || action.includes("SUSPEND") || action.includes("ARCHIVE")) {
        severity = "WARNING";
      } else if (action.includes("DENIED") || action.includes("FAIL") || action.includes("UNAUTHORIZED")) {
        severity = "ERROR";
      } else if (action.includes("BREACH") || action.includes("MASS_DELETE")) {
        severity = "CRITICAL";
      } else {
        severity = "INFO";
      }
    }

    return await prisma.auditLog.create({
      data: {
        workspaceId: params.workspaceId,
        userId: params.userId,
        action: params.action,
        entityType: params.entityType,
        entityName: params.entityName,
        entityId: params.entityId,
        category,
        severity,
        ipAddress,
        userAgent,
        details: params.details ? JSON.stringify(params.details) : null,
      },
    });
  } catch (error) {
    console.error("Failed to write audit log:", error);
    // Never crash the application if audit logging fails
  }
};

export const getAuditLogs = async (params: {
  workspaceId: string;
  page?: number;
  limit?: number;
  q?: string;
  category?: string;
  severity?: string;
  memberId?: string;
  startDate?: string;
  endDate?: string;
}) => {
  const page = params.page || 1;
  const limit = params.limit || 50;
  const skip = (page - 1) * limit;

  const where: any = { workspaceId: params.workspaceId };

  if (params.q) {
    where.OR = [
      { action: { contains: params.q, mode: "insensitive" } },
      { entityName: { contains: params.q, mode: "insensitive" } },
      { ipAddress: { contains: params.q, mode: "insensitive" } },
      { user: { name: { contains: params.q, mode: "insensitive" } } },
      { user: { email: { contains: params.q, mode: "insensitive" } } },
    ];
  }

  if (params.category) where.category = params.category;
  if (params.severity) where.severity = params.severity;
  if (params.memberId) where.userId = params.memberId;
  
  if (params.startDate || params.endDate) {
    where.createdAt = {};
    if (params.startDate) where.createdAt.gte = new Date(params.startDate);
    if (params.endDate) where.createdAt.lte = new Date(params.endDate);
  }

  const [total, logs] = await Promise.all([
    prisma.auditLog.count({ where }),
    prisma.auditLog.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true, avatarUrl: true } }
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    })
  ]);

  return {
    logs,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};
