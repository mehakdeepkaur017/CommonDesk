import { Request, Response, NextFunction } from "express";

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    error: true,
    code: "NOT_FOUND",
    message: `Cannot find ${req.method} ${req.originalUrl}`,
  });
};
