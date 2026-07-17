import { apiClient } from "../api/axios";

export const InvitationService = {
  acceptInvitation: async (token: string, data?: any) => {
    return await apiClient.post(`/workspaces/invitations/${token}/accept`, data);
  }
};
