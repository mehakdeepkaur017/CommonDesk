import { apiClient } from "../api/axios";
import type { Project } from "../types";

export const ProjectService = {
  getProjects: async () => {
    return await apiClient.get("/projects");
  },
  
  getProjectById: async (id: string) => {
    return await apiClient.get(`/projects/${id}`);
  },

  createProject: async (data: Partial<Project> & { name: string; status: string; priority: string; visibility: string }) => {
    return await apiClient.post("/projects", data);
  },

  updateProject: async (id: string, data: Partial<Project>) => {
    return await apiClient.put(`/projects/${id}`, data);
  },

  deleteProject: async (id: string) => {
    return await apiClient.delete(`/projects/${id}`);
  }
};
