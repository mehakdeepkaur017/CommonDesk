import React, { useState } from "react";
import { Search, Plus, Bell, ChevronRight, Menu, CheckCircle2, UserCircle, Settings as SettingsIcon, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useWorkspace } from "../../../hooks/queries/useWorkspace";
import { useAuth } from "../../../context/AuthContext";
import { ThemeSwitcher } from "../../ui/ThemeSwitcher";
import { Button } from "../../ui/Button";
import { useNotifications } from "../../../hooks/queries/useNotifications";
import { NotificationItem } from "../../ui/NotificationItem";

export const TopToolbar = () => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();
  const { data: workspace } = useWorkspace();
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const handleSearchClick = () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
  };

  const getInitials = (name?: string) => {
    if (!name) return 'A';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <header className="h-16 border-b border-surface-border bg-background/80 backdrop-blur-xl sticky top-0 z-40 flex items-center justify-between px-4 sm:px-8 transition-colors duration-200">
      
      {/* Left side: Breadcrumbs & Mobile Menu */}
      <div className="flex items-center gap-4">
        <button className="md:hidden text-text-secondary hover:text-text-primary transition-colors">
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-sm font-semibold tracking-tight">
          <Link to="/dashboard" className="text-text-muted hover:text-text-primary transition-colors">{workspace?.name || "Workspace"}</Link>
          <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
          <span className="text-text-primary">Dashboard</span>
        </div>
      </div>

      {/* Center: Global Search (Command Palette Shortcut) */}
      <div 
        className="flex-1 max-w-xl mx-4 sm:mx-8 hidden sm:block relative cursor-pointer" 
        onClick={handleSearchClick}
        onMouseEnter={() => setIsSearchFocused(true)}
        onMouseLeave={() => setIsSearchFocused(false)}
      >
        <motion.div 
          animate={{ scale: isSearchFocused ? 1.01 : 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="relative"
        >
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className={`w-4 h-4 transition-colors ${isSearchFocused ? "text-brand-indigo" : "text-text-muted"}`} />
          </div>
          <div 
            className={`w-full h-10 flex items-center bg-surface border rounded-xl pl-10 pr-16 text-sm transition-all duration-200 shadow-sm
              ${isSearchFocused ? "border-brand-indigo ring-2 ring-brand-indigo/20 text-text-primary" : "border-surface-border text-text-muted hover:border-surface-border/80"}
            `}
          >
            Search anything...
          </div>
          <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
            <div className={`flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold border transition-colors ${isSearchFocused ? "bg-brand-indigo/10 text-brand-indigo border-brand-indigo/20" : "bg-surface-hover text-text-muted border-surface-border"}`}>
              <span>⌘</span>
              <span>K</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right side: Actions, Presence, Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        
        {/* Quick Create */}
        <Button 
          size="sm" 
          onClick={() => navigate("/dashboard/projects")} 
          className="hidden sm:flex"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          New Project
        </Button>

        <div className="w-px h-5 bg-surface-border hidden sm:block" />

        <div className="hidden sm:block">
          <ThemeSwitcher />
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button 
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              setIsProfileOpen(false);
            }}
            className={`relative text-text-secondary hover:text-text-primary transition-colors p-2 rounded-xl hover:bg-surface-hover ${isNotificationsOpen ? "bg-surface-hover text-text-primary" : ""}`}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-indigo opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-indigo border-2 border-background"></span>
              </span>
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
                  className="absolute right-0 sm:right-0 -right-12 top-full mt-2 w-80 glass-card rounded-2xl border border-surface-border bg-surface shadow-2xl z-50 overflow-hidden flex flex-col premium-shadow-hover"
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
                      notifications.slice(0, 10).map(notification => (
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
                      navigate("/dashboard/notifications");
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

        {/* Profile & Dropdown */}
        <div className="relative">
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
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.1 } }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="absolute right-0 top-full mt-2 w-56 glass-card rounded-2xl border border-surface-border bg-surface shadow-2xl z-50 overflow-hidden flex flex-col premium-shadow"
                >
                  <div className="p-4 border-b border-surface-border bg-surface/50">
                    <p className="text-sm font-bold text-text-primary tracking-tight">{user?.name || "User"}</p>
                    <p className="text-xs font-medium text-text-muted truncate mt-0.5">{user?.email || "user@example.com"}</p>
                  </div>
                  <div className="p-1.5">
                    <button onClick={() => { setIsProfileOpen(false); navigate("/dashboard/profile"); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-hover rounded-xl transition-colors">
                      <UserCircle className="w-4 h-4" /> My Profile
                    </button>
                  </div>
                  <div className="p-1.5 border-t border-surface-border">
                    <button onClick={logout} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors">
                      <LogOut className="w-4 h-4" /> Log out
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
        
      </div>
    </header>
  );
};
