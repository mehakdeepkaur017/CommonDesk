import React from "react";
import { motion } from "framer-motion";

const technologies = [
  "React",
  "TypeScript",
  "Node.js",
  "Express",
  "PostgreSQL",
  "Prisma",
  "React Query",
  "Tailwind CSS",
  "Framer Motion",
  "Socket.io",
  "Redis",
  "Cloudinary",
  "Docker",
];

export const TrustedBy = () => {
  return (
    <section className="py-12 border-y border-surface-border bg-black/[0.02] dark:bg-background">
      <div className="max-w-7xl mx-auto px-6 overflow-hidden">
        <p className="text-center text-sm font-medium text-text-muted mb-8 uppercase tracking-widest">
          Built with modern technologies
        </p>
        
        <div className="relative flex overflow-x-hidden group">
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-brand-navy to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-brand-navy to-transparent z-10" />
          
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 30,
            }}
            className="flex flex-nowrap items-center gap-16 md:gap-24 pl-16 md:pl-24"
          >
            {/* Duplicate the array to create a seamless loop */}
            {[...technologies, ...technologies].map((tech, i) => (
              <div 
                key={i}
                className="text-xl md:text-2xl font-bold font-heading text-surface-border whitespace-nowrap select-none hover:text-text-muted transition-colors flex items-center gap-16 md:gap-24"
              >
                <span>{tech}</span>
                <span className="text-surface-border/50">•</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
