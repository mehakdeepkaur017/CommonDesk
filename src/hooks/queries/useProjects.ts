import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../api/axios";

export const useProjects = (filters: any = {}, page = 1, limit = 50) => {
  return useQuery({
    queryKey: ["projects", filters, page, limit],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      searchParams.append("page", page.toString());
      searchParams.append("limit", limit.toString());
      if (filters.status) searchParams.append("status", filters.status);
      if (filters.archived !== undefined) searchParams.append("archived", filters.archived.toString());

      const response = await apiClient.get(`/projects?${searchParams.toString()}`);
      return response;
    },
  });
};

export const useProject = (projectId: string) => {
  return useQuery({
    queryKey: ["projects", projectId],
    queryFn: async () => {
      const response = await apiClient.get(`/projects/${projectId}`);
      return (response as any).project;
    },
    enabled: !!projectId,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post("/projects", data);
      return (response as any).project;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["workspace-stats"] });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await apiClient.patch(`/projects/${id}`, data);
      return (response as any).project;
    },
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ["projects"] });

      // Snapshot all current project list caches
      const previousQueries = queryClient.getQueriesData({ queryKey: ["projects"] });

      // Optimistically update every cached project list
      queryClient.setQueriesData({ queryKey: ["projects"] }, (old: any) => {
        if (!old) return old;
        // Handle paginated format { items: [...] }
        if (old.items && Array.isArray(old.items)) {
          return {
            ...old,
            items: old.items.map((p: any) => p.id === id ? { ...p, ...data } : p),
          };
        }
        // Handle flat array format
        if (Array.isArray(old)) {
          return old.map((p: any) => p.id === id ? { ...p, ...data } : p);
        }
        return old;
      });

      return { previousQueries };
    },
    onError: (_err, _vars, context) => {
      // Roll back all caches to their previous state
      if (context?.previousQueries) {
        for (const [queryKey, data] of context.previousQueries) {
          queryClient.setQueryData(queryKey, data);
        }
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure server state is canonical
      queryClient.invalidateQueries({ queryKey: ["projects"], refetchType: "all" });
      queryClient.invalidateQueries({ queryKey: ["workspace-stats"], refetchType: "all" });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["workspace-stats"] });
    },
  });
};

export const useAddProjectMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ projectId, userId, role }: { projectId: string; userId: string; role?: string }) => {
      const response = await apiClient.post(`/projects/${projectId}/members`, { userId, role });
      return (response as any).member;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["projects", variables.projectId] });
    },
  });
};

export const useRemoveProjectMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ projectId, userId }: { projectId: string; userId: string }) => {
      await apiClient.delete(`/projects/${projectId}/members/${userId}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["projects", variables.projectId] });
    },
  });
};
