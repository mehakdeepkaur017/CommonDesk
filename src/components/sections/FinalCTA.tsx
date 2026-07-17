import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";

export const FinalCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-brand-indigo/5" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-indigo/20 rounded-full blur-[120px]" />
      
      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-bold font-heading mb-8 tracking-tight"
        >
          Ready to Build Your <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-indigo to-purple-400">
            Next Workspace?
          </span>
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-xl text-text-secondary mb-12 max-w-2xl mx-auto"
        >
          Join thousands of forward-thinking teams building the future of collaboration on CommonDesk.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <Button size="lg" className="group text-base" onClick={() => navigate('/auth/register')}>
            Get Started
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button size="lg" variant="outline" className="text-base" onClick={() => {
            const el = document.getElementById("features");
            if (el) el.scrollIntoView({ behavior: "smooth" });
            else navigate('/auth/register');
          }}>
            Explore Platform
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
