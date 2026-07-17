import { z } from "zod";

export const uploadFileSchema = z.object({
  taskId: z.string().uuid().optional(),
  projectId: z.string().uuid().optional(),
  folder: z.string().optional(),
  description: z.string().optional(),
  visibility: z.string().optional(),
});

export const updateFileSchema = z.object({
  filename: z.string().min(1).optional(),
  description: z.string().optional(),
  visibility: z.string().optional(),
  projectId: z.string().uuid().nullable().optional(),
  folder: z.string().nullable().optional(),
  archived: z.boolean().optional(),
});
