import * as roleRepository from "../repositories/roleRepository";
import { logAudit } from "./auditService";
import { z } from "zod";
import { createRoleSchema, updateRoleSchema } from "../validations/roleValidation";

export const listRoles = async (workspaceId: string) => {
  return roleRepository.findRolesByWorkspace(workspaceId);
};

export const createRole = async (workspaceId: string, adminId: string, data: z.infer<typeof createRoleSchema>) => {
  const role = await roleRepository.createRole(workspaceId, data.name, data.permissions);
  
  await logAudit({
    workspaceId,
    userId: adminId,
    action: "ROLE_CREATED",
    entityType: "Role",
    entityId: role.id,
    details: data,
  });

  return role;
};

export const updateRole = async (roleId: string, workspaceId: string, adminId: string, data: z.infer<typeof updateRoleSchema>) => {
  const existingRole = await roleRepository.findRoleById(roleId, workspaceId);
  if (!existingRole || existingRole.workspaceId !== workspaceId) {
    throw { status: 404, message: "Role not found or is a system role" };
  }

  if (existingRole.name === 'ADMIN' || existingRole.name === 'SUPER ADMIN') {
    throw { status: 403, message: "System roles cannot be modified" };
  }

  const role = await roleRepository.updateRole(roleId, workspaceId, data.name, data.permissions);

  await logAudit({
    workspaceId,
    userId: adminId,
    action: "ROLE_UPDATED",
    entityType: "Role",
    entityId: roleId,
    details: data,
  });

  return role;
};

export const deleteRole = async (roleId: string, workspaceId: string, adminId: string) => {
  const existingRole = await roleRepository.findRoleById(roleId, workspaceId);
  if (!existingRole || existingRole.workspaceId !== workspaceId) {
    throw { status: 404, message: "Role not found or is a system role" };
  }

  if (existingRole.name === 'ADMIN' || existingRole.name === 'SUPER ADMIN') {
    throw { status: 403, message: "System roles cannot be deleted" };
  }

  await roleRepository.deleteRole(roleId, workspaceId);

  await logAudit({
    workspaceId,
    userId: adminId,
    action: "ROLE_DELETED",
    entityType: "Role",
    entityId: roleId,
  });
};
