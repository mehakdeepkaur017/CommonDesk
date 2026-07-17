import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(2, "Project name must be at least 2 characters"),
  description: z.string().optional(),
  status: z.enum(["active", "completed", "on_hold", "archived"]).optional(),
  visibility: z.enum(["workspace", "private"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  members: z.array(z.object({
    userId: z.string(),
    role: z.enum(["owner", "manager", "member"])
  })).optional(),
});

export const updateProjectSchema = createProjectSchema.partial();
