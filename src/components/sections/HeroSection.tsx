import React from "react";
import { motion } from "framer-motion";
import { 
  ArrowRight, Shield, Zap, Code, LayoutDashboard, Building2, 
  Users, Mail, FolderKanban, CheckSquare, FileText, BarChart3, 
  Settings, Search, Sun, RefreshCw, Monitor, Bell, FolderUp, 
  ChevronRight, UserPlus 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";

const floatingVariants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
    }
  }
};

const pulseVariants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.5, 0.8, 0.5],
    transition: {
      duration: 4,
      repeat: Infinity,
    }
  }
};

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen pt-32 pb-20 overflow-hidden flex items-center">
      {/* Background Gradients & Grid */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-indigo/30 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-brand-violet/20 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          
          {/* Left Content */}
          <div className="flex flex-col gap-8 max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-card w-fit border-brand-indigo/30"
            >
              <span className="text-xl">✨</span>
              <span className="text-sm font-medium text-text-primary">Multi-Tenant SaaS Platform</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl lg:text-7xl font-bold font-heading leading-[1.1] tracking-tight"
            >
              Unify Your Work. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-indigo via-brand-violet to-purple-400">
                Scale Without Limits.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-text-secondary leading-relaxed font-sans"
            >
              A powerful multi-tenant platform for managing organizations, projects, and teams. Built for seamless scale and enterprise-grade security.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 pt-2"
            >
              <Button size="lg" className="group" onClick={() => navigate('/auth/register')}>
                Get Started
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap items-center gap-6 mt-4 text-xs font-medium text-text-muted"
            >
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-400" /> Academic Project
              </div>
              <div className="flex items-center gap-1.5">
                <Code className="w-4 h-4 text-brand-violet" /> Open Source Friendly
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" /> Enterprise Scale
              </div>
            </motion.div>
          </div>

          {/* Right Content - Floating Dashboard Preview */}
          <div className="relative h-[600px] w-full hidden lg:block">
            <motion.div
              variants={floatingVariants}
              animate="animate"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] aspect-video max-w-[800px]"
            >
              <div className="glass-card w-full h-full rounded-2xl border border-surface-border shadow-2xl shadow-brand-indigo/20 overflow-hidden flex flex-col bg-surface-light/50 backdrop-blur-xl">
                {/* Browser Header */}
                <div className="h-12 border-b border-surface-border flex items-center px-4 gap-4 bg-black/[0.02] dark:bg-background">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                    <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="w-96 h-7 rounded-md bg-surface-hover border border-surface-border flex items-center justify-center text-[10px] text-text-muted">
                      <LockIcon className="w-3 h-3 mr-1" /> app.commondesk.com/acme
                    </div>
                  </div>
                </div>

                {/* App UI */}
                <div className="flex flex-1 overflow-hidden">
                  {/* Sidebar */}
                  <div className="w-56 border-r border-surface-border p-3 flex flex-col gap-1 bg-black/[0.01] dark:bg-background">
                    {/* Workspace Identity */}
                    <div className="flex items-center gap-2.5 px-2 py-3 mb-2">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-indigo to-brand-violet flex items-center justify-center font-bold text-sm text-white shadow-lg">
                        A
                      </div>
                      <div>
                        <div className="text-sm font-bold">Acme Corp</div>
                        <div className="text-[10px] text-brand-indigo font-semibold tracking-wide uppercase">Admin Console</div>
                      </div>
                    </div>

                    {/* Navigation */}
                    <div className="text-[10px] font-bold text-text-muted px-3 mb-1 mt-1 tracking-wider uppercase">Overview</div>
                    <NavItem icon={<LayoutDashboard className="w-4 h-4" />} label="Dashboard" active />
                    <NavItem icon={<Building2 className="w-4 h-4" />} label="Workspace" />

                    <div className="text-[10px] font-bold text-text-muted px-3 mb-1 mt-4 tracking-wider uppercase">Organization</div>
                    <NavItem icon={<Users className="w-4 h-4" />} label="Members" badge="32" />
                    <NavItem icon={<Mail className="w-4 h-4" />} label="Invitations" />

                    <div className="text-[10px] font-bold text-text-muted px-3 mb-1 mt-4 tracking-wider uppercase">Work Management</div>
                    <NavItem icon={<FolderKanban className="w-4 h-4" />} label="Projects" />
                    <NavItem icon={<CheckSquare className="w-4 h-4" />} label="Tasks" />
                    <NavItem icon={<FileText className="w-4 h-4" />} label="Files" />

                    <div className="text-[10px] font-bold text-text-muted px-3 mb-1 mt-4 tracking-wider uppercase">Monitoring</div>
                    <NavItem icon={<BarChart3 className="w-4 h-4" />} label="Analytics" />
                    <NavItem icon={<Shield className="w-4 h-4" />} label="Audit Center" />
                  </div>

                  {/* Main Content Area */}
                  <div className="flex-1 bg-transparent p-6 flex flex-col overflow-hidden">
                    {/* Top Bar */}
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-3 bg-surface-hover border border-surface-border rounded-lg px-3 py-2 w-64">
                        <Search className="w-4 h-4 text-text-muted" />
                        <span className="text-xs text-text-muted">Search admin console...</span>
                        <span className="ml-auto text-[9px] text-text-muted bg-surface border border-surface-border rounded px-1.5 py-0.5">⌘K</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 bg-surface-hover border border-surface-border rounded-lg px-2 py-1.5">
                          <span className="text-xs font-medium text-brand-indigo">Acme Corp</span>
                        </div>
                        <button className="p-2 rounded-lg bg-surface-hover border border-surface-border text-text-muted"><Sun className="w-3.5 h-3.5" /></button>
                        <button className="p-2 rounded-lg bg-surface-hover border border-surface-border text-text-muted"><RefreshCw className="w-3.5 h-3.5" /></button>
                        <button className="p-2 rounded-lg bg-surface-hover border border-surface-border text-text-muted"><Monitor className="w-3.5 h-3.5" /></button>
                        <button className="p-2 rounded-lg bg-surface-hover border border-surface-border text-text-muted relative">
                          <Bell className="w-3.5 h-3.5" />
                          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 rounded-full text-[8px] text-white flex items-center justify-center font-bold">4</div>
                        </button>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-indigo to-brand-violet flex items-center justify-center text-xs font-bold text-white shadow-lg">S</div>
                      </div>
                    </div>

                    {/* Page Header */}
                    <div className="mb-6">
                      <h1 className="text-xl font-bold mb-1">Executive Dashboard</h1>
                      <p className="text-xs text-text-muted">Comprehensive overview of workspace health, security, and activity.</p>
                    </div>

                    {/* Quick Actions */}
                    <div className="mb-6">
                      <div className="text-[10px] font-bold text-text-muted tracking-wider uppercase mb-3">Quick Actions</div>
                      <div className="grid grid-cols-5 gap-3">
                        <QuickAction icon={<FolderKanban className="w-4 h-4" />} label="Create Project" color="bg-brand-indigo/10 text-brand-indigo" />
                        <QuickAction icon={<UserPlus className="w-4 h-4" />} label="Invite Member" color="bg-emerald-500/10 text-emerald-500" />
                        <QuickAction icon={<FolderUp className="w-4 h-4" />} label="Upload Files" color="bg-amber-500/10 text-amber-500" />
                        <QuickAction icon={<Zap className="w-4 h-4" />} label="Review Audits" color="bg-purple-500/10 text-purple-500" />
                        <QuickAction icon={<Settings className="w-4 h-4" />} label="System Settings" color="bg-slate-500/10 text-slate-400" />
                      </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <StatCard label="Active Members" value="32" change="+5 this week" positive />
                      <StatCard label="Active Projects" value="12" change="+3 new" positive />
                      <StatCard label="Tasks Completed" value="248" change="+18% vs last month" positive />
                    </div>

                    {/* Bottom Section */}
                    <div className="grid grid-cols-2 gap-4 flex-1">
                      {/* Recent Projects */}
                      <div className="glass-card rounded-xl border border-surface-border p-4 bg-black/[0.01] dark:bg-background">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-bold flex items-center gap-2">
                            <FolderKanban className="w-4 h-4 text-brand-indigo" /> Recent Projects
                          </h3>
                          <span className="text-[10px] text-brand-indigo font-medium cursor-pointer hover:underline">View All</span>
                        </div>
                        <div className="space-y-3">
                          <ProjectItem name="Website Redesign" status="Active" statusColor="text-emerald-400" tasks={24} />
                          <ProjectItem name="Mobile App V2" status="Active" statusColor="text-emerald-400" tasks={18} />
                          <ProjectItem name="Marketing Q3" status="Planning" statusColor="text-amber-400" tasks={8} />
                        </div>
                      </div>

                      {/* Recent Members */}
                      <div className="glass-card rounded-xl border border-surface-border p-4 bg-black/[0.01] dark:bg-background">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-bold flex items-center gap-2">
                            <Users className="w-4 h-4 text-emerald-400" /> Recent Members
                          </h3>
                          <span className="text-[10px] text-brand-indigo font-medium cursor-pointer hover:underline">View All</span>
                        </div>
                        <div className="space-y-3">
                          <MemberItem name="Sarah Jenkins" role="Admin" color="from-brand-indigo to-brand-violet" />
                          <MemberItem name="Alex Chen" role="Manager" color="from-emerald-500 to-teal-500" />
                          <MemberItem name="Priya Sharma" role="Member" color="from-amber-500 to-orange-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating decorative elements */}
              <motion.div
                variants={pulseVariants}
                animate="animate"
                className="absolute -top-6 -right-6 w-24 h-24 bg-brand-violet/30 rounded-full blur-2xl"
              />
              <motion.div
                variants={pulseVariants}
                animate="animate"
                className="absolute -bottom-10 -left-10 w-32 h-32 bg-brand-indigo/30 rounded-full blur-2xl"
              />
            </motion.div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

