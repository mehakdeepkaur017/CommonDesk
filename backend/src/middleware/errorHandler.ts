import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Global Error:", err);
  
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "Validation failed",
      details: err.issues.map((e) => ({
        path: e.path.join("."),
        message: e.message,
      })),
    });
  }

  // Handle Prisma Unique Constraint Violation
  if (err.code === 'P2002') {
    const target = err.meta?.target ? err.meta.target[0] : 'field';
    return res.status(409).json({
      error: true,
      code: "CONFLICT",
      message: `A record with this ${target} already exists.`
    });
  }

  // Handle Prisma Record Not Found
  if (err.code === 'P2025') {
    return res.status(404).json({
      error: true,
      code: "NOT_FOUND",
      message: "The requested record was not found."
    });
  }

  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({
    error: true,
    code: status === 500 ? "INTERNAL_ERROR" : "API_ERROR",
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
