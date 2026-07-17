import { apiClient } from "../api/axios";

export const AuditService = {
  getLogs: async (params?: Record<string, any>) => {
    const res = await apiClient.get("/workspaces/audit-logs", { params });
    return res.data;
  }
};
