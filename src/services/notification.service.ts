import { apiClient } from "../api/axios";

export interface Notification {
  id: string;
  workspaceId: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

export const NotificationService = {
  getNotifications: async (page = 1, limit = 50) => {
    // Due to the interceptor, apiClient returns response.data directly
    return apiClient.get<any, { notifications: Notification[], page: number, limit: number }>(`/notifications?page=${page}&limit=${limit}`);
  },

  markAsRead: async (id: string) => {
    return apiClient.patch<any, { success: boolean }>(`/notifications/${id}/read`);
  },

  markAllAsRead: async () => {
    return apiClient.patch<any, { success: boolean }>(`/notifications/mark-all-read`);
  },
};
