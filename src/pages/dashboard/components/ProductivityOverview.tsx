import React from "react";
import { FolderKanban, CheckSquare, Users, FileBox } from "lucide-react";
import { motion } from "framer-motion";
import { useWorkspace } from "../../../hooks/queries/useWorkspace";
import { useProjects } from "../../../hooks/queries/useProjects";
import { useTasks } from "../../../hooks/queries/useTasks";
import { useMembers } from "../../../hooks/queries/useMembers";
import { useFiles } from "../../../hooks/queries/useFiles";
import { useAuth } from "../../../context/AuthContext";

export const ProductivityOverview = () => {
  const { user } = useAuth();
  const { isLoading: wsLoading } = useWorkspace();
  const { data: projects, isLoading: pLoading } = useProjects();
  const { data: tasks, isLoading: tLoading } = useTasks({ assigneeId: user?.id, status: 'done' });
  const { data: members, isLoading: mLoading } = useMembers();
  const { data: files, isLoading: fLoading } = useFiles();

  const isLoading = wsLoading || pLoading || tLoading || mLoading || fLoading;

  const statCards = [
    { id: "projects", label: "Active Projects", icon: FolderKanban, value: projects?.totalItems || projects?.total || 0, color: "text-brand-indigo", bg: "bg-brand-indigo/10" },
    { id: "tasks", label: "Completed Tasks", icon: CheckSquare, value: tasks?.totalItems || tasks?.total || 0, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { id: "members", label: "Team Members", icon: Users, value: members?.totalItems || members?.total || 0, color: "text-blue-500", bg: "bg-blue-500/10" },
    { id: "files", label: "Files Stored", icon: FileBox, value: files?.totalItems || files?.total || 0, color: "text-brand-violet", bg: "bg-brand-violet/10" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
    >
      {statCards.map((stat) => (
        <motion.div
          key={stat.id}
          variants={itemVariants}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="glass-card p-5 rounded-2xl border border-surface-border bg-surface premium-shadow hover:premium-shadow-hover transition-all duration-300 relative overflow-hidden group"
        >
          {/* Subtle gradient background effect on hover */}
          <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-gradient-to-br from-brand-indigo/5 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="flex items-start justify-between mb-6 relative">
            <div className={`p-2.5 rounded-xl ${stat.bg} shadow-sm`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
          </div>
          
          <div className="relative">
            <div className="text-3xl font-bold font-heading text-text-primary tracking-tight mb-1">
              {isLoading ? (
                <div className="w-16 h-8 bg-surface-hover rounded animate-pulse" />
              ) : (
                stat.value
              )}
            </div>
            <div className="text-sm font-medium text-text-secondary">{stat.label}</div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};
