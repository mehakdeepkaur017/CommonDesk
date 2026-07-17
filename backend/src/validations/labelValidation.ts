import { z } from "zod";

export const createLabelSchema = z.object({
  name: z.string().min(1, "Label name is required"),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Must be a valid hex color code"),
});

export const assignLabelSchema = z.object({
  labelId: z.string().uuid(),
});