const NavItem = ({ icon, label, active = false, badge }: { icon: React.ReactNode, label: string, active?: boolean, badge?: string }) => (
  <div className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${active ? 'bg-brand-indigo/10 text-brand-indigo font-semibold' : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'}`}>
    <div className="flex items-center gap-2.5">
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </div>
    {badge && (
      <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-surface-hover text-text-muted">
        {badge}
      </span>
    )}
  </div>
);

const QuickAction = ({ icon, label, color }: { icon: React.ReactNode, label: string, color: string }) => (
  <div className="flex flex-col items-center gap-2 p-3 rounded-xl border border-surface-border bg-black/[0.01] dark:bg-background hover:border-brand-indigo/30 transition-colors cursor-pointer group">
    <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <span className="text-[10px] font-medium text-text-muted text-center">{label}</span>
  </div>
);

const StatCard = ({ label, value, change, positive }: { label: string, value: string, change: string, positive?: boolean }) => (
  <div className="glass-card p-4 rounded-xl border border-surface-border bg-black/[0.02] dark:bg-background flex items-center justify-between cursor-pointer hover:border-brand-indigo/20 transition-colors group">
    <div>
      <div className="text-[11px] text-text-muted mb-1">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
    <div className="flex flex-col items-end gap-1">
      <span className={`text-[10px] font-medium ${positive ? 'text-emerald-400' : 'text-text-muted'}`}>{change}</span>
      <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-brand-indigo transition-colors" />
    </div>
  </div>
);

const ProjectItem = ({ name, status, statusColor, tasks }: { name: string, status: string, statusColor: string, tasks: number }) => (
  <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-hover/50 hover:bg-surface-hover transition-colors cursor-pointer group">
    <div className="flex items-center gap-2.5">
      <div className="w-7 h-7 rounded-lg bg-brand-indigo/10 flex items-center justify-center">
        <FolderKanban className="w-3.5 h-3.5 text-brand-indigo" />
      </div>
      <div>
        <div className="text-xs font-medium">{name}</div>
        <div className="text-[10px] text-text-muted">{tasks} tasks</div>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <span className={`text-[10px] font-medium ${statusColor}`}>● {status}</span>
      <ChevronRight className="w-3.5 h-3.5 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  </div>
);

const MemberItem = ({ name, role, color }: { name: string, role: string, color: string }) => (
  <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-hover/50 hover:bg-surface-hover transition-colors cursor-pointer">
    <div className="flex items-center gap-2.5">
      <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-[10px] font-bold text-white shadow`}>
        {name[0]}
      </div>
      <div>
        <div className="text-xs font-medium">{name}</div>
        <div className="text-[10px] text-text-muted">{role}</div>
      </div>
    </div>
  </div>
);

const LockIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);
