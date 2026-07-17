import prisma from "../lib/prisma";
import { logActivity } from "./activityService";
import { logAudit } from "./auditService";
import fs from "fs";
import path from "path";

// Unified upload handler
export const handleLocalUpload = async (workspaceId: string, userId: string, file: Express.Multer.File, data: any) => {
  const membership = await prisma.membership.findFirst({
    where: { workspaceId, userId },
    include: { role: true }
  });
  
  if (!membership) throw { status: 403, message: "Forbidden" };
  const isAdmin = membership.role.name === "ADMIN";

  const attachment = await prisma.attachment.create({
    data: {
      workspaceId,
      uploaderId: userId,
      filename: file.originalname, 
      originalName: file.originalname,
      description: data.description || null,
      visibility: data.visibility || "workspace",
      publicId: file.filename, 
      secureUrl: `/uploads/${file.filename}`,
      format: file.mimetype,
      sizeBytes: file.size,
      taskId: data.taskId || null,
      projectId: data.projectId || null,
      folder: data.folder || null,
      version: 1,
    }
  });

  await logActivity(workspaceId, userId, "FILE_UPLOADED", data.projectId || undefined, data.taskId || undefined, { fileId: attachment.id, filename: file.originalname });
  await logAudit({
    workspaceId,
    userId,
    action: "FILE_UPLOADED",
    entityType: "File",
    entityName: file.originalname,
    entityId: attachment.id,
  });

  return attachment;
};

export const handleNewVersionUpload = async (fileId: string, workspaceId: string, userId: string, file: Express.Multer.File) => {
  const attachment = await prisma.attachment.findFirst({ where: { id: fileId, workspaceId } });
  if (!attachment) throw { status: 404, message: "File not found" };

  const membership = await prisma.membership.findFirst({ where: { workspaceId, userId }, include: { role: true } });
  const isAdmin = membership?.role.name === "ADMIN";
  if (!attachment.projectId && !isAdmin) throw { status: 403, message: "Only admins can version Workspace Documents." };

  const newVersion = attachment.version + 1;

  // Save current as a version
  await prisma.fileVersion.create({
    data: {
      fileId,
      uploaderId: attachment.uploaderId,
      publicId: attachment.publicId,
      secureUrl: attachment.secureUrl,
      format: attachment.format,
      sizeBytes: attachment.sizeBytes,
      version: attachment.version,
    }
  });

  // Update attachment to new file
  const updated = await prisma.attachment.update({
    where: { id: fileId },
    data: {
      uploaderId: userId,
      publicId: file.filename,
      secureUrl: `/uploads/${file.filename}`,
      format: file.mimetype,
      sizeBytes: file.size,
      version: newVersion,
    }
  });

  await logActivity(workspaceId, userId, "FILE_VERSION_CREATED", attachment.projectId || undefined, attachment.taskId || undefined, { fileId, filename: attachment.filename, version: newVersion });
  await logAudit({
    workspaceId,
    userId,
    action: "FILE_VERSION_CREATED",
    entityType: "File",
    entityName: attachment.filename,
    entityId: fileId,
    details: { version: newVersion },
  });
  return updated;
};

export const listFiles = async (workspaceId: string, skip: number, take: number, filters: any) => {
  const where: any = { workspaceId };
  
  if (filters.archived !== undefined) {
    if (filters.archived !== 'all') where.archived = filters.archived === 'true';
  } else {
    where.archived = false;
  }
  
  if (filters.projectId) where.projectId = filters.projectId;
  if (filters.taskId) where.taskId = filters.taskId;
  if (filters.folder) where.folder = filters.folder;
  if (filters.location === 'workspace') {
    where.projectId = null;
    where.taskId = null;
  }
  if (filters.location === 'project') {
    where.projectId = { not: null };
  }
  if (filters.location === 'task') {
    where.taskId = { not: null };
  }
  if (filters.search) {
    where.OR = [
      { filename: { contains: filters.search, mode: 'insensitive' } },
      { originalName: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } }
    ];
  }

  const [files, total] = await Promise.all([
    prisma.attachment.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
      include: {
        uploader: { select: { name: true, avatarUrl: true } },
        project: { select: { name: true, id: true } },
        task: { select: { title: true, id: true } }
      }
    }),
    prisma.attachment.count({ where })
  ]);
  
  return { items: files, total };
};

