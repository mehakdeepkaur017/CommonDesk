import { Request, Response, NextFunction } from "express";
import * as searchService from "../services/searchService";

export const search = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceId = (req as any).workspaceId as string;
    const query = (req.query.q as string) || "";
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    if (!query) {
       res.status(200).json({ projects: [], tasks: [], members: [] });
       return;
    }

    const data = await searchService.searchWorkspace(workspaceId, query, skip, limit);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
