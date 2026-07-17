import React from "react";
import { Shield, Key, Smartphone } from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import { useToast } from "../../../../components/feedback/ToastContext";

export const SecuritySettings = () => {
  const { toast } = useToast();

  const handleAction = (action: string) => {
    toast({ title: "Coming Soon", description: `${action} will be available in the next release.`, type: "info" });
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold font-heading text-text-primary mb-1">Security</h2>
        <p className="text-sm text-text-muted">Manage workspace security and authentication methods.</p>
      </div>

      <div className="space-y-6">
        {/* 2FA */}
        <div className="flex items-start justify-between p-4 rounded-xl border border-surface-border bg-black/[0.02] dark:bg-background">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 mt-1">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-1">Two-Factor Authentication</h3>
              <p className="text-xs text-text-muted mb-3 max-w-sm">Require all workspace members to enable 2FA on their accounts.</p>
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded w-fit">
                Currently Enabled
              </div>
            </div>
          </div>
          <Button onClick={() => handleAction("2FA Configuration")} variant="outline" size="sm" className="bg-surface-hover border-surface-border hover:bg-surface">Configure</Button>
        </div>

        {/* Sessions */}
        <div className="flex items-start justify-between p-4 rounded-xl border border-surface-border bg-black/[0.02] dark:bg-background">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-brand-indigo/10 rounded-lg text-brand-indigo mt-1">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-1">Active Sessions</h3>
              <p className="text-xs text-text-muted max-w-sm">Manage devices currently logged into your workspace via JWT.</p>
            </div>
          </div>
          <Button onClick={() => handleAction("Session Management")} variant="outline" size="sm" className="bg-surface-hover border-surface-border hover:bg-surface">View Sessions</Button>
        </div>

        {/* Password Policy */}
        <div className="flex items-start justify-between p-4 rounded-xl border border-surface-border bg-black/[0.02] dark:bg-background">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-surface-hover rounded-lg text-text-secondary mt-1">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-1">Password Policy</h3>
              <p className="text-xs text-text-muted max-w-sm">Enforce strict password requirements for all members.</p>
            </div>
          </div>
          <div className="relative inline-block w-10 h-5 align-middle select-none transition duration-200 ease-in mt-1">
            <input 
              onChange={() => handleAction("Password Policy Toggle")} 
              type="checkbox" 
              name="toggle" 
              id="toggle" 
              className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-slate-900 dark:bg-white border-4 border-surface-border appearance-none cursor-pointer checked:translate-x-5" 
              defaultChecked 
            />
            <label htmlFor="toggle" className="toggle-label block overflow-hidden h-5 rounded-full bg-surface-hover cursor-pointer"></label>
          </div>
        </div>

      </div>
    </div>
  );
};
