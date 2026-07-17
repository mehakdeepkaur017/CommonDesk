import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, FolderKanban, ShieldCheck, Activity, Database, 
  Server, ShieldAlert, FileBox, Bell, Clock, ChevronRight, 
  Plus, Upload, MailPlus, Settings, Building2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { WorkspaceService } from '../../services/workspace.service';
import { useWorkspace } from '../../hooks/queries/useWorkspace';
import { useProjects } from '../../hooks/queries/useProjects';
import { useMembers } from '../../hooks/queries/useMembers';
import { format } from 'date-fns';

const quickActions = [
  { name: 'Create Project', icon: FolderKanban, path: '/admin/projects?create=true', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { name: 'Invite Member', icon: MailPlus, path: '/admin/members?invite=true', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { name: 'Upload Files', icon: Upload, path: '/admin/files?upload=true', color: 'text-orange-400', bg: 'bg-orange-500/10' },
  { name: 'Review Audits', icon: Activity, path: '/admin/audit', color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { name: 'System Settings', icon: Settings, path: '/admin/workspace', color: 'text-gray-400', bg: 'bg-surface' },
];

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { data: workspace } = useWorkspace();
  
  const { data: stats, isLoading } = useQuery({
    queryKey: ['workspace-stats', workspace?.id],
    queryFn: WorkspaceService.getWorkspaceStats,
    enabled: !!workspace?.id,
    refetchInterval: 5000
  });

  const { data: projectsData, isLoading: isProjectsLoading } = useProjects({ limit: 5 });
  const { data: membersData, isLoading: isMembersLoading } = useMembers({ limit: 5 });
  
  const recentProjects = projectsData?.items || [];
  const recentMembers = membersData?.items || [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-10">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-heading text-text-primary mb-2">Executive Dashboard</h1>
        <p className="text-sm text-text-muted">Comprehensive overview of workspace health, security, and activity.</p>
      </div>

      {/* Quick Actions */}
      <section>
        <h2 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {quickActions.map((action) => (
            <Link 
              key={action.name} 
              to={action.path}
              className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl bg-black/[0.02] dark:bg-background border border-surface-border hover:bg-black/[0.04] dark:bg-surface hover:border-surface-border transition-all group"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${action.bg} ${action.color}`}>
                <action.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-text-primary group-hover:text-text-primary transition-colors">{action.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Primary Metrics Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: 'Active Members', value: stats?.membersCount, icon: Users, route: '/admin/members' },
          { label: 'Active Projects', value: stats?.projectsCount, icon: FolderKanban, route: '/admin/projects' },
        ].map((stat, i) => (
          <Link key={i} to={stat.route} className="p-5 rounded-2xl bg-black/[0.02] dark:bg-background border border-surface-border hover:bg-black/[0.04] dark:bg-surface transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-surface-hover rounded-lg text-text-muted group-hover:text-text-primary transition-colors">
                <stat.icon className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-surface-border group-hover:text-text-secondary transition-colors" />
            </div>
            <p className="text-sm font-medium text-text-secondary mb-1">{stat.label}</p>
            {isLoading ? (
              <div className="h-8 w-24 bg-surface-hover rounded animate-pulse" />
            ) : (
              <h3 className="text-2xl font-bold text-text-primary">{stat.value !== undefined ? stat.value : '--'}</h3>
            )}
          </Link>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Large Sections */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Recent Projects */}
          <section className="p-6 rounded-2xl bg-black/[0.02] dark:bg-background border border-surface-border min-h-[300px] flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                  <FolderKanban className="w-5 h-5 text-brand-indigo" /> Recent Projects
                </h3>
                <p className="text-xs text-text-muted">Most recently created projects in the workspace.</p>
              </div>
              <Link to="/admin/projects" className="text-xs text-brand-indigo hover:text-brand-indigo/80 font-medium">View All Projects</Link>
            </div>
            
            {isProjectsLoading ? (
               <div className="flex-1 flex items-center justify-center">
                 <div className="w-8 h-8 border-2 border-brand-indigo border-t-transparent rounded-full animate-spin" />
               </div>
            ) : recentProjects.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-surface-border rounded-xl bg-black/[0.01] dark:bg-background h-[200px]">
                <FolderKanban className="w-12 h-12 text-black/10 dark:text-white/10 mb-4" />
                <p className="text-sm font-medium text-text-muted">No projects found.</p>
                <p className="text-xs text-text-muted mt-1">Get started by creating a new project.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentProjects.slice(0, 4).map((project: any) => (
                  <Link to={`/admin/projects`} key={project.id} className="flex items-center justify-between p-3 rounded-lg bg-surface hover:bg-surface-hover border border-surface-border transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-brand-indigo/10 flex items-center justify-center text-brand-indigo shrink-0 group-hover:scale-105 transition-transform">
                        <FolderKanban className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-primary">{project.name}</p>
                        <p className="text-xs text-text-muted mt-0.5">{project.status} • {project._count?.tasks || 0} tasks</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-surface-border group-hover:text-brand-indigo transition-colors" />
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Recent Members */}
          <section className="p-6 rounded-2xl bg-black/[0.02] dark:bg-background border border-surface-border min-h-[300px] flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-400" /> New Members
                </h3>
                <p className="text-xs text-text-muted">Recently joined members in the workspace.</p>
              </div>
              <Link to="/admin/members" className="text-xs text-brand-indigo hover:text-brand-indigo/80 font-medium">View All Members</Link>
            </div>
            
            {isMembersLoading ? (
               <div className="flex-1 flex items-center justify-center">
                 <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
               </div>
            ) : recentMembers.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-surface-border rounded-xl bg-black/[0.01] dark:bg-background h-[200px]">
                <Users className="w-12 h-12 text-black/10 dark:text-white/10 mb-4" />
                <p className="text-sm font-medium text-text-muted">No members found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentMembers.slice(0, 4).map((member: any) => (
                  <Link to={`/admin/members`} key={member.id} className="flex items-center justify-between p-3 rounded-lg bg-surface hover:bg-surface-hover border border-surface-border transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold uppercase shrink-0 overflow-hidden">
                        {member.avatarUrl ? (
                          <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
                        ) : (
                          member.name?.[0] || 'U'
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-primary">{member.name}</p>
                        <p className="text-xs text-text-muted mt-0.5">{member.role || 'MEMBER'}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-surface-border group-hover:text-emerald-500 transition-colors" />
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right Column - Status & Alerts */}
        <div className="space-y-6">
          
          {/* Workspace Info */}
          <section className="p-6 rounded-2xl bg-black/[0.02] dark:bg-background border border-surface-border">
            <h3 className="text-lg font-bold text-text-primary flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-brand-indigo" /> Workspace Details
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-surface-hover border border-surface-border">
                <span className="text-xs font-medium text-text-secondary">Name</span>
                <span className="text-xs font-bold text-text-primary">{workspace?.name}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-surface-hover border border-surface-border">
                <span className="text-xs font-medium text-text-secondary">Invite Code</span>
                <span className="text-xs font-bold font-mono tracking-wider text-brand-indigo bg-brand-indigo/10 px-2 py-1 rounded">
                  {workspace?.joinCode || 'Not Generated'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-surface-hover border border-surface-border">
                <span className="text-xs font-medium text-text-secondary">Active Members</span>
                <span className="text-xs font-bold text-text-primary">{stats?.membersCount || 0}</span>
              </div>
            </div>
            <Link to="/admin/workspace" className="block mt-4 text-xs text-center text-text-muted hover:text-text-primary transition-colors">
              Manage Workspace Settings
            </Link>
          </section>

        </div>
      </div>
    </motion.div>
  );
};

// Helper SVG
const BarChartIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="12" y1="20" x2="12" y2="10"/>
    <line x1="18" y1="20" x2="18" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="16"/>
  </svg>
);
