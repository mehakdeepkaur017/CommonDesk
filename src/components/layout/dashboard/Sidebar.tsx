import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FolderKanban, CheckSquare, Users, UserCircle,
  FileText, Activity, Bell, Settings,
  ChevronsUpDown, Plus, Moon, Sun, Home, ShieldCheck, X, LogOut
} from "lucide-react";

import { useAuth } from "../../../context/AuthContext";

import { useWorkspace } from "../../../hooks/queries/useWorkspace";
import { useProjects } from "../../../hooks/queries/useProjects";
import { useTheme } from "../../../context/ThemeContext";
import { WorkspaceAvatar } from '../../ui/WorkspaceAvatar';
import type { Project } from "../../../types";

const navigation = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Projects", href: "/dashboard/projects", icon: FolderKanban },
  { name: "My Tasks", href: "/dashboard/my-tasks", icon: CheckSquare },
  { name: "Files", href: "/dashboard/files", icon: FileText },
];

const adminNav = [
  { name: "Members", href: "/dashboard/members", icon: Users },
  { name: "My Profile", href: "/dashboard/profile", icon: UserCircle },
];

const secondaryNav = [
  { name: "Notifications", href: "/dashboard/notifications", icon: Bell, badge: "0" },
];

export const Sidebar = ({ onClose }: { onClose?: () => void }) => {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth();
  
  const { data: workspace, isLoading: wsLoading } = useWorkspace();
  const { data: projectData, isLoading: projLoading } = useProjects();
  const projects = projectData?.items || [];

  const NavItem = ({ item }: { item: { name: string; href: string; icon: any; badge?: string } }) => {
    const isActive = location.pathname === item.href || (location.pathname.startsWith(item.href) && item.href !== "/dashboard" && item.href !== "#");
    
    return (
      <Link
        to={item.href}
        onClick={onClose}
        className={`group relative flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 z-10 ${
          isActive 
            ? "text-brand-indigo font-medium" 
            : "text-text-secondary hover:text-text-primary"
        }`}
      >
        {isActive && (
          <motion.div
            layoutId="sidebar-active-pill"
            className="absolute inset-0 bg-brand-indigo/10 dark:bg-brand-indigo/20 rounded-xl -z-10"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}
        {!isActive && (
           <div className="absolute inset-0 bg-surface-hover rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10" />
        )}
        
        <div className="flex items-center gap-3">
          <item.icon className={`w-4 h-4 transition-colors ${isActive ? "text-brand-indigo" : "text-text-muted group-hover:text-text-primary"}`} />
          <span className="text-sm">{item.name}</span>
        </div>
        {item.badge && (
          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold shadow-sm ${
            isActive 
              ? "bg-brand-indigo text-white" 
              : "bg-surface-hover border border-surface-border text-text-secondary"
          }`}>
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <aside className="w-64 h-screen border-r border-surface-border bg-background flex flex-col fixed left-0 top-0 hidden md:flex">
      
      {/* Workspace Switcher */}
      {/* Sidebar Header - App Brand */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-surface-border shrink-0 bg-black/[0.02] dark:bg-white/[0.02]">
        <Link to="/dashboard" className="flex items-center gap-3" onClick={onClose}>
          <WorkspaceAvatar 
            name={workspace?.name || 'CommonDesk'}
            logoUrl={workspace?.logoUrl}
            brandColor={workspace?.brandColor}
            size="sm"
            className="w-8 h-8 rounded-lg"
          />
          <span className="text-text-primary font-bold font-heading text-[15px] tracking-tight">
            {workspace?.name || 'CommonDesk'}
          </span>
        </Link>
        {onClose && (
          <button 
            onClick={onClose}
            className="md:hidden p-1.5 text-text-muted hover:text-text-primary hover:bg-surface-hover rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-8 scrollbar-none">
        
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ staggerChildren: 0.1 }}
          className="space-y-1"
        >
          <div className="px-3 mb-3 text-[11px] font-bold text-text-muted tracking-widest uppercase">Workspace</div>
          {navigation.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, staggerChildren: 0.1 }}
          className="space-y-1"
        >
          <div className="px-3 mb-3 text-[11px] font-bold text-text-muted tracking-widest uppercase">Administration</div>
          {adminNav.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </motion.div>


      </div>

      <div className="shrink-0 p-4 border-t border-surface-border mt-auto">
        <button
          onClick={logout}
          className="w-full group flex items-center gap-3 px-3 py-2.5 rounded-xl text-text-secondary hover:text-red-500 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
