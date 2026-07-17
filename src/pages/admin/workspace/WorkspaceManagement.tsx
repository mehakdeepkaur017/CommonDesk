import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, AlertTriangle, ShieldAlert, CheckCircle2, Upload, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useWorkspace } from '../../../hooks/queries/useWorkspace';
import { useToast } from '../../../components/feedback/ToastContext';
import { WorkspaceAvatar } from '../../../components/ui/WorkspaceAvatar';

import { useQueryClient, useMutation } from '@tanstack/react-query';
import { apiClient } from '../../../api/axios';
import axios from 'axios';

const workspaceSchema = z.object({
  name: z.string().min(2, 'Workspace name must be at least 2 characters'),
  slug: z.string().min(3, 'URL must be at least 3 characters'),
  description: z.string().optional(),
  brandColor: z.string().optional(),
  timezone: z.string().optional(),
  language: z.string().optional(),
  publicJoinEnabled: z.boolean().default(true),
});

type WorkspaceFormValues = z.infer<typeof workspaceSchema>;

export const WorkspaceManagement = () => {
  const { data: workspace } = useWorkspace();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [copiedCode, setCopiedCode] = React.useState(false);
  const [copiedLink, setCopiedLink] = React.useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const copyToClipboard = (text: string, type: 'code' | 'link') => {
    navigator.clipboard.writeText(text);
    if (type === 'code') {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const regenerateMutation = useMutation({
    mutationFn: async () => {
      const res = await apiClient.patch('/workspaces/current/code');
      return res;
    },
    onSuccess: () => {
      toast({ title: 'Code Regenerated', description: 'A new workspace join code has been generated.', type: 'success' });
      queryClient.invalidateQueries({ queryKey: ['workspace'] });
    }
  });

  const logoUploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('logo', file);
      
      const token = localStorage.getItem('commondesk_token');
      const workspaceId = localStorage.getItem('commondesk_workspace');
      
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'}/workspaces/current/logo`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
            'x-workspace-id': workspaceId || '',
          },
        }
      );
      return res.data;
    },
    onSuccess: () => {
      toast({ title: 'Logo Updated', description: 'Your workspace logo has been updated successfully.', type: 'success' });
      queryClient.invalidateQueries({ queryKey: ['workspace'], refetchType: 'all' });
    },
    onError: (err: any) => {
      toast({ title: 'Upload Failed', description: err?.response?.data?.error || 'Could not upload logo.', type: 'error' });
    },
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Invalid File', description: 'Please select an image file (PNG, JPG, SVG).', type: 'error' });
      return;
    }
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'File Too Large', description: 'Logo must be under 5MB.', type: 'error' });
      return;
    }
    
    logoUploadMutation.mutate(file);
  };

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<WorkspaceFormValues>({
    resolver: zodResolver(workspaceSchema),
    values: {
      name: workspace?.name || 'CommonDesk',
      description: workspace?.description || '',
      brandColor: workspace?.brandColor || '#6366f1',
      slug: workspace?.slug || 'commondesk',
      timezone: 'UTC',
      language: 'en',
      publicJoinEnabled: workspace?.publicJoinEnabled ?? true,
    }
  });

  const onSubmit = async (data: WorkspaceFormValues) => {
    try {
      await apiClient.patch('/workspaces/current', data);
      toast({ title: 'Workspace Updated', description: 'Changes saved successfully.', type: 'success' });
      queryClient.invalidateQueries({ queryKey: ['workspace'], refetchType: 'all' });
    } catch(e) {
      toast({ title: 'Error', description: 'Failed to update workspace.', type: 'error' });
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl space-y-8 pb-10">
      
      <div>
        <h1 className="text-2xl font-bold font-heading text-text-primary mb-2">Workspace Administration</h1>
        <p className="text-sm text-text-muted">Manage core organization settings, branding, and lifecycle.</p>
      </div>

      <div className="bg-surface border border-surface-border rounded-2xl overflow-hidden">
        
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-8">
          
          {/* Logo Section */}
          <section className="flex flex-col md:flex-row gap-6 md:items-center pb-8 border-b border-surface-border">
            <div className="relative group cursor-pointer shrink-0" onClick={() => logoInputRef.current?.click()}>
              <WorkspaceAvatar 
                name={workspace?.name || 'Workspace'} 
                logoUrl={workspace?.logoUrl} 
                brandColor={workspace?.brandColor} 
                size="xl" 
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                {logoUploadMutation.isPending ? (
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                ) : (
                  <Camera className="w-8 h-8 text-white" />
                )}
              </div>
              <input 
                ref={logoInputRef}
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleLogoChange}
              />
            </div>
            <div>
              <h3 className="text-base font-bold text-text-primary mb-1">Organization Logo</h3>
              <p className="text-sm text-text-muted mb-4 max-w-md">This logo appears in the sidebar and all external invitations. Recommended size 512x512px (PNG, SVG).</p>
              <button 
                type="button" 
                onClick={() => logoInputRef.current?.click()}
                disabled={logoUploadMutation.isPending}
                className="px-4 py-2 rounded-lg bg-surface-hover border border-surface-border hover:bg-surface text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {logoUploadMutation.isPending ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
                ) : (
                  <><Upload className="w-4 h-4" /> Upload New Logo</>
                )}
              </button>
            </div>
          </section>

          {/* Core Info */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8 border-b border-surface-border">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">Workspace Name</label>
              <input 
                {...register('name')}
                className="w-full h-11 bg-surface-hover border border-surface-border rounded-xl px-4 text-sm text-text-primary focus:outline-none focus:border-brand-indigo transition-colors"
              />
              {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">Workspace URL</label>
              <div className="flex">
                <span className="h-11 px-4 bg-surface-hover border border-surface-border border-r-0 rounded-l-xl flex items-center text-sm text-text-muted select-none">
                  app.commondesk.com/
                </span>
                <input 
                  {...register('slug')}
                  className="flex-1 h-11 bg-surface-hover border border-surface-border rounded-r-xl px-4 text-sm text-text-primary focus:outline-none focus:border-brand-indigo transition-colors"
                />
              </div>
              {errors.slug && <p className="text-xs text-red-400 mt-1">{errors.slug.message}</p>}
            </div>

            <div className="space-y-2 col-span-1 md:col-span-2">
              <label className="text-sm font-medium text-text-primary">Workspace Description</label>
              <textarea 
                {...register('description')}
                className="w-full h-24 bg-surface-hover border border-surface-border rounded-xl p-4 text-sm text-text-primary focus:outline-none focus:border-brand-indigo transition-colors resize-none"
                placeholder="A brief description of your organization..."
              />
            </div>



            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">Enable Public Join Requests</label>
              <div className="flex items-center gap-2 mt-2">
                <input 
                  type="checkbox" 
                  {...register('publicJoinEnabled')}
                  className="w-4 h-4 rounded border-surface-border bg-surface-hover text-brand-indigo focus:ring-brand-indigo"
                />
                <span className="text-sm text-text-muted">Allow anyone with the join code to request access</span>
              </div>
            </div>
          </section>

          {/* Join Code Management */}
          <section className="pb-8 border-b border-surface-border">
            <div className="mb-6">
              <h3 className="text-base font-bold text-text-primary">Workspace Join Code</h3>
              <p className="text-sm text-text-muted">Share this code with your team to allow them to request access.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">Current Code</label>
                <div className="flex items-center justify-between bg-surface-hover border border-surface-border rounded-xl p-3">
                  <code className="text-lg font-mono font-bold text-brand-indigo">{workspace?.joinCode || '-------'}</code>
                  <button 
                    type="button" 
                    onClick={() => copyToClipboard(workspace?.joinCode || '', 'code')}
                    className="text-sm text-text-muted hover:text-text-primary flex items-center"
                  >
                    {copiedCode ? <span className="text-emerald-400 flex items-center"><CheckCircle2 className="w-4 h-4 mr-1"/>Copied</span> : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">Direct Join Link</label>
                <div className="flex items-center justify-between bg-surface-hover border border-surface-border rounded-xl p-3">
                  <span className="text-sm text-text-secondary truncate mr-4">{`${window.location.origin}/auth/join-organization?code=${workspace?.joinCode}`}</span>
                  <button 
                    type="button" 
                    onClick={() => copyToClipboard(`${window.location.origin}/auth/join-organization?code=${workspace?.joinCode}`, 'link')}
                    className="text-sm text-text-muted hover:text-text-primary flex items-center shrink-0"
                  >
                    {copiedLink ? <span className="text-emerald-400 flex items-center"><CheckCircle2 className="w-4 h-4 mr-1"/>Copied</span> : 'Copy Link'}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <button 
                type="button" 
                onClick={() => regenerateMutation.mutate()}
                disabled={regenerateMutation.isPending}
                className="px-4 py-2 rounded-lg bg-surface-hover border border-surface-border hover:bg-surface text-sm font-medium transition-colors"
              >
                {regenerateMutation.isPending ? 'Regenerating...' : 'Regenerate Code'}
              </button>
              <p className="text-xs text-text-muted mt-2">Regenerating will invalidate the old code. Pending requests will not be affected.</p>
            </div>
          </section>

          {/* Action Footer */}
          <div className="flex items-center justify-end">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-brand-indigo hover:bg-brand-indigo/90 text-text-primary font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving Changes...' : 'Save Configuration'}
            </button>
          </div>

        </form>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-6 md:p-8 mt-8">
        <h3 className="text-lg font-bold text-red-400 flex items-center gap-2 mb-2">
          <ShieldAlert className="w-5 h-5" /> Danger Zone
        </h3>
        <p className="text-sm text-red-400/70 mb-6">Irreversible administrative actions for this organization.</p>
        
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-black/20 border border-red-500/10">
            <div>
              <h4 className="font-bold text-text-primary text-sm">Transfer Ownership</h4>
              <p className="text-xs text-text-muted mt-1">Transfer this workspace to another administrator.</p>
            </div>
            <button className="px-4 py-2 rounded-lg bg-surface-hover hover:bg-surface text-text-primary text-sm font-medium transition-colors border border-surface-border shrink-0">
              Transfer
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
            <div>
              <h4 className="font-bold text-red-400 text-sm">Delete Organization</h4>
              <p className="text-xs text-red-400/70 mt-1">Permanently delete all projects, tasks, files, and member data.</p>
            </div>
            <button className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-text-primary text-sm font-medium transition-colors shrink-0 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Delete Workspace
            </button>
          </div>
        </div>
      </div>

    </motion.div>
  );
};
