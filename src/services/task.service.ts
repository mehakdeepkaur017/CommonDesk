import { apiClient } from "../api/axios";

export interface TaskFilters {
  projectId?: string;
  status?: string;
  assigneeId?: string;
  priority?: string;
  search?: string;
  due?: string;
  page?: number;
  limit?: number;
  archived?: boolean | string;
}

export const taskService = {
  getTasks: async (filters: TaskFilters = {}) => {
    const params = new URLSearchParams();
    if (filters.projectId) params.append("projectId", filters.projectId);
    if (filters.status) params.append("status", filters.status);
    if (filters.assigneeId) params.append("assigneeId", filters.assigneeId);
    if (filters.priority) params.append("priority", filters.priority);
    if (filters.search) params.append("search", filters.search);
    if (filters.due) params.append("due", filters.due);
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.archived !== undefined) params.append("archived", filters.archived.toString());

    return await apiClient.get(`/tasks?${params.toString()}`);
  },

  getTask: async (taskId: string) => {
    const data: any = await apiClient.get(`/tasks/${taskId}`);
    return data.task;
  },

  createTask: async (taskData: any) => {
    const data: any = await apiClient.post("/tasks", taskData);
    return data.task;
  },

  updateTask: async (taskId: string, updateData: any) => {
    const data: any = await apiClient.patch(`/tasks/${taskId}`, updateData);
    return data.task;
  },

  deleteTask: async (taskId: string) => {
    return await apiClient.delete(`/tasks/${taskId}`);
  },

  bulkOperation: async (operationData: { taskIds: string[]; action: string; value?: any }) => {
    return await apiClient.post(`/tasks/bulk`, operationData);
  },

  addChecklistItem: async (taskId: string, title: string) => {
    const data: any = await apiClient.post(`/tasks/${taskId}/checklists`, { title });
    return data.item;
  },

  updateChecklistItem: async (taskId: string, itemId: string, updateData: { title?: string; isCompleted?: boolean; position?: number }) => {
    const data: any = await apiClient.patch(`/tasks/${taskId}/checklists/${itemId}`, updateData);
    return data.item;
  },

  removeChecklistItem: async (taskId: string, itemId: string) => {
    return await apiClient.delete(`/tasks/${taskId}/checklists/${itemId}`);
  },

  getComments: async (taskId: string) => {
    return await apiClient.get(`/tasks/${taskId}/comments`);
  },

  addComment: async (taskId: string, content: string) => {
    const data: any = await apiClient.post(`/tasks/${taskId}/comments`, { content });
    return data.comment;
  }
};
