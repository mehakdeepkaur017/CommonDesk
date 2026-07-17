import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, Settings, Plus, Users, FolderKanban, CheckSquare, 
  ShieldAlert, Building2, Server, Megaphone, Send
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../components/feedback/ToastContext';

export const AdminNotifications = () => {
  const [activeTab, setActiveTab] = useState('announcements');
  const { toast } = useToast();

  const categories = [
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'security', label: 'Security Alerts', icon: ShieldAlert },
    { id: 'system', label: 'System Updates', icon: Server },
    { id: 'workspace', label: 'Workspace', icon: Building2 },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-text-primary mb-1">Notification Center</h1>
          <p className="text-sm text-text-muted">Manage global broadcast messages and organizational notification rules.</p>
        </div>
        <div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Sidebar */}
        <div className="w-full lg:w-64 shrink-0 space-y-1">
          <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3 px-3">Categories</h3>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                activeTab === category.id 
                  ? 'bg-brand-indigo/10 text-brand-indigo font-medium' 
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
              }`}
            >
              <category.icon className={`w-4 h-4 ${activeTab === category.id ? 'text-brand-indigo' : 'text-text-muted'}`} />
              {category.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 bg-surface border border-surface-border rounded-2xl overflow-hidden min-h-[500px] flex flex-col">
          
          <div className="p-6 border-b border-surface-border">
            <h2 className="text-lg font-bold text-text-primary mb-1 capitalize">
              {activeTab.replace('-', ' ')} Feed
            </h2>
            <p className="text-xs text-text-muted">Historical log of notifications sent to the organization.</p>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="w-16 h-16 rounded-full bg-surface-hover flex items-center justify-center mb-4">
              <Bell className="w-6 h-6 text-surface-border" />
            </div>
            <h3 className="text-sm font-bold text-text-primary mb-1">No notifications</h3>
            <p className="text-xs text-text-muted text-center max-w-[250px] mb-6">
              There are no recent notifications or broadcasts in this category.
            </p>
            {activeTab === 'announcements' && (
              <Button className="gap-2" onClick={() => toast({ title: 'New Broadcast', description: 'Opening broadcast composer...', type: 'success' })}>
                <Plus className="w-4 h-4" /> Create Broadcast
              </Button>
            )}
          </div>
          
        </div>

      </div>
    </motion.div>
  );
};
