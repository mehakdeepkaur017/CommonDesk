import { useQuery } from "@tanstack/react-query";
import { activityService, type ActivityFilters } from "../../services/activity.service";

export const useActivity = (filters?: ActivityFilters) => {
  return useQuery({
    queryKey: ["activity", filters],
    queryFn: () => activityService.listActivity(filters),
  });
};
