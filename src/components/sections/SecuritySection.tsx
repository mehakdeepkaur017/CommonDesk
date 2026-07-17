import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, Key, Server, FileLock2, Activity, Fingerprint } from "lucide-react";

const features = [
  { icon: <Key />, title: "JWT Authentication" },
  { icon: <Lock />, title: "Refresh Tokens" },
  { icon: <Server />, title: "Encrypted APIs" },
  { icon: <ShieldCheck />, title: "Role Permissions" },
  { icon: <FileLock2 />, title: "Secure File Storage" },
  { icon: <Activity />, title: "API Rate Limiting" },
  { icon: <Fingerprint />, title: "Audit Logs" },
];

export const SecuritySection = () => {
  return (
    <section id="security" className="py-24 relative overflow-hidden bg-surface-light/30 border-y border-surface-border">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-soft-light" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-16">
        
        {/* Left: Illustration */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-start">
          <div className="relative w-80 h-80">
            {/* Core */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border border-brand-indigo/30 rounded-full border-dashed"
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute inset-4 border border-brand-violet/20 rounded-full"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-gradient-to-br from-brand-indigo to-brand-violet rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(79,70,229,0.4)] relative">
                <ShieldCheck className="w-12 h-12 text-text-primary" />
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0, 0.5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-full border border-white"
                />
              </div>
            </div>
            {/* Orbiting particles */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ rotate: 360 }}
                transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "linear", delay: i * -2 }}
                className="absolute inset-0 origin-center"
              >
                <div className="w-3 h-3 bg-slate-900 dark:bg-white rounded-full absolute -top-1.5 left-1/2 -translate-x-1/2 shadow-[0_0_10px_white]" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right: Content */}
        <div className="w-full lg:w-1/2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-card border-emerald-500/30 mb-6">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-400/90">Bank-Grade Security</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6 tracking-tight">
            Protected at <br/> every layer.
          </h2>
          <p className="text-text-secondary text-lg mb-10">
            Security isn't an afterthought. CommonDesk is built from the ground up to protect your most sensitive organizational data.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-black/[0.02] dark:bg-background border border-surface-border hover:bg-black/[0.05] dark:bg-white/[0.05] transition-colors"
              >
                <div className="text-brand-indigo w-5 h-5 flex items-center justify-center">
                  {feature.icon}
                </div>
                <span className="text-sm font-medium text-text-primary">{feature.title}</span>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
