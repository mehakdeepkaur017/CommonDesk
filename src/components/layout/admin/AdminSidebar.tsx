import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Building2, 
  LayoutDashboard, 
  Users, 
  FolderKanban, 
  CheckSquare, 
  ShieldCheck, 
  MailPlus, 
  BarChart3, 
  Activity, 
  FileBox, 
  Bell, 
  Settings, 
  ShieldAlert, 
  Blocks, 
  ActivitySquare, 
  ClipboardList, 
  Terminal, 
  UserCircle, 
  HelpCircle,
  X,
  Building,
  Plus
} from 'lucide-react';
import { useWorkspace } from '../../../hooks/queries/useWorkspace';
import { WorkspaceService } from '../../../services/workspace.service';
import { useQuery } from '@tanstack/react-query';
import { WorkspaceAvatar } from '../../ui/WorkspaceAvatar';

const navGroups = [
  {
    label: 'Overview',
    items: [
      { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
      { name: 'Workspace', path: '/admin/workspace', icon: Building },
    ]
  },
  {
    label: 'Organization',
    items: [
      { name: 'Members', path: '/admin/members', icon: Users },
      { name: 'Invitations', path: '/admin/invitations', icon: MailPlus },
    ]
  },
  {
    label: 'Work Management',
    items: [
      { name: 'Projects', path: '/admin/projects', icon: FolderKanban },
      { name: 'Tasks', path: '/admin/tasks', icon: CheckSquare },
      { name: 'Files', path: '/admin/files', icon: FileBox },
    ]
  },
  {
    label: 'Monitoring',
    items: [
      { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
      { name: 'Audit Center', path: '/admin/audit', icon: ClipboardList },
    ]
  },
  {
    label: 'Account',
    items: [
      { name: 'Profile', path: '/admin/profile', icon: UserCircle },
    ]
  }
];

export const AdminSidebar = ({ onClose }: { onClose?: () => void }) => {
  const location = useLocation();
  const { data: workspace } = useWorkspace();
  
  const { data: stats } = useQuery({
    queryKey: ['workspace-stats', workspace?.id],
    queryFn: WorkspaceService.getWorkspaceStats,
    enabled: !!workspace?.id,
    refetchInterval: 3000,
  });

  return (
    <div className="w-72 h-full bg-surface border-r border-surface-border flex flex-col">
      <div className="h-20 px-6 flex items-center justify-between shrink-0">
        <Link to="/admin" className="flex items-center gap-3" onClick={onClose}>
          <WorkspaceAvatar 
            name={workspace?.name || 'CommonDesk'}
            logoUrl={workspace?.logoUrl}
            brandColor={workspace?.brandColor}
            size="md"
          />
          <div>
            <h1 className="text-lg font-bold font-heading text-text-primary tracking-tight leading-tight">
              {workspace?.name || 'CommonDesk'}
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-widest text-brand-indigo/80">Admin Console</p>
          </div>
        </Link>
        {onClose && (
          <button onClick={onClose} className="md:hidden text-text-muted hover:text-text-primary">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-none space-y-8">
        {navGroups.map((group, i) => (
          <div key={i}>
            <h4 className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-3 px-3">
              {group.label}
            </h4>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all group ${
                      isActive 
                        ? 'bg-brand-indigo/10 text-brand-indigo font-medium' 
                        : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={`w-4 h-4 ${isActive ? 'text-brand-indigo' : 'text-text-muted group-hover:text-text-primary'}`} />
                      {item.name}
                    </div>
                    {item.name === 'Members' && stats?.pendingRequestsCount > 0 && (
                      <div className="px-1.5 py-0.5 rounded-md bg-brand-indigo/10 text-brand-indigo text-[10px] font-bold">
                        {stats.pendingRequestsCount}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
