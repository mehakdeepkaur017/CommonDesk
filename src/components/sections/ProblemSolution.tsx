import React from "react";
import { motion } from "framer-motion";
import { XCircle, CheckCircle2, ArrowRight } from "lucide-react";

const problems = [
  "Scattered communication across 5 apps",
  "Lost files in endless email threads",
  "Poor collaboration across departments",
  "No central organization or truth",
  "Role confusion and access issues",
];

const solutions = [
  "Centralized workspace for everything",
  "Organized files with universal search",
  "Real-time updates and collaboration",
  "Complete organizational isolation",
  "Granular role-based permissions",
];

export const ProblemSolution = () => {
  return (
    <section id="solutions" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6 tracking-tight">
            Stop working in chaos. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-indigo to-brand-violet">
              Start working in sync.
            </span>
          </h2>
          <p className="text-text-secondary text-lg">
            Replace disjointed tools with a single, unified platform designed for multi-tenant enterprise collaboration.
          </p>
        </div>

        <div className="grid md:grid-cols-[1fr_auto_1fr] gap-8 md:gap-4 items-center">
          
          {/* Problems */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-8 border border-surface-border bg-black/[0.01] dark:bg-background"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold">The Old Way</h3>
            </div>
            
            <ul className="space-y-6">
              {problems.map((problem, i) => (
                <li key={i} className="flex items-center gap-3 text-text-secondary">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400/50" />
                  {problem}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Connectors */}
          <div className="hidden md:flex flex-col gap-6 items-center justify-center py-8">
            {problems.map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="w-12 h-12 rounded-full border border-surface-border flex items-center justify-center bg-black/[0.02] dark:bg-background"
              >
                <ArrowRight className="w-4 h-4 text-surface-border" />
              </motion.div>
            ))}
          </div>

          {/* Solutions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-8 border border-brand-indigo/30 bg-gradient-to-b from-brand-indigo/[0.05] to-transparent relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-indigo/10 rounded-full blur-3xl" />
            
            <div className="flex items-center gap-3 mb-8 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-brand-indigo/20 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-brand-indigo" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary">The CommonDesk Way</h3>
            </div>
            
            <ul className="space-y-6 relative z-10">
              {solutions.map((solution, i) => (
                <li key={i} className="flex items-center gap-3 text-text-primary">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-indigo shadow-[0_0_8px_rgba(79,70,229,0.8)]" />
                  {solution}
                </li>
              ))}
            </ul>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
