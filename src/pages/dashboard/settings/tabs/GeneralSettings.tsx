import React, { useState } from "react";
import { Camera } from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import { useWorkspace } from "../../../../hooks/queries/useWorkspace";
import { useToast } from "../../../../components/feedback/ToastContext";

export const GeneralSettings = () => {
  const { data: workspace } = useWorkspace();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast({ title: "Settings Saved", description: "Your general settings have been updated.", type: "success" });
    }, 800);
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold font-heading text-text-primary mb-1">General Settings</h2>
        <p className="text-sm text-text-muted">Manage your workspace profile and general preferences.</p>
      </div>

      <div className="space-y-6">
        {/* Workspace Logo */}
        <div className="flex items-center gap-6 pb-6 border-b border-surface-border">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-indigo to-brand-violet flex items-center justify-center text-2xl font-bold text-text-primary relative group cursor-pointer overflow-hidden">
            {workspace?.name?.charAt(0) || "W"}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="w-6 h-6 text-text-primary" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary mb-1">Workspace Logo</h3>
            <p className="text-xs text-text-muted mb-3">Recommended size 256x256px.</p>
            <Button variant="outline" size="sm" className="bg-surface-hover border-surface-border hover:bg-surface">
              Upload New
            </Button>
          </div>
        </div>

        {/* Workspace Name */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">Workspace Name</label>
          <input 
            type="text" 
            defaultValue={workspace?.name || "Acme Corp"}
            className="w-full h-10 bg-surface-hover border border-surface-border rounded-lg px-3 text-sm text-text-primary focus:outline-none focus:border-brand-indigo transition-colors"
          />
        </div>

        {/* Workspace URL */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">Workspace URL</label>
          <div className="flex items-center">
            <span className="h-10 px-3 bg-surface-hover border border-surface-border border-r-0 rounded-l-lg flex items-center text-sm text-text-muted">
              commondesk.com/
            </span>
            <input 
              type="text" 
              defaultValue="acme"
              className="flex-1 h-10 bg-surface-hover border border-surface-border rounded-r-lg px-3 text-sm text-text-primary focus:outline-none focus:border-brand-indigo transition-colors"
            />
          </div>
        </div>

        <div className="pt-6 border-t border-surface-border flex justify-end">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
};
