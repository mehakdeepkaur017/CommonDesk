import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Search, Plus, Layout, CheckSquare, MessageSquare, Settings } from "lucide-react";

export const WorkspaceShowcase = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5], [15, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <section id="workspace" ref={containerRef} className="py-32 relative perspective-1000">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-brand-indigo/20 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center mb-16">
        <h2 className="text-4xl md:text-6xl font-bold font-heading mb-6">
          Your workspace, <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-indigo to-purple-400">
            perfectly organized.
          </span>
        </h2>
      </div>

      <motion.div 
        style={{ scale, rotateX, opacity }}
        className="max-w-6xl mx-auto px-6 relative z-10"
      >
        <div className="glass-card rounded-2xl border border-surface-border shadow-2xl overflow-hidden bg-surface-light/80 backdrop-blur-2xl ring-1 ring-white/5">
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
          <div className="flex h-[600px]">
            {/* Sidebar */}
            <div className="w-64 border-r border-surface-border p-4 flex flex-col gap-6 bg-black/[0.01] dark:bg-background">
              <div className="flex items-center gap-3 px-2">
                <div className="w-8 h-8 rounded-lg bg-brand-indigo flex items-center justify-center font-bold text-sm">
                  A
                </div>
                <div>
                  <div className="text-sm font-medium">Acme Corp</div>
                </div>
              </div>

              <div className="space-y-1 flex-1">
                <div className="text-xs font-semibold text-text-muted px-2 mb-2 mt-4">MAIN MENU</div>
                <NavItem icon={<Layout className="w-4 h-4" />} label="Dashboard" active />
                <NavItem icon={<CheckSquare className="w-4 h-4" />} label="Tasks" />
                <NavItem icon={<MessageSquare className="w-4 h-4" />} label="Messages" badge="3" />
                <div className="text-xs font-semibold text-text-muted px-2 mb-2 mt-8">PROJECTS</div>
                <NavItem icon={<div className="w-2 h-2 rounded-full bg-red-400" />} label="Website Redesign" />
                <NavItem icon={<div className="w-2 h-2 rounded-full bg-emerald-400" />} label="Mobile App V2" />
                <NavItem icon={<div className="w-2 h-2 rounded-full bg-amber-400" />} label="Marketing Q3" />
              </div>
              
              <div className="pt-4 border-t border-surface-border">
                <NavItem icon={<Settings className="w-4 h-4" />} label="Settings" />
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 bg-transparent p-8 flex flex-col overflow-hidden">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-2xl font-semibold mb-1">Dashboard</h1>
                  <p className="text-sm text-text-muted">Welcome back, Sarah. Here's what's happening.</p>
                </div>
                <div className="flex gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input 
                      type="text" 
                      placeholder="Search anything..." 
                      className="pl-9 pr-4 py-2 bg-surface-hover border border-surface-border rounded-lg text-sm outline-none focus:border-brand-indigo/50 transition-colors w-64"
                      readOnly
                    />
                  </div>
                  <button className="px-4 py-2 bg-brand-indigo text-text-primary rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-brand-indigo/90 transition-colors">
                    <Plus className="w-4 h-4" /> New Task
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="glass-card p-5 rounded-xl border border-surface-border bg-black/[0.02] dark:bg-background">
                  <div className="text-sm text-text-muted mb-2">Total Tasks</div>
                  <div className="text-3xl font-semibold mb-2">1,248</div>
                  <div className="text-xs text-emerald-400">+12% from last week</div>
                </div>
                <div className="glass-card p-5 rounded-xl border border-surface-border bg-black/[0.02] dark:bg-background">
                  <div className="text-sm text-text-muted mb-2">Active Projects</div>
                  <div className="text-3xl font-semibold mb-2">24</div>
                  <div className="text-xs text-emerald-400">+3 new projects</div>
                </div>
                <div className="glass-card p-5 rounded-xl border border-surface-border bg-black/[0.02] dark:bg-background">
                  <div className="text-sm text-text-muted mb-2">Team Members</div>
                  <div className="text-3xl font-semibold mb-2">64</div>
                  <div className="text-xs text-text-muted">2 pending invites</div>
                </div>
              </div>

              <div className="flex-1 glass-card rounded-xl border border-surface-border p-6 bg-black/[0.01] dark:bg-background">
                <h3 className="text-sm font-medium text-text-primary mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-start gap-4 pb-4 border-b border-surface-border last:border-0 last:pb-0">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-indigo to-purple-400 flex items-center justify-center text-xs font-bold shadow-lg mt-1">
                        S
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <div className="text-sm text-text-primary">
                          <span className="font-medium">Sarah Jenkins</span> completed task <span className="text-brand-indigo">Design System V2</span>
                        </div>
                        <div className="text-xs text-text-muted">2 hours ago in Website Redesign</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

const NavItem = ({ icon, label, active = false, badge }: { icon: React.ReactNode, label: string, active?: boolean, badge?: string }) => (
  <div className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${active ? 'bg-surface text-text-primary' : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'}`}>
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
    {badge && (
      <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-brand-indigo text-text-primary">
        {badge}
      </span>
    )}
  </div>
);

const LockIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);
