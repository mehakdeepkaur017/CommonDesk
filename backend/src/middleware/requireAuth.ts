import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/authUtils";

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: true, code: "UNAUTHORIZED", message: "Authentication required" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = verifyAccessToken(token);
    (req as any).user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ error: true, code: "UNAUTHORIZED", message: "Invalid or expired token" });
  }
};
