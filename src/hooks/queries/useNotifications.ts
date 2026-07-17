import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { NotificationService } from "../../services/notification.service";
import type { Notification } from "../../services/notification.service";
import { useAuth } from "../../context/AuthContext";

export const useNotifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => NotificationService.getNotifications(1, 50),
    enabled: !!user,
    refetchInterval: 10000, // Poll every 10 seconds for real-time updates
  });

  const markAsRead = useMutation({
    mutationFn: (id: string) => NotificationService.markAsRead(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      const previous = queryClient.getQueryData(["notifications"]);
      
      queryClient.setQueryData(["notifications"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          notifications: old.notifications.map((n: Notification) => 
            n.id === id ? { ...n, read: true } : n
          )
        };
      });

      return { previous };
    },
    onError: (err, id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["notifications"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markAllAsRead = useMutation({
    mutationFn: () => NotificationService.markAllAsRead(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      const previous = queryClient.getQueryData(["notifications"]);
      
      queryClient.setQueryData(["notifications"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          notifications: old.notifications.map((n: Notification) => ({ ...n, read: true }))
        };
      });

      return { previous };
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["notifications"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const notifications = data?.notifications || [];
  const unreadCount = notifications.filter((n: Notification) => !n.read).length;

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead: markAsRead.mutate,
    markAllAsRead: markAllAsRead.mutate,
    refetch,
  };
};
