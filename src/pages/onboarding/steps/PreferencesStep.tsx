import React, { useState } from "react";
import { ArrowLeft, ArrowRight, LayoutDashboard, ListTodo, Moon, Sun, Monitor } from "lucide-react";
import { Button } from "../../../components/ui/Button";

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export const PreferencesStep = ({ onNext, onBack }: Props) => {
  const [theme, setTheme] = useState("dark");
  const [layout, setLayout] = useState("board");

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold font-heading mb-2 text-text-primary">Customize your experience</h2>
        <p className="text-text-secondary">Set your default preferences. You can always change these later.</p>
      </div>

      <div className="space-y-8 mb-8">
        {/* Theme Selection */}
        <div>
          <label className="text-sm font-medium text-text-primary block mb-3">Interface Theme</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: "light", icon: <Sun className="w-5 h-5 mb-2" />, label: "Light" },
              { id: "dark", icon: <Moon className="w-5 h-5 mb-2" />, label: "Dark" },
              { id: "system", icon: <Monitor className="w-5 h-5 mb-2" />, label: "System" },
            ].map((t) => (
              <div
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border cursor-pointer transition-all ${
                  theme === t.id 
                    ? "bg-brand-indigo/10 border-brand-indigo text-brand-indigo" 
                    : "bg-surface-hover border-surface-border text-text-muted hover:bg-surface hover:text-text-primary"
                }`}
              >
                {t.icon}
                <span className="text-xs font-medium">{t.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Layout Selection */}
        <div>
          <label className="text-sm font-medium text-text-primary block mb-3">Default Project View</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: "board", icon: <LayoutDashboard className="w-5 h-5" />, label: "Kanban Board", desc: "Visual card-based workflow" },
              { id: "list", icon: <ListTodo className="w-5 h-5" />, label: "List View", desc: "Compact list of tasks" },
            ].map((l) => (
              <div
                key={l.id}
                onClick={() => setLayout(l.id)}
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                  layout === l.id 
                    ? "bg-brand-indigo/10 border-brand-indigo text-text-primary" 
                    : "bg-surface-hover border-surface-border text-text-secondary hover:bg-surface"
                }`}
              >
                <div className={`mt-0.5 ${layout === l.id ? "text-brand-indigo" : "text-text-muted"}`}>
                  {l.icon}
                </div>
                <div>
                  <div className="text-sm font-medium mb-1">{l.label}</div>
                  <div className={`text-xs ${layout === l.id ? "text-brand-indigo/70" : "text-text-muted"}`}>{l.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-4 flex items-center justify-between border-t border-surface-border">
        <button
          onClick={onBack}
          className="text-sm font-medium text-text-muted hover:text-text-primary transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        
        <Button onClick={onNext}>
          Complete Setup <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
