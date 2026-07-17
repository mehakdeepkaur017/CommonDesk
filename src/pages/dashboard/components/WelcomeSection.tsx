import React from "react";
import { motion } from "framer-motion";
import { FolderKanban, CheckSquare, UserPlus, Upload, ShieldCheck } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { useWorkspace } from "../../../hooks/queries/useWorkspace";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const WelcomeSection = () => {
  const { data: workspace, isLoading } = useWorkspace();
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 mt-4">
      <div className="space-y-5">
        <motion.div
          initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3"
        >
          <div className="px-3 py-1.5 rounded-lg text-xs font-bold bg-brand-indigo/10 text-brand-indigo border border-brand-indigo/20 flex items-center gap-2 w-fit shadow-sm uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            {isLoading ? "Loading..." : workspace?.name || "Workspace"}
          </div>
          <span className="text-text-muted text-xs font-semibold uppercase tracking-wider hidden sm:inline">Last updated: Just now</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-4xl sm:text-5xl font-bold font-heading text-text-primary tracking-tight leading-tight"
        >
          Greetings, {user?.name?.split(' ')[0] || "User"} 👋
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-lg font-medium text-text-secondary max-w-xl"
        >
          Welcome back to your workspace. Here is what's happening today.
        </motion.p>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.3 }}
        className="flex flex-wrap items-center gap-3 bg-surface p-2 rounded-2xl border border-surface-border premium-shadow-hover w-fit"
      >
        <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/files?upload=true")} className="hidden sm:flex rounded-xl font-semibold">
          <Upload className="w-4 h-4 mr-2" /> Upload File
        </Button>
        <Button size="sm" onClick={() => navigate("/dashboard/tasks?create=true")} className="sm:hidden w-full justify-center rounded-xl font-semibold">
          <CheckSquare className="w-4 h-4 mr-2" /> New Task
        </Button>
      </motion.div>
    </div>
  );
};
