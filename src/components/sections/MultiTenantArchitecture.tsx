import React from "react";
import { motion } from "framer-motion";
import { Database, Shield, Box, Network } from "lucide-react";

export const MultiTenantArchitecture = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-card border-brand-violet/30 mb-6">
            <Shield className="w-4 h-4 text-brand-violet" />
            <span className="text-sm font-medium text-text-primary">True Multi-Tenant Isolation</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6 tracking-tight">
            One platform. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-violet to-purple-400">
              Infinite secure workspaces.
            </span>
          </h2>
          <p className="text-text-secondary text-lg">
            Every organization gets its own dedicated workspace. Data, users, and settings are strictly isolated at the database level, ensuring enterprise-grade security.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Main Platform Node */}
          <div className="flex justify-center mb-16 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="glass-card w-48 p-6 rounded-2xl flex flex-col items-center justify-center border-brand-indigo/50 bg-brand-indigo/5 shadow-[0_0_50px_rgba(79,70,229,0.2)] relative z-10"
            >
              <Network className="w-10 h-10 text-brand-indigo mb-3" />
              <div className="font-bold text-lg mb-1">CommonDesk</div>
              <div className="text-xs text-text-muted text-center">Core Platform Engine</div>
            </motion.div>

            {/* Connecting lines */}
            <div className="absolute top-[80px] left-1/2 w-full max-w-[600px] -translate-x-1/2 h-[100px]">
              <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 600 100">
                <path d="M300,0 C300,50 100,50 100,100" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M300,0 C300,50 300,50 300,100" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M300,0 C300,50 500,50 500,100" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="4 4" />
                
                {/* Animated dots along lines */}
                <circle r="3" fill="#4f46e5">
                  <animateMotion dur="3s" repeatCount="indefinite" path="M300,0 C300,50 100,50 100,100" />
                </circle>
                <circle r="3" fill="#4f46e5">
                  <animateMotion dur="3s" begin="1s" repeatCount="indefinite" path="M300,0 C300,50 300,50 300,100" />
                </circle>
                <circle r="3" fill="#4f46e5">
                  <animateMotion dur="3s" begin="2s" repeatCount="indefinite" path="M300,0 C300,50 500,50 500,100" />
                </circle>
              </svg>
            </div>
          </div>

          {/* Organizations Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {[
              { name: "Organization A", color: "from-blue-500 to-indigo-500", border: "border-blue-500/30", bg: "bg-blue-500/5" },
              { name: "Organization B", color: "from-emerald-500 to-teal-500", border: "border-emerald-500/30", bg: "bg-emerald-500/5" },
              { name: "Organization C", color: "from-purple-500 to-fuchsia-500", border: "border-purple-500/30", bg: "bg-purple-500/5" },
            ].map((org, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className={`glass-card p-6 rounded-2xl border ${org.border} ${org.bg} relative overflow-hidden group`}
              >
                <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${org.color} opacity-50`} />
                
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-8 h-8 rounded bg-gradient-to-br ${org.color} flex items-center justify-center font-bold shadow-lg`}>
                    {org.name.split(" ")[1]}
                  </div>
                  <div className="font-semibold">{org.name}</div>
                </div>

                <div className="space-y-3">
                  {['Members', 'Projects', 'Tasks & Files', 'Analytics'].map((item, j) => (
                    <div key={j} className="flex items-center justify-between px-3 py-2 rounded-lg bg-black/[0.03] dark:bg-white/[0.03] border border-surface-border text-sm text-text-secondary group-hover:bg-black/[0.05] dark:bg-white/[0.05] transition-colors">
                      <span className="flex items-center gap-2">
                        <Box className="w-3.5 h-3.5 text-text-muted" /> {item}
                      </span>
                      <Database className="w-3 h-3 text-text-muted" />
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
          
          <p className="text-center text-text-muted text-sm mt-12 font-medium">
            Strict logical isolation guarantees that Organization A cannot access Organization B's data under any circumstances.
          </p>
        </div>

      </div>
    </section>
  );
};
