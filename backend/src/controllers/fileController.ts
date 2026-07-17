import { Request, Response, NextFunction } from "express";
import * as fileService from "../services/fileService";
import { uploadFileSchema, updateFileSchema } from "../validations/fileValidation";

export const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceId = (req as any).workspaceId as string;
    const userId = (req as any).user.userId as string;
    
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const parsed = uploadFileSchema.parse(req.body);
    const file = await fileService.handleLocalUpload(workspaceId, userId, req.file, parsed);
    res.status(201).json({ file });
  } catch (error) {
    next(error);
  }
};

export const uploadNewVersion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceId = (req as any).workspaceId as string;
    const userId = (req as any).user.userId as string;
    
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const file = await fileService.handleNewVersionUpload(req.params.id as string, workspaceId, userId, req.file);
    res.status(200).json({ file });
  } catch (error) {
    next(error);
  }
};

export const listFiles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceId = (req as any).workspaceId as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    const filters: any = {};
    if (req.query.projectId) filters.projectId = req.query.projectId;
    if (req.query.taskId) filters.taskId = req.query.taskId;
    if (req.query.folder) filters.folder = req.query.folder;
    if (req.query.archived) filters.archived = req.query.archived;
    if (req.query.location) filters.location = req.query.location;
    if (req.query.search) filters.search = req.query.search;

    const result = await fileService.listFiles(workspaceId, skip, limit, filters);
    res.status(200).json({ ...result, page, limit });
  } catch (error) {
    next(error);
  }
};

export const getVersions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceId = (req as any).workspaceId as string;
    const versions = await fileService.getFileVersions(req.params.id as string, workspaceId);
    res.status(200).json({ versions });
  } catch (error) {
    next(error);
  }
};

export const updateFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceId = (req as any).workspaceId as string;
    const userId = (req as any).user.userId as string;
    const parsed = updateFileSchema.parse(req.body);
    
    const file = await fileService.updateFile(req.params.id as string, workspaceId, userId, parsed);
    res.status(200).json({ file });
  } catch (error) {
    next(error);
  }
};

export const deleteFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceId = (req as any).workspaceId as string;
    const userId = (req as any).user.userId as string;
    
    // We pass true to updateFile if doing soft delete, or call deleteFile for hard delete.
    // Based on user prompt: "Deleting a project should archive associated files." 
    // And "Can archive." / "Can restore." -> updateFile({ archived: true }) handles soft delete.
    // If they want hard delete we call fileService.deleteFile.
    if (req.query.hard === 'true') {
      await fileService.deleteFile(req.params.id as string, workspaceId, userId);
    } else {
      await fileService.updateFile(req.params.id as string, workspaceId, userId, { archived: true });
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const getStorageStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceId = (req as any).workspaceId as string;
    const stats = await fileService.getStorageStats(workspaceId);
    res.status(200).json({ stats });
  } catch (error) {
    next(error);
  }
};
