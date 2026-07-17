import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Blocks, CheckCircle2, Cloud, GitBranch, Mail, 
  MessageSquare, Webhook, Plus, ExternalLink
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../components/feedback/ToastContext';

export const IntegrationsCenter = () => {
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();

  const integrations = [
    {
      id: 'cloudinary',
      name: 'Cloudinary',
      description: 'Global asset and media CDN for file storage.',
      icon: Cloud,
      status: 'connected',
      category: 'storage'
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Send notifications and updates to Slack channels.',
      icon: MessageSquare,
      status: 'available',
      category: 'communication'
    },
    {
      id: 'github',
      name: 'GitHub',
      description: 'Sync projects and tasks with GitHub repositories.',
      icon: GitBranch,
      status: 'available',
      category: 'development'
    },
    {
      id: 'email',
      name: 'SendGrid Email',
      description: 'Transactional email provider for invitations.',
      icon: Mail,
      status: 'connected',
      category: 'communication'
    },
    {
      id: 'webhook',
      name: 'Custom Webhooks',
      description: 'Send HTTP requests on workspace events.',
      icon: Webhook,
      status: 'available',
      category: 'development'
    }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-text-primary mb-1">Integrations Center</h1>
          <p className="text-sm text-text-muted">Connect CommonDesk with your favorite tools and services.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2" onClick={() => toast({ title: 'Request Sent', description: 'Your integration request has been recorded.', type: 'success' })}>
            <Plus className="w-4 h-4" /> Request Custom App
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-surface-border pb-4">
        {['all', 'storage', 'communication', 'development'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              activeTab === tab 
                ? 'bg-brand-indigo/10 text-brand-indigo' 
                : 'text-text-muted hover:text-text-primary hover:bg-surface-hover'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations
          .filter(app => activeTab === 'all' || app.category === activeTab)
          .map((app) => (
          <div key={app.id} className="p-6 bg-surface border border-surface-border rounded-2xl flex flex-col group hover:border-surface-border transition-colors">
            
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-surface-hover flex items-center justify-center">
                <app.icon className="w-6 h-6 text-text-primary" />
              </div>
              {app.status === 'connected' ? (
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider">
                  <CheckCircle2 className="w-3 h-3" /> Connected
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full bg-surface-hover text-text-muted text-[10px] font-bold uppercase tracking-wider">
                  Available
                </span>
              )}
            </div>

            <h3 className="text-lg font-bold text-text-primary mb-2">{app.name}</h3>
            <p className="text-sm text-text-muted mb-6 flex-1">{app.description}</p>

            <div className="flex items-center gap-3">
              {app.status === 'connected' ? (
                <Button variant="outline" className="flex-1 border-surface-border bg-surface-hover" onClick={() => toast({ title: 'Configure Integration', description: `Opening settings for ${app.name}...`, type: 'info' })}>
                  Configure
                </Button>
              ) : (
                <Button className="flex-1 bg-brand-indigo hover:bg-brand-indigo/90" onClick={() => toast({ title: 'Connect Integration', description: `Starting OAuth flow for ${app.name}...`, type: 'success' })}>
                  Connect
                </Button>
              )}
              <button className="p-2.5 rounded-xl border border-surface-border bg-surface-hover text-text-muted hover:text-text-primary transition-colors">
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
            
          </div>
        ))}

        {/* Add custom integration card */}
        <div className="p-6 bg-black/[0.02] dark:bg-background border border-dashed border-surface-border rounded-2xl flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-black/[0.04] dark:bg-surface transition-colors min-h-[260px]">
          <div className="w-12 h-12 rounded-full bg-surface-hover flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Plus className="w-6 h-6 text-text-muted group-hover:text-text-primary" />
          </div>
          <h3 className="text-base font-bold text-text-primary mb-1">Build Custom App</h3>
          <p className="text-xs text-text-muted max-w-[200px]">Create a private integration using the CommonDesk API.</p>
        </div>

      </div>

    </motion.div>
  );
};
