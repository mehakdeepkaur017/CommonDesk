import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Layers, ShieldCheck, Users, FolderKanban } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const AuthLayout = () => {
  const location = useLocation();

  const getContent = () => {
    if (location.pathname.includes("create-organization")) {
      return {
        title: (
          <>
            Set up your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-indigo to-purple-400">
              admin console
            </span>
          </>
        ),
        subtitle: "Create a new workspace to get started. As the administrator, you'll be able to invite members, manage permissions, and oversee all projects securely.",
        stats: "Admin Features",
        icons: [
          { icon: <ShieldCheck className="w-5 h-5 text-white" />, color: "from-blue-500 to-indigo-500" },
          { icon: <Users className="w-5 h-5 text-white" />, color: "from-purple-500 to-pink-500" },
          { icon: <FolderKanban className="w-5 h-5 text-white" />, color: "from-emerald-500 to-teal-500" },
        ]
      };
    } else if (location.pathname.includes("join-organization")) {
      return {
        title: (
          <>
            Access your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-indigo to-purple-400">
              member console
            </span>
          </>
        ),
        subtitle: "Enter the workspace code provided by your administrator to join the team. You'll get a dedicated member console to manage your assigned tasks, projects, and files securely.",
        stats: "Member Features",
        icons: [
          { icon: <Users className="w-5 h-5 text-white" />, color: "from-blue-500 to-indigo-500" },
          { icon: <FolderKanban className="w-5 h-5 text-white" />, color: "from-emerald-500 to-teal-500" },
        ]
      };
    } else {
      return {
        title: (
          <>
            Welcome back to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-indigo to-purple-400">
              CommonDesk
            </span>
          </>
        ),
        subtitle: "Log in to access your projects, tasks, and team updates. Pick up right where you left off securely.",
        stats: "Secure & Encrypted Access",
        icons: [
          { icon: <ShieldCheck className="w-5 h-5 text-white" />, color: "from-blue-500 to-indigo-500" },
        ]
      };
    }
  };

  const content = getContent();
  return (
    <div className="min-h-screen bg-surface flex">
      {/* Left Side - Illustration (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-surface-light/30 border-r border-surface-border items-center justify-center p-12">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-soft-light" />
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-indigo/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-violet/20 rounded-full blur-[100px]" />
        
        <div className="relative z-10 w-full max-w-lg">
          <Link to="/" className="flex items-center gap-2 mb-12">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-indigo to-brand-violet flex items-center justify-center shadow-lg">
              <Layers className="w-5 h-5 text-text-primary" />
            </div>
            <span className="text-xl font-bold font-heading text-text-primary">
              CommonDesk
            </span>
          </Link>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-bold font-heading mb-6 tracking-tight">
                {content.title}
              </h1>
              <p className="text-lg text-text-secondary mb-10 leading-relaxed">
                {content.subtitle}
              </p>
              

            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Right Side - Form Content */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-y-auto">
        <Link to="/" className="lg:hidden absolute top-6 left-6 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-indigo to-brand-violet flex items-center justify-center shadow-lg">
            <Layers className="w-5 h-5 text-text-primary" />
          </div>
        </Link>
        
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
