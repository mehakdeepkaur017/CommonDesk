import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { roleService } from "../../services/role.service";

export const useRoles = () => {
  return useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const res = await roleService.getRoles();
      return (res as any).roles || [];
    },
    retry: 1,
  });
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      return await roleService.createRole(data);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["roles"] })
  });
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      return await roleService.updateRole(id, data);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["roles"] })
  });
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return await roleService.deleteRole(id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["roles"] })
  });
};
