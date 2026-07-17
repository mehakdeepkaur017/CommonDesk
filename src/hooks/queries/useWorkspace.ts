import { useQuery } from "@tanstack/react-query";
import { WorkspaceService } from "../../services/workspace.service";
import type { Workspace } from "../../types";

export const useWorkspace = () => {
  return useQuery({
    queryKey: ["workspace"],
    queryFn: async (): Promise<Workspace> => {
      // Calls the actual Axios API layer.
      // With no backend, this will fail and gracefully trigger the ErrorBoundary / Skeleton.
      const response = await WorkspaceService.getWorkspace();
      return (response as any).workspace as Workspace;
    },
    retry: 1, // Minimize retries so the UI fails fast to empty state for testing
  });
};
