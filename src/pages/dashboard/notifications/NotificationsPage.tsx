import React, { useState } from "react";
import { motion } from "framer-motion";
import { Bell, CheckCircle2, MessageSquare, CheckSquare, FolderKanban, FileBox, Shield, Search, X } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { useNotifications } from "../../../hooks/queries/useNotifications";
import { useToast } from "../../../components/feedback/ToastContext";

const categories = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "mentions", label: "Mentions", icon: MessageSquare },
  { id: "tasks", label: "Tasks", icon: CheckSquare },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "files", label: "Files", icon: FileBox },
  { id: "system", label: "System", icon: Shield },
];

export const NotificationsPage = () => {
  const [activeCategory, setActiveCategory] = useState("unread");
  const { toast } = useToast();

  const { notifications, unreadCount, isLoading, markAllAsRead, markAsRead } = useNotifications();

  const handleMarkAll = async () => {
    try {
      await markAllAsRead();
      toast({ title: "Marked all as read", type: "success" });
    } catch(e) {
      toast({ title: "Failed to mark as read", type: "error" });
    }
  };

  const handleMarkOne = async (id: string) => {
    try {
      await markAsRead(id);
    } catch(e) {
      console.error(e);
    }
  };

  const filteredNotifications = notifications.filter((n: any) => {
    if (activeCategory === "unread") return !n.read;
    if (activeCategory === "all") return true;
    return n.type.toLowerCase().includes(activeCategory.toLowerCase());
  });



  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 h-full flex flex-col max-w-5xl mx-auto"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-text-primary mb-1">Notifications</h1>
          <p className="text-sm text-text-muted">Stay updated on workspace activity and mentions.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleMarkAll} disabled={unreadCount === 0} className="bg-surface-hover border-surface-border hover:bg-surface">
            <CheckCircle2 className="w-4 h-4 mr-2" /> Mark all as read
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0">
        
        {/* Categories Sidebar */}
        <div className="w-full md:w-56 shrink-0 space-y-1 overflow-x-auto md:overflow-y-auto flex flex-row md:flex-col scrollbar-none pb-4 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeCategory === cat.id 
                  ? "bg-brand-indigo/10 text-brand-indigo" 
                  : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
              }`}
            >
              {cat.icon ? <cat.icon className="w-4 h-4" /> : <Bell className="w-4 h-4 opacity-50" />}
              {cat.label}
              {cat.id === "unread" && (
                <span className={`ml-auto px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  activeCategory === "unread" ? "bg-brand-indigo/20 text-brand-indigo" : "bg-brand-indigo/10 text-brand-indigo"
                }`}>
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Notifications List Area */}
        <div className="flex-1 rounded-2xl border border-surface-border bg-black/[0.02] dark:bg-background overflow-hidden flex flex-col h-[500px] md:h-auto">
          
          <div className="p-4 border-b border-surface-border flex items-center justify-between bg-black/[0.01] dark:bg-background">
            <div className="relative w-full max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input 
                type="text" 
                placeholder="Filter notifications..." 
                className="w-full h-9 bg-surface-hover border border-surface-border rounded-lg pl-9 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-indigo/50 transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center justify-center text-center">
            {isLoading ? (
               <div className="w-8 h-8 border-4 border-brand-indigo/20 border-t-brand-indigo rounded-full animate-spin" />
            ) : filteredNotifications.length === 0 ? (
              <div className="max-w-xs mx-auto">
                <div className="w-20 h-20 bg-brand-indigo/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-brand-indigo/20">
                  <Bell className="w-10 h-10 text-brand-indigo opacity-80" />
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-2 font-heading">You're all caught up!</h3>
                <p className="text-sm text-text-muted mb-6">
                  There are currently no new notifications in this category. We'll alert you when something happens.
                </p>
              </div>
            ) : (
              <div className="w-full space-y-4">
                {filteredNotifications.map((notif: any) => (
                  <div key={notif.id} className={`flex items-start gap-4 p-4 rounded-xl border ${notif.read ? 'bg-surface border-surface-border opacity-70' : 'bg-surface-hover border-brand-indigo/20'} text-left relative group`}>
                    <div className="w-10 h-10 rounded-full bg-brand-indigo/10 flex items-center justify-center text-brand-indigo shrink-0">
                      <Bell className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-bold text-text-primary">{notif.title}</p>
                        <span className="text-xs text-text-muted">{new Date(notif.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-text-secondary line-clamp-2">{notif.content}</p>
                    </div>
                    {!notif.read && (
                      <button 
                        onClick={() => handleMarkOne(notif.id)}
                        className="opacity-0 group-hover:opacity-100 absolute top-4 right-4 p-1.5 bg-surface rounded-lg text-text-muted hover:text-text-primary transition-all shadow-sm border border-surface-border"
                        title="Mark as read"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
        </div>
      </div>
    </motion.div>
  );
};
