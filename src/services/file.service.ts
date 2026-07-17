import { apiClient } from "../api/axios";

export const FileService = {
  getFiles: async (filters: any = {}) => {
    const params = new URLSearchParams(filters).toString();
    return await apiClient.get(`/files?${params}`);
  },
  
  uploadFile: async (formData: FormData) => {
    return await apiClient.post("/files/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  },

  uploadNewVersion: async (id: string, formData: FormData) => {
    return await apiClient.post(`/files/${id}/versions`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  },

  getVersions: async (id: string) => {
    return await apiClient.get(`/files/${id}/versions`);
  },

  updateFile: async (id: string, data: any) => {
    return await apiClient.put(`/files/${id}`, data);
  },

  deleteFile: async (id: string, hard: boolean = false) => {
    return await apiClient.delete(`/files/${id}${hard ? '?hard=true' : ''}`);
  },

  getStorageStats: async () => {
    return await apiClient.get('/files/stats');
  }
};
