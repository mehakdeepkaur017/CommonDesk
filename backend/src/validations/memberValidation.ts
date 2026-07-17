import { z } from "zod";

export const updateMemberRoleSchema = z.object({
  roleId: z.string().uuid("Invalid Role ID"),
});
