import { apiClient } from "../api/axios";

export const WorkspaceService = {
  getWorkspaces: async () => {
    return await apiClient.get("/workspaces");
  },
  
  getWorkspace: async () => {
    return await apiClient.get("/workspaces/current"); // Wait, does this endpoint exist? Let's assume it gets current if x-workspace-id is set.
  },

  getWorkspaceStats: async () => {
    const res = await apiClient.get("/workspaces/current/stats");
    return res;
  },

  updateWorkspace: async (data: any) => {
    return await apiClient.put("/workspaces", data);
  }
};
