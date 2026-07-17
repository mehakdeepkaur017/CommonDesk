import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const steps = [
  { title: "Authentication", desc: "Secure JWT login", icon: "01" },
  { title: "Workspace Creation", desc: "Initialize your tenant", icon: "02" },
  { title: "Invite Members", desc: "Role-based access", icon: "03" },
  { title: "Create Projects", desc: "Organize workflows", icon: "04" },
  { title: "Assign Tasks", desc: "Track progress", icon: "05" },
  { title: "Upload Files", desc: "Centralized assets", icon: "06" },
  { title: "Real-Time Updates", desc: "Instant sync", icon: "07" },
  { title: "Analytics", desc: "Data insights", icon: "08" },
  { title: "Audit Logs", desc: "Track every action", icon: "09" },
];

export const FeatureTimeline = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress within this component's boundaries
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  // Scale the glow line based on scroll progress
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="py-32 relative bg-surface overflow-hidden" ref={containerRef}>
      <div className="max-w-7xl mx-auto px-6 mb-24 relative z-10 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold font-heading mb-6 tracking-tight text-white"
        >
          A seamless journey from <br/>
          <span className="text-brand-indigo">start to scale.</span>
        </motion.h2>
      </div>

      <div className="max-w-4xl mx-auto px-6 relative">
        {/* Background Track Line (Dim) */}
        <div className="absolute left-10 md:left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-surface-border rounded-full" />
        
        {/* Glowing Progress Line */}
        <motion.div 
          style={{ scaleY, originY: 0 }}
          className="absolute left-10 md:left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-brand-violet via-brand-indigo to-brand-teal rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)] z-0" 
        />

        <div className="relative z-10 flex flex-col gap-12 md:gap-24">
          {steps.map((step, i) => {
            const isEven = i % 2 === 0;
            return (
              <div key={i} className={`flex items-center w-full ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'} flex-row`}>
                
                {/* Empty Space for alignment on desktop */}
                <div className="hidden md:block w-1/2" />
                
                {/* Central Marker */}
                <div className="absolute left-10 md:left-1/2 -translate-x-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-surface border-2 border-brand-indigo shadow-[0_0_15px_rgba(99,102,241,0.4)] z-20">
                   <div className="text-[10px] font-bold text-white tracking-widest">{step.icon}</div>
                </div>
                
                {/* Content Card */}
                <motion.div 
                  initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={`w-full md:w-1/2 pl-24 md:pl-0 ${isEven ? 'md:pr-16 md:text-right' : 'md:pl-16 md:text-left'}`}
                >
                  <div className="glass-card p-6 md:p-8 rounded-3xl border border-surface-border hover:border-brand-indigo/30 transition-colors bg-black/40 backdrop-blur-md relative overflow-hidden group">
                     {/* Hover Glow */}
                     <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-brand-indigo/10 to-transparent pointer-events-none ${isEven ? 'bg-gradient-to-bl' : 'bg-gradient-to-br'}`} />
                     
                     <div className="text-brand-indigo text-xs font-bold mb-2 uppercase tracking-widest">Step {step.icon}</div>
                     <h4 className="text-xl md:text-2xl font-bold text-white mb-2">{step.title}</h4>
                     <p className="text-text-muted text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
                
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
