import React, { useState } from 'react';
import { Menu, Search, Bell, Building2, ChevronDown, User, LogOut, Settings } from 'lucide-react';
import { useWorkspace } from '../../../hooks/queries/useWorkspace';
import { useAuth } from '../../../context/AuthContext';
import { WorkspaceService } from '../../../services/workspace.service';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { ThemeSwitcher } from '../../ui/ThemeSwitcher';
import { CommandPalette } from '../../ui/CommandPalette';
import { useNotifications } from '../../../hooks/queries/useNotifications';
import { NotificationItem } from '../../ui/NotificationItem';
import { CheckCircle2 } from 'lucide-react';

export const AdminTopNavigation = ({ onOpenSidebar }: { onOpenSidebar: () => void }) => {
  const { data: workspace } = useWorkspace();
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const { data: stats } = useQuery({
    queryKey: ['workspace-stats', workspace?.id],
    queryFn: WorkspaceService.getWorkspaceStats,
    enabled: !!workspace?.id,
    refetchInterval: 3000, // Poll for live updates
  });

  // Helper for InitialsAvatar
  const getInitials = (name?: string) => {
    if (!name) return 'A';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="h-16 bg-surface border-b border-surface-border flex items-center justify-between px-4 lg:px-8 shrink-0 relative z-30">
      <div className="flex items-center gap-4">
        <button 
          onClick={onOpenSidebar}
          className="md:hidden p-2 -ml-2 text-text-secondary hover:text-text-primary rounded-lg hover:bg-surface-hover transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Command Palette Trigger */}
        <button 
          onClick={() => setIsCommandPaletteOpen(true)}
          className="hidden sm:flex items-center gap-3 px-4 py-1.5 rounded-lg bg-surface-hover border border-surface-border text-sm text-text-muted hover:text-text-secondary transition-colors w-64 group"
        >
          <Search className="w-4 h-4 group-hover:text-brand-indigo transition-colors" />
          <span className="flex-1 text-left">Search admin console...</span>
          <div className="flex items-center gap-1 opacity-60">
            <kbd className="px-1.5 py-0.5 rounded bg-surface border border-surface-border text-[10px] font-sans">⌘</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-surface border border-surface-border text-[10px] font-sans">K</kbd>
          </div>
        </button>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Workspace Switcher */}
        <button className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-surface-hover transition-colors text-sm text-text-primary">
          <div className="w-5 h-5 rounded flex items-center justify-center bg-brand-indigo/20 text-brand-indigo">
            <Building2 className="w-3 h-3" />
          </div>
          <span className="font-medium">{workspace?.name || 'Workspace'}</span>
          <ChevronDown className="w-3 h-3 text-text-secondary" />
        </button>

        <div className="w-px h-6 bg-surface-border hidden lg:block mx-2" />

        <ThemeSwitcher />

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              setIsProfileOpen(false);
            }}
            className="relative w-9 h-9 rounded-lg flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-surface animate-pulse" />
            )}
          </button>

          <AnimatePresence>
            {isNotificationsOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)", transition: { duration: 0.1 } }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="absolute right-0 top-full mt-2 w-80 glass-card rounded-2xl border border-surface-border bg-surface shadow-2xl z-50 overflow-hidden flex flex-col premium-shadow-hover"
                >
                  <div className="p-4 border-b border-surface-border flex items-center justify-between bg-surface/50">
                    <span className="text-sm font-bold text-text-primary tracking-tight">
                      Notifications {unreadCount > 0 && <span className="bg-brand-indigo/10 text-brand-indigo px-1.5 py-0.5 rounded-md ml-1 text-xs">{unreadCount} new</span>}
                    </span>
                    {unreadCount > 0 && (
                      <button onClick={() => markAllAsRead()} className="text-xs font-semibold text-brand-indigo hover:text-brand-violet transition-colors flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Mark all read
                      </button>
                    )}
                  </div>
                  
                  <div className="max-h-[400px] overflow-y-auto scrollbar-thin">
                    {notifications.length === 0 ? (
                      <div className="p-8 flex flex-col items-center justify-center text-center bg-background/50">
                        <motion.div 
                          initial={{ rotate: -10 }}
                          animate={{ rotate: [10, -10, 10, 0] }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        >
                          <Bell className="w-10 h-10 text-text-muted mb-3 opacity-50" />
                        </motion.div>
                        <p className="text-sm font-semibold text-text-primary mb-1">No new notifications</p>
                        <p className="text-xs text-text-muted">We'll alert you when something happens.</p>
                      </div>
                    ) : (
                      notifications.slice(0, 10).map((notification: any) => (
                        <NotificationItem 
                          key={notification.id} 
                          notification={notification} 
                          onClick={(id, link) => {
                            if (!notification.read) markAsRead(id);
                            setIsNotificationsOpen(false);
                            if (link) navigate(link);
                          }} 
                        />
                      ))
                    )}
                  </div>

                  <div 
                    onClick={() => {
                      setIsNotificationsOpen(false);
                      navigate("/admin/notifications");
                    }}
                    className="p-3 border-t border-surface-border text-center text-xs font-bold text-text-secondary hover:text-text-primary hover:bg-surface-hover cursor-pointer transition-colors uppercase tracking-wider"
                  >
                    View All Activity
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Menu */}
        <div className="relative ml-2">
          <button 
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsNotificationsOpen(false);
            }}
            className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-indigo to-brand-violet flex items-center justify-center text-sm font-bold text-white shadow-lg border-2 border-transparent hover:border-surface-border transition-all focus:outline-none overflow-hidden"
          >
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              getInitials(user?.name)
            )}
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-3 w-56 bg-surface border border-surface-border rounded-xl shadow-2xl py-2 z-50 overflow-hidden origin-top-right"
                >
                  <div className="px-4 py-2 border-b border-surface-border mb-2">
                    <p className="text-sm font-bold text-text-primary truncate">{user?.name}</p>
                    <p className="text-xs text-brand-indigo uppercase tracking-wider font-semibold mt-0.5">{user?.role}</p>
                  </div>
                  
                  <button 
                    onClick={() => {
                      setIsProfileOpen(false);
                      navigate('/admin/profile');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
                  >
                    <User className="w-4 h-4" /> My Profile
                  </button>
                  
                  <div className="h-px bg-surface-border my-2" />
                  
                  <button 
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      <CommandPalette 
        isOpen={isCommandPaletteOpen} 
        onClose={() => setIsCommandPaletteOpen(false)} 
      />
    </header>
  );
};
