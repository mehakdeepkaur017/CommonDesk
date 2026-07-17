import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "../../../components/ui/Button";

interface Props {
  workspaceName: string;
}

const Confetti = () => {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    const colors = ["#4f46e5", "#7c3aed", "#34d399", "#fbbf24", "#f43f5e"];
    const newParticles = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100 - 50,
      y: Math.random() * -100 - 50,
      color: colors[Math.floor(Math.random() * colors.length)],
      scale: Math.random() * 0.5 + 0.5,
      rotation: Math.random() * 360,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, scale: 0, rotate: 0, opacity: 1 }}
          animate={{
            x: p.x * 10,
            y: p.y * 5 + 200,
            scale: p.scale,
            rotate: p.rotation + 360,
            opacity: 0,
          }}
          transition={{ duration: 2, ease: "easeOut", delay: Math.random() * 0.2 }}
          className="absolute w-3 h-3 rounded-sm"
          style={{ backgroundColor: p.color }}
        />
      ))}
    </div>
  );
};

export const SuccessStep = ({ workspaceName }: Props) => {
  return (
    <div className="text-center relative py-8">
      <Confetti />
      
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
        className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10"
      >
        <CheckCircle2 className="w-10 h-10 text-emerald-400" />
      </motion.div>
      
      <motion.h2 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-3xl font-bold font-heading mb-4 text-text-primary relative z-10"
      >
        You're all set!
      </motion.h2>
      
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-text-secondary mb-10 max-w-sm mx-auto leading-relaxed relative z-10"
      >
        <span className="font-medium text-text-primary">{workspaceName}</span> has been successfully created. We're redirecting you to your new workspace.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="relative z-10"
      >
        <Button size="lg" className="w-full sm:w-auto">
          Go to Dashboard <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </motion.div>
    </div>
  );
};
