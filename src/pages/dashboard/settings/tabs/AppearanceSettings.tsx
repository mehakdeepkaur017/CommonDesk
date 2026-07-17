import React, { useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import { useToast } from "../../../../components/feedback/ToastContext";
import { useTheme } from "../../../../context/ThemeContext";

export const AppearanceSettings = () => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast({ title: "Appearance Saved", description: "Your theme preferences have been updated.", type: "success" });
    }, 800);
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold font-heading text-text-primary mb-1">Appearance</h2>
        <p className="text-sm text-text-muted">Customize the look and feel of your dashboard.</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-medium text-text-primary">Theme Preference</label>
          <div className="grid grid-cols-3 gap-4">
            
            <button 
              onClick={() => setTheme("dark")}
              className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${theme === 'dark' ? 'border-brand-indigo bg-surface-hover text-brand-indigo' : 'border-transparent bg-surface-hover hover:bg-surface text-text-muted hover:text-text-primary'}`}
            >
              <Moon className="w-6 h-6" />
              <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-text-primary' : ''}`}>Dark Mode</span>
            </button>
            
            <button 
              onClick={() => setTheme("light")}
              className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${theme === 'light' ? 'border-brand-indigo bg-surface-hover text-brand-indigo' : 'border-transparent bg-surface-hover hover:bg-surface text-text-muted hover:text-text-primary'}`}
            >
              <Sun className="w-6 h-6" />
              <span className={`text-sm font-semibold ${theme === 'light' ? 'text-text-primary' : ''}`}>Light Mode</span>
            </button>
            
            <button 
              onClick={() => setTheme("system")}
              className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${theme === 'system' ? 'border-brand-indigo bg-surface-hover text-brand-indigo' : 'border-transparent bg-surface-hover hover:bg-surface text-text-muted hover:text-text-primary'}`}
            >
              <Monitor className="w-6 h-6" />
              <span className={`text-sm font-semibold ${theme === 'system' ? 'text-text-primary' : ''}`}>System</span>
            </button>
            
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-surface-border">
          <label className="text-sm font-medium text-text-primary">UI Density</label>
          <select className="h-11 w-full rounded-xl border border-surface-border bg-surface-hover px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-indigo/50">
            <option value="comfortable" className="bg-surface">Comfortable (Default)</option>
            <option value="compact" className="bg-surface">Compact</option>
          </select>
        </div>
        
        <div className="pt-6 border-t border-surface-border flex justify-end">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Appearance"}
          </Button>
        </div>
      </div>
    </div>
  );
};
