import React from "react";
import { formatDistanceToNow } from "date-fns";
import { CheckSquare, UserPlus, FolderKanban, ShieldAlert, Bell, MessageSquare } from "lucide-react";
import type { Notification } from "../../services/notification.service";
import { motion } from "framer-motion";

interface NotificationItemProps {
  notification: Notification;
  onClick: (id: string, link?: string) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onClick }) => {
  const getIcon = () => {
    switch (notification.type) {
      case "TASK_ASSIGNED":
      case "TASK_COMPLETED":
        return <CheckSquare className="w-5 h-5 text-brand-indigo" />;
      case "MEMBER_ADDED":
      case "JOIN_REQUEST":
        return <UserPlus className="w-5 h-5 text-green-500" />;
      case "PROJECT_CREATED":
        return <FolderKanban className="w-5 h-5 text-brand-violet" />;
      case "SYSTEM_ALERT":
        return <ShieldAlert className="w-5 h-5 text-red-500" />;
      case "COMMENT_ADDED":
        return <MessageSquare className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-text-muted" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => onClick(notification.id, notification.link)}
      className={`p-4 flex items-start gap-4 cursor-pointer transition-colors border-b border-surface-border last:border-0 hover:bg-surface-hover ${
        !notification.read ? "bg-brand-indigo/5" : ""
      }`}
    >
      <div className={`mt-0.5 shrink-0 p-2 rounded-full ${!notification.read ? "bg-surface" : "bg-transparent"}`}>
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <p className={`text-sm truncate ${!notification.read ? "font-bold text-text-primary" : "font-medium text-text-secondary"}`}>
            {notification.title}
          </p>
          <span className="text-[10px] text-text-muted whitespace-nowrap shrink-0 font-medium">
            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
          </span>
        </div>
        <p className={`text-xs line-clamp-2 ${!notification.read ? "text-text-secondary" : "text-text-muted"}`}>
          {notification.message}
        </p>
      </div>
      {!notification.read && (
        <div className="w-2 h-2 rounded-full bg-brand-indigo shrink-0 mt-2" />
      )}
    </motion.div>
  );
};
