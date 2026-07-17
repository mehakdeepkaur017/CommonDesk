import React from "react";
import { motion } from "framer-motion";
import { Clock, LogOut } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { AuthService } from "../../services/auth.service";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, XCircle } from "lucide-react";

export const PendingApproval = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const { data: joinStatus, isLoading } = useQuery({
    queryKey: ['join-status'],
    queryFn: async () => {
      const data = await AuthService.getJoinStatus();
      return data;
    },
    refetchInterval: 3000, // Poll every 3 seconds
  });

  // Automatically redirect if approved and reload workspaces
  React.useEffect(() => {
    if (joinStatus?.status === 'approved') {
      // Short delay for animation
      setTimeout(() => {
        // Simple reload to trigger AuthContext re-fetch of workspaces
        window.location.href = '/dashboard';
      }, 2000);
    }
  }, [joinStatus]);

  if (joinStatus?.status === 'approved') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-surface border border-emerald-500/30 rounded-2xl p-8 text-center shadow-2xl"
        >
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-4 border-emerald-500 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
          
          <h2 className="text-3xl font-bold font-heading mb-2 text-text-primary">Approved!</h2>
          <p className="text-text-secondary mb-8">
            Welcome to <strong className="text-white">{joinStatus.workspace?.name}</strong>. 
            Redirecting you to the dashboard...
          </p>
          <div className="w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto" />
        </motion.div>
      </div>
    );
  }

  if (joinStatus?.status === 'rejected') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-surface border border-red-500/30 rounded-2xl p-8 text-center shadow-xl"
        >
          <div className="w-16 h-16 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
          
          <h2 className="text-2xl font-bold font-heading mb-2 text-text-primary">Request Declined</h2>
          <p className="text-text-secondary mb-8">
            Sorry {user?.name}, your request to join <strong className="text-white">{joinStatus.workspace?.name}</strong> was declined by an administrator.
          </p>
          <div className="flex gap-4">
            <Button variant="outline" className="flex-1" onClick={logout}>
              Sign Out
            </Button>
            <Button className="flex-1" onClick={() => navigate('/auth/join-organization')}>
              Try Another Code
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-surface border border-surface-border rounded-2xl p-8 text-center shadow-xl"
      >
        <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center mx-auto mb-6">
          <Clock className="w-8 h-8 text-amber-400" />
        </div>
        
        <h2 className="text-2xl font-bold font-heading mb-2 text-text-primary">Approval Pending</h2>
        <p className="text-text-secondary mb-8">
          Hi {user?.name}, your request to join {joinStatus?.workspace?.name ? <strong className="text-white">{joinStatus.workspace.name}</strong> : 'the workspace'} is currently pending approval from an administrator.
        </p>

        <div className="p-4 bg-surface-hover rounded-xl mb-8">
          <p className="text-sm text-text-muted">
            Please check back later and sign in once your request has been reviewed by an administrator.
          </p>
        </div>

        <Button variant="outline" className="w-full" onClick={logout}>
          <LogOut className="w-4 h-4 mr-2" /> Sign Out
        </Button>
      </motion.div>
    </div>
  );
};
