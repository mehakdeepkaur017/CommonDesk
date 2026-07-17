import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../api/axios";

export const useAnalytics = (timeRange: string = '30d') => {
  return useQuery({
    queryKey: ["analytics", timeRange],
    queryFn: async () => {
      const response = await apiClient.get(`/analytics?timeRange=${timeRange}`);
      return response as any;
    },
  });
};
