import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldAlert, ShieldCheck, Key, Lock, Smartphone, 
  Activity, Server, Eye, ToggleLeft, ToggleRight,
  MonitorSmartphone, Shield
} from 'lucide-react';

export const SecurityCenter = () => {
  const [toggles, setToggles] = useState({
    enforce2FA: true,
    requireStrongPasswords: true,
    preventConcurrentSessions: false,
    sessionTimeout: true,
    apiAccess: true
  });

  const handleToggle = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-10">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-heading text-text-primary mb-1">Security Center</h1>
        <p className="text-sm text-text-muted">Manage authentication policies, sessions, and API access.</p>
      </div>

      {/* Security Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 bg-surface border border-emerald-500/20 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <ShieldCheck className="w-24 h-24 text-emerald-500" />
          </div>
          <div className="relative z-10">
            <h3 className="text-sm font-bold text-text-primary mb-1">System Status</h3>
            <p className="text-3xl font-bold text-emerald-400 mb-2">Secure</p>
            <p className="text-xs text-text-muted">All systems operating normally. No active threats detected.</p>
          </div>
        </div>

        <div className="p-6 bg-surface border border-surface-border rounded-2xl">
          <h3 className="text-sm font-bold text-text-primary mb-1">Active Sessions</h3>
          <p className="text-3xl font-bold text-text-primary mb-2">1,248</p>
          <p className="text-xs text-brand-indigo font-medium flex items-center gap-1">
            <Activity className="w-3 h-3" /> Normal volume
          </p>
        </div>

        <div className="p-6 bg-surface border border-surface-border rounded-2xl">
          <h3 className="text-sm font-bold text-text-primary mb-1">Blocked IPs (24h)</h3>
          <p className="text-3xl font-bold text-text-primary mb-2">34</p>
          <p className="text-xs text-red-400 font-medium flex items-center gap-1">
            <ShieldAlert className="w-3 h-3" /> Automatic rate limiting active
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column - Policies */}
        <div className="space-y-6">
          <div className="bg-surface border border-surface-border rounded-2xl p-6">
            <h3 className="text-lg font-bold text-text-primary flex items-center gap-2 mb-6">
              <Lock className="w-5 h-5 text-brand-indigo" /> Authentication Policies
            </h3>
            <div className="space-y-6">
              
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-text-primary">Enforce Two-Factor Authentication</h4>
                  <p className="text-xs text-text-muted mt-1 max-w-sm">Require all organizational members to configure 2FA via an authenticator app.</p>
                </div>
                <button onClick={() => handleToggle('enforce2FA')} className="shrink-0 mt-1">
                  {toggles.enforce2FA ? <ToggleRight className="w-8 h-8 text-brand-indigo" /> : <ToggleLeft className="w-8 h-8 text-surface-border" />}
                </button>
              </div>

              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-text-primary">Require Strong Passwords</h4>
                  <p className="text-xs text-text-muted mt-1 max-w-sm">Enforce minimum 12 characters, numbers, and symbols.</p>
                </div>
                <button onClick={() => handleToggle('requireStrongPasswords')} className="shrink-0 mt-1">
                  {toggles.requireStrongPasswords ? <ToggleRight className="w-8 h-8 text-brand-indigo" /> : <ToggleLeft className="w-8 h-8 text-surface-border" />}
                </button>
              </div>

            </div>
          </div>

          <div className="bg-surface border border-surface-border rounded-2xl p-6">
            <h3 className="text-lg font-bold text-text-primary flex items-center gap-2 mb-6">
              <MonitorSmartphone className="w-5 h-5 text-brand-indigo" /> Session Management
            </h3>
            <div className="space-y-6">
              
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-text-primary">Prevent Concurrent Sessions</h4>
                  <p className="text-xs text-text-muted mt-1 max-w-sm">Automatically log out users if they sign in from a new device.</p>
                </div>
                <button onClick={() => handleToggle('preventConcurrentSessions')} className="shrink-0 mt-1">
                  {toggles.preventConcurrentSessions ? <ToggleRight className="w-8 h-8 text-brand-indigo" /> : <ToggleLeft className="w-8 h-8 text-surface-border" />}
                </button>
              </div>

              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-text-primary">Idle Session Timeout</h4>
                  <p className="text-xs text-text-muted mt-1 max-w-sm">Terminate JWT sessions after 24 hours of inactivity.</p>
                </div>
                <button onClick={() => handleToggle('sessionTimeout')} className="shrink-0 mt-1">
                  {toggles.sessionTimeout ? <ToggleRight className="w-8 h-8 text-brand-indigo" /> : <ToggleLeft className="w-8 h-8 text-surface-border" />}
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Right Column - API & Infrastructure */}
        <div className="space-y-6">
          <div className="bg-surface border border-surface-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                <Key className="w-5 h-5 text-brand-indigo" /> API Keys & Access
              </h3>
              <button className="text-xs text-brand-indigo font-medium hover:text-brand-indigo/80">Generate Key</button>
            </div>
            
            <div className="flex items-start justify-between gap-4 mb-6 pb-6 border-b border-surface-border">
              <div>
                <h4 className="text-sm font-bold text-text-primary">Enable API Access</h4>
                <p className="text-xs text-text-muted mt-1 max-w-sm">Allow developers to authenticate via REST API tokens.</p>
              </div>
              <button onClick={() => handleToggle('apiAccess')} className="shrink-0 mt-1">
                {toggles.apiAccess ? <ToggleRight className="w-8 h-8 text-brand-indigo" /> : <ToggleLeft className="w-8 h-8 text-surface-border" />}
              </button>
            </div>

            <div className="space-y-3">
              {[
                { name: 'Production Frontend Service', prefix: 'sk_live_...94x2', lastUsed: '2 minutes ago' },
                { name: 'Zapier Integration', prefix: 'sk_live_...8a9z', lastUsed: '5 hours ago' }
              ].map((key, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-black/[0.02] dark:bg-background border border-surface-border">
                  <div>
                    <p className="text-sm font-bold text-text-primary">{key.name}</p>
                    <p className="text-xs text-text-muted mt-0.5 font-mono">{key.prefix}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Last Used</p>
                    <p className="text-xs font-medium text-text-secondary">{key.lastUsed}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface border border-surface-border rounded-2xl p-6">
            <h3 className="text-lg font-bold text-text-primary flex items-center gap-2 mb-6">
              <Server className="w-5 h-5 text-brand-indigo" /> Infrastructure Security
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-sm font-medium text-emerald-400">WebSocket Encryption (WSS)</span>
                <Shield className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-sm font-medium text-emerald-400">JWT Token Rotation</span>
                <Shield className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-sm font-medium text-emerald-400">Strict Rate Limiting Active</span>
                <Shield className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};
