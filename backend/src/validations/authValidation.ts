import { z } from "zod";

export const registerOrgSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  name: z.string().min(2, "Name must be at least 2 characters long"),
  organizationName: z.string().min(2, "Organization Name must be at least 2 characters long"),
});

export const joinOrgSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  name: z.string().min(2, "Name must be at least 2 characters long"),
  workspaceCode: z.string().min(1, "Workspace Code is required"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
