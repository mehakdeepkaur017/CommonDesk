import { z } from "zod";

export const inviteMemberSchema = z.object({
  email: z.string().email("Invalid email address"),
  roleId: z.string().uuid("Invalid Role ID"),
});

export const acceptInvitationSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters").optional(), // if new user
  name: z.string().min(2, "Name is required").optional(), // if new user
});
