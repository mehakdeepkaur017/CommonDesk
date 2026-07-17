import React from "react";
import { ArrowRight, Building2, LogIn } from "lucide-react";

interface Props {
  onNext: () => void;
  onJoin: () => void;
}

export const WelcomeStep = ({ onNext, onJoin }: Props) => {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-brand-indigo to-brand-violet rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-brand-indigo/20">
        <span className="text-3xl">👋</span>
      </div>
      
      <h2 className="text-3xl font-bold font-heading mb-4 text-text-primary">
        Welcome to CommonDesk
      </h2>
      <p className="text-text-secondary mb-10 max-w-md mx-auto leading-relaxed">
        You're one step away from transforming how your team works. Do you want to create a new workspace or join an existing one?
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div 
          onClick={onNext}
          className="group relative glass-card p-6 rounded-2xl border border-surface-border hover:border-brand-indigo transition-all cursor-pointer bg-black/[0.02] dark:bg-background hover:bg-brand-indigo/5 text-left flex flex-col"
        >
          <div className="w-10 h-10 rounded-xl bg-brand-indigo/20 flex items-center justify-center mb-4 text-brand-indigo group-hover:scale-110 transition-transform">
            <Building2 className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-text-primary mb-1">Create Workspace</h3>
          <p className="text-xs text-text-muted mb-6">Start a fresh environment for your team or organization.</p>
          <div className="mt-auto flex items-center text-xs font-medium text-brand-indigo group-hover:text-brand-violet transition-colors">
            Continue <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div 
          onClick={onJoin}
          className="group relative glass-card p-6 rounded-2xl border border-surface-border hover:border-emerald-500 transition-all cursor-pointer bg-black/[0.02] dark:bg-background hover:bg-emerald-500/5 text-left flex flex-col"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4 text-emerald-400 group-hover:scale-110 transition-transform">
            <LogIn className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-text-primary mb-1">Join Workspace</h3>
          <p className="text-xs text-text-muted mb-6">Enter an invite code or accept a pending invitation.</p>
          <div className="mt-auto flex items-center text-xs font-medium text-emerald-400 group-hover:text-emerald-300 transition-colors">
            Continue <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};
