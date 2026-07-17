import { z } from "zod";

export const updateWorkspaceSchema = z.object({
  name: z.string().min(2, "Workspace name must be at least 2 characters").optional(),
  slug: z.string().min(2, "Workspace slug must be at least 2 characters").optional(),
  description: z.string().optional(),
  brandColor: z.string().optional(),
  logoUrl: z.string().optional(),
  publicJoinEnabled: z.boolean().optional(),
});
