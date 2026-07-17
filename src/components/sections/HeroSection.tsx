import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Shield, Zap, Code, Users, BarChart3, Layout, Bell } from "lucide-react";
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
              Collaborate Smarter. <br />
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
              Create secure workspaces for every organization. Manage projects, tasks, files and teams from one beautifully organized platform built for modern collaboration.
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
              <Button size="lg" variant="outline" onClick={() => navigate('/auth/login')}>
                View Live Demo
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
                <Zap className="w-4 h-4 text-amber-400" /> Real-Time Collaboration
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
                {/* Dashboard Header */}
                <div className="h-14 border-b border-surface-border flex items-center justify-between px-4 bg-surface-hover">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400/80" />
                      <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                      <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
                    </div>
                    <div className="h-6 w-px bg-surface mx-2" />
                    <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-surface-hover border border-surface-border text-xs font-medium text-text-primary">
                      <div className="w-4 h-4 rounded bg-brand-violet flex items-center justify-center text-[10px]">A</div>
                      Acme Corp Workspace
                    </div>
                  </div>
                  <div className="flex gap-3 text-text-muted">
                    <Bell className="w-4 h-4" />
                    <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-brand-indigo to-purple-500 border border-black/20 dark:border-white/20" />
                  </div>
                </div>

                {/* Dashboard Body */}
                <div className="flex flex-1 overflow-hidden">
                  {/* Sidebar */}
                  <div className="w-48 border-r border-surface-border p-4 flex flex-col gap-4 bg-surface-hover">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 px-2 py-1.5 rounded bg-surface text-xs font-medium text-text-primary">
                        <Layout className="w-3.5 h-3.5" /> Dashboard
                      </div>
                      <div className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-surface-hover text-xs font-medium text-text-secondary transition-colors">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Tasks
                      </div>
                      <div className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-surface-hover text-xs font-medium text-text-secondary transition-colors">
                        <Users className="w-3.5 h-3.5" /> Team
                      </div>
                      <div className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-surface-hover text-xs font-medium text-text-secondary transition-colors">
                        <BarChart3 className="w-3.5 h-3.5" /> Analytics
                      </div>
                    </div>
                  </div>

                  {/* Main Content Area */}
                  <div className="flex-1 p-6 space-y-6">
                    {/* Top Stats */}
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { label: "Active Projects", value: "12", trend: "+2" },
                        { label: "Tasks Completed", value: "148", trend: "+12%" },
                        { label: "Team Members", value: "24", trend: "Stable" },
                      ].map((stat, i) => (
                        <div key={i} className="glass-card p-4 rounded-xl border border-surface-border">
                          <div className="text-xs text-text-muted mb-1">{stat.label}</div>
                          <div className="flex items-end justify-between">
                            <div className="text-2xl font-semibold font-special">{stat.value}</div>
                            <div className="text-[10px] text-emerald-400 font-medium">{stat.trend}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Chart & Activity */}
                    <div className="flex gap-4 h-40">
                      <div className="flex-1 glass-card rounded-xl border border-surface-border p-4 flex flex-col">
                        <div className="text-xs text-text-muted mb-4">Productivity Trend</div>
                        <div className="flex-1 flex items-end gap-2 px-2">
                          {[40, 70, 45, 90, 65, 100, 80].map((h, i) => (
                            <motion.div
                              key={i}
                              initial={{ height: 0 }}
                              animate={{ height: `${h}%` }}
                              transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                              className="flex-1 bg-gradient-to-t from-brand-indigo/20 to-brand-indigo/60 rounded-t-sm"
                            />
                          ))}
                        </div>
                      </div>
                      <div className="w-48 glass-card rounded-xl border border-surface-border p-4 flex flex-col gap-3">
                        <div className="text-xs text-text-muted">Recent Activity</div>
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-surface" />
                            <div className="flex-1 space-y-1">
                              <div className="h-1.5 bg-surface-hover rounded w-full" />
                              <div className="h-1.5 bg-surface rounded w-2/3" />
                            </div>
                          </div>
                        ))}
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
