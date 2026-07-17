import React, { useState } from "react";
import { Button } from "../../../../components/ui/Button";
import { useToast } from "../../../../components/feedback/ToastContext";

const notificationOptions = [
  { id: "email_digest", label: "Daily Email Digest", desc: "Receive a summary of workspace activity every morning.", default: true },
  { id: "desktop_push", label: "Desktop Notifications", desc: "Get native browser notifications for direct mentions.", default: false },
  { id: "task_reminders", label: "Task Reminders", desc: "Remind me when tasks are due within 24 hours.", default: true },
  { id: "project_updates", label: "Project Updates", desc: "Notify me when a project I'm assigned to changes status.", default: true },
];

export const NotificationsSettings = () => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast({ title: "Preferences Saved", description: "Your notification settings have been updated.", type: "success" });
    }, 800);
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold font-heading text-text-primary mb-1">Notifications</h2>
        <p className="text-sm text-text-muted">Configure how and when you receive workspace alerts.</p>
      </div>

      <div className="space-y-4">
        {notificationOptions.map((opt) => (
          <div key={opt.id} className="flex items-center justify-between p-4 rounded-xl border border-surface-border bg-black/[0.02] dark:bg-background">
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-1">{opt.label}</h3>
              <p className="text-xs text-text-muted">{opt.desc}</p>
            </div>
            
            <div className="relative inline-block w-10 h-5 align-middle select-none transition duration-200 ease-in ml-4">
              <input 
                type="checkbox" 
                id={`toggle-${opt.id}`} 
                defaultChecked={opt.default}
                className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-slate-900 dark:bg-white border-4 border-surface-border appearance-none cursor-pointer checked:translate-x-5" 
              />
              <label 
                htmlFor={`toggle-${opt.id}`} 
                className="toggle-label block overflow-hidden h-5 rounded-full bg-surface-hover cursor-pointer"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="pt-6 border-t border-surface-border flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Preferences"}
        </Button>
      </div>
    </div>
  );
};
