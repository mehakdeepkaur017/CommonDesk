import { apiClient } from "../api/axios";

export interface ActivityFilters {
  page?: number;
  limit?: number;
  action?: string;
  projectId?: string;
  taskId?: string;
}

export const activityService = {
  getGlobalActivity: async (page = 1, limit = 50) => {
    const res = await apiClient.get(`/activity?page=${page}&limit=${limit}`);
    return res; // { items, page, limit, totalPages, totalItems }
  },
};
