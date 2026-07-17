import React from "react";
import { motion } from "framer-motion";
import { CheckSquare, Upload } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { useNavigate } from "react-router-dom";

export const WelcomeSection = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 mt-2">
      <div>
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold font-heading text-text-primary mb-2"
        >
          Member Dashboard
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-sm text-text-muted"
        >
          Overview of your assigned tasks, projects, and recent activity.
        </motion.p>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.2 }}
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
