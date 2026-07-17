import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskService } from "../../services/task.service";
import type { TaskFilters } from "../../services/task.service";

export const useTasks = (filters: TaskFilters = {}) => {
  return useQuery({
    queryKey: ["tasks", filters],
    queryFn: async () => {
      const response = await taskService.getTasks(filters);
      return response;
    },
    // For admin global view, we might not have a specific projectId
    enabled: true,
  });
};

export const useTask = (taskId: string) => {
  return useQuery({
    queryKey: ["tasks", taskId],
    queryFn: async () => {
      return await taskService.getTask(taskId);
    },
    enabled: !!taskId,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      return await taskService.createTask(data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["projects", data?.projectId] });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return await taskService.updateTask(id, data);
    },
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previousQueries = queryClient.getQueriesData({ queryKey: ["tasks"] });
      
      queryClient.setQueriesData({ queryKey: ["tasks"] }, (old: any) => {
        if (!old?.items) return old;
        return {
          ...old,
          items: old.items.map((task: any) => task.id === id ? { ...task, ...data } : task)
        };
      });
      return { previousQueries };
    },
    onError: (err, variables, context: any) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]: any) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await taskService.deleteTask(id);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previousQueries = queryClient.getQueriesData({ queryKey: ["tasks"] });
      
      queryClient.setQueriesData({ queryKey: ["tasks"] }, (old: any) => {
        if (!old?.items) return old;
        return {
          ...old,
          items: old.items.filter((task: any) => task.id !== id)
        };
      });
      return { previousQueries };
    },
    onError: (err, variables, context: any) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]: any) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export const useBulkTaskOperation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { taskIds: string[]; action: string; value?: any }) => {
      return await taskService.bulkOperation(data);
    },
    onMutate: async ({ taskIds, action, value }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previousQueries = queryClient.getQueriesData({ queryKey: ["tasks"] });
      
      queryClient.setQueriesData({ queryKey: ["tasks"] }, (old: any) => {
        if (!old?.items) return old;
        let nextItems = [...old.items];
        
        if (action === 'delete') {
          nextItems = nextItems.filter((t: any) => !taskIds.includes(t.id));
        } else if (action === 'archive') {
          nextItems = nextItems.map((t: any) => taskIds.includes(t.id) ? { ...t, archived: true } : t);
        } else if (action === 'restore') {
          nextItems = nextItems.map((t: any) => taskIds.includes(t.id) ? { ...t, archived: false } : t);
        } else if (action === 'status') {
          nextItems = nextItems.map((t: any) => taskIds.includes(t.id) ? { ...t, status: value } : t);
        } else if (action === 'priority') {
          nextItems = nextItems.map((t: any) => taskIds.includes(t.id) ? { ...t, priority: value } : t);
        }
        
        return { ...old, items: nextItems };
      });
      return { previousQueries };
    },
    onError: (err, variables, context: any) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]: any) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export const useAddChecklistItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ taskId, title }: { taskId: string; title: string }) => {
      return await taskService.addChecklistItem(taskId, title);
    },
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", taskId] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export const useUpdateChecklistItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ taskId, itemId, data }: { taskId: string; itemId: string; data: any }) => {
      return await taskService.updateChecklistItem(taskId, itemId, data);
    },
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", taskId] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export const useRemoveChecklistItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ taskId, itemId }: { taskId: string; itemId: string }) => {
      return await taskService.removeChecklistItem(taskId, itemId);
    },
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", taskId] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};
