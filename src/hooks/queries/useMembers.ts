import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { memberService } from "../../services/member.service";
import type { Member } from "../../types";

export const useMembers = (filters?: { search?: string, role?: string, status?: string, page?: number, limit?: number }) => {
  return useQuery({
    queryKey: ["members", filters],
    queryFn: async () => {
      const res = await memberService.getWorkspaceMembers(filters);
      return res as { items: Member[], total: number, page: number, totalPages: number };
    },
    retry: 1,
  });
};

export const useUpdateMemberRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ memberId, roleId }: { memberId: string, roleId: string }) => {
      return await memberService.updateRole(memberId, roleId);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["members"] })
  });
};

export const useUpdateMemberStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ memberId, status }: { memberId: string, status: "suspended" | "active" }) => {
      if (status === "suspended") {
        return await memberService.suspendMember(memberId);
      } else {
        return await memberService.reactivateMember(memberId);
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["members"] })
  });
};

export const useRemoveMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (memberId: string) => {
      return await memberService.removeMember(memberId);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["members"] })
  });
};
