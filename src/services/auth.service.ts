import { apiClient } from "../api/axios";

export const AuthService = {
  login: async (data: any) => {
    return await apiClient.post("/auth/login", data);
  },
  registerOrg: async (data: any) => {
    return await apiClient.post("/auth/register-org", data);
  },
  joinOrg: async (data: any) => {
    return await apiClient.post("/auth/join-org", data);
  },
  me: async () => {
    const response = await apiClient.get('/auth/me');
    return response;
  },
  updateProfile: async (data: { name: string }) => {
    const response = await apiClient.patch('/auth/me', data);
    return response;
  },
  uploadAvatar: async (formData: FormData) => {
    const response = await apiClient.post('/auth/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response;
  },

  getJoinStatus: async () => {
    const response = await apiClient.get('/auth/join-status');
    return response;
  },
};
