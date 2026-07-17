import { apiClient } from "../api/axios";

export const roleService = {
  getRoles: async () => {
    return await apiClient.get("/roles");
  },

  createRole: async (data: any) => {
    return await apiClient.post("/roles", data);
  },

  updateRole: async (id: string, data: any) => {
    return await apiClient.patch(`/roles/${id}`, data);
  },

  deleteRole: async (id: string) => {
    return await apiClient.delete(`/roles/${id}`);
  }
};
