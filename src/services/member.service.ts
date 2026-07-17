import { apiClient } from "../api/axios";

export const memberService = {
  getWorkspaceMembers: async (filters?: Record<string, any>) => {
    const params = new URLSearchParams(filters as any).toString();
    return await apiClient.get(`/workspaces/members?${params}`);
  },

  inviteMember: async (data: { email: string; roleId: string }) => {
    return await apiClient.post("/workspaces/members/invite", data);
  },

  removeMember: async (id: string) => {
    return await apiClient.delete(`/workspaces/members/${id}`);
  },

  updateRole: async (id: string, roleId: string) => {
    return await apiClient.patch(`/workspaces/members/${id}/role`, { roleId });
  },

  suspendMember: async (id: string) => {
    return await apiClient.patch(`/workspaces/members/${id}/suspend`);
  },

  reactivateMember: async (id: string) => {
    return await apiClient.patch(`/workspaces/members/${id}/reactivate`);
  }
};