export const getFileVersions = async (fileId: string, workspaceId: string) => {
  return prisma.fileVersion.findMany({
    where: { fileId, file: { workspaceId } },
    orderBy: { version: 'desc' },
    include: { uploader: { select: { name: true, avatarUrl: true } } }
  });
};

export const updateFile = async (fileId: string, workspaceId: string, userId: string, data: any) => {
  const attachment = await prisma.attachment.findFirst({ where: { id: fileId, workspaceId } });
  if (!attachment) throw { status: 404, message: "File not found" };

  const updated = await prisma.attachment.update({
    where: { id: fileId },
    data
  });

  if (data.filename && data.filename !== attachment.filename) {
    await logActivity(workspaceId, userId, "FILE_RENAMED", attachment.projectId || undefined, attachment.taskId || undefined, { fileId, oldName: attachment.filename, newName: data.filename });
    await logAudit({ workspaceId, userId, action: "FILE_RENAMED", entityType: "File", entityName: data.filename, entityId: fileId, details: { oldName: attachment.filename, newName: data.filename } });
  } else if (data.archived !== undefined) {
    await logActivity(workspaceId, userId, data.archived ? "FILE_DELETED" : "FILE_RESTORED", attachment.projectId || undefined, attachment.taskId || undefined, { fileId, filename: attachment.filename });
    await logAudit({ workspaceId, userId, action: data.archived ? "FILE_ARCHIVED" : "FILE_RESTORED", entityType: "File", entityName: attachment.filename, entityId: fileId });
  } else {
    await logActivity(workspaceId, userId, "FILE_MOVED", attachment.projectId || undefined, attachment.taskId || undefined, { fileId, filename: attachment.filename });
    await logAudit({ workspaceId, userId, action: "FILE_UPDATED", entityType: "File", entityName: attachment.filename, entityId: fileId, details: data });
  }

  return updated;
};

export const deleteFile = async (fileId: string, workspaceId: string, userId: string) => {
  const attachment = await prisma.attachment.findFirst({ where: { id: fileId, workspaceId } });
  if (!attachment) throw { status: 404, message: "File not found" };

  // Delete actual file and all versions from disk
  const versions = await prisma.fileVersion.findMany({ where: { fileId } });
  const allFiles = [attachment.publicId, ...versions.map(v => v.publicId)];
  
  for (const pid of allFiles) {
    const filePath = path.join(process.cwd(), "uploads", pid);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  await prisma.attachment.delete({ where: { id: fileId } });
  await logActivity(workspaceId, userId, "FILE_DELETED", attachment.projectId || undefined, attachment.taskId || undefined, { filename: attachment.filename });
  await logAudit({ workspaceId, userId, action: "FILE_DELETED", entityType: "File", entityName: attachment.filename, entityId: fileId });
};

export const getStorageStats = async (workspaceId: string) => {
  const [total, docs, projects, tasks] = await Promise.all([
    prisma.attachment.aggregate({
      where: { workspaceId, archived: false },
      _sum: { sizeBytes: true },
      _count: true
    }),
    prisma.attachment.count({ where: { workspaceId, projectId: null, taskId: null, archived: false } }),
    prisma.attachment.count({ where: { workspaceId, projectId: { not: null }, taskId: null, archived: false } }),
    prisma.attachment.count({ where: { workspaceId, taskId: { not: null }, archived: false } })
  ]);
  
  return {
    totalFiles: total._count || 0,
    totalBytes: total._sum.sizeBytes || 0,
    workspaceDocs: docs,
    projectAssets: projects,
    taskAttachments: tasks
  };
};
