import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FileService } from "../../services/file.service";

export const useFiles = (filters?: any, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["files", filters],
    queryFn: async () => {
      return await FileService.getFiles(filters);
    },
    enabled: options?.enabled,
  });
};

export const useStorageStats = () => {
  return useQuery({
    queryKey: ["files", "stats"],
    queryFn: async () => {
      return await FileService.getStorageStats();
    },
  });
};

export const useFileVersions = (fileId: string) => {
  return useQuery({
    queryKey: ["files", fileId, "versions"],
    queryFn: async () => {
      return await FileService.getVersions(fileId);
    },
    enabled: !!fileId,
  });
};

export const useUploadFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      return await FileService.uploadFile(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
    },
  });
};

export const useUploadNewVersion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, formData }: { id: string, formData: FormData }) => {
      return await FileService.uploadNewVersion(id, formData);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
      queryClient.invalidateQueries({ queryKey: ["files", variables.id, "versions"] });
    },
  });
};

export const useUpdateFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      return await FileService.updateFile(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
    },
  });
};

export const useDeleteFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, hard = false }: { id: string, hard?: boolean }) => {
      await FileService.deleteFile(id, hard);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
    },
  });
};
