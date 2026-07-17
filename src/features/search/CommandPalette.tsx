import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  FolderKanban, 
  Users, 
  FileBox, 
  Settings, 
  Activity, 
  Plus, 
  LayoutDashboard,
  CheckSquare
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const commands = [
  { id: "new-project", label: "Create New Project", icon: Plus, group: "Actions" },
  { id: "new-task", label: "Create Task", icon: CheckSquare, group: "Actions" },
  { id: "invite-member", label: "Invite Member", icon: Users, group: "Actions" },
  
  { id: "nav-dashboard", label: "Go to Dashboard", icon: LayoutDashboard, group: "Navigation", path: "/dashboard" },
  { id: "nav-projects", label: "Go to Projects", icon: FolderKanban, group: "Navigation", path: "/dashboard/projects" },
  { id: "nav-files", label: "Go to Files", icon: FileBox, group: "Navigation", path: "/dashboard/files" },
  { id: "nav-analytics", label: "Go to Analytics", icon: Activity, group: "Navigation", path: "/dashboard/analytics" },
  { id: "nav-settings", label: "Go to Settings", icon: Settings, group: "Navigation", path: "/dashboard/settings" },
];

export const CommandPalette = ({ isOpen, onClose }: Props) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        // Since we are controlling state from outside or inside, we assume parent manages it, or we trigger an event.
        // For simplicity, we just stop propagation.
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredCommands = commands.filter(cmd => 
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleCommand = (cmd: { id: string; label: string; icon: any; action?: string; badge?: string; path?: string }) => {
    if (cmd.path) {
      navigate(cmd.path);
    }
    onClose();
    setQuery("");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] sm:pt-[20vh] px-4">
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-brand-navy/80 backdrop-blur-sm"
        />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.15 }}
          className="relative w-full max-w-2xl bg-surface rounded-2xl border border-surface-border shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Search Input */}
          <div className="flex items-center px-4 border-b border-surface-border bg-black/[0.02] dark:bg-background">
            <Search className="w-5 h-5 text-text-muted" />
            <input 
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a command or search..."
              className="w-full h-14 bg-transparent border-none outline-none px-4 text-text-primary placeholder:text-text-muted"
            />
            <div className="flex items-center gap-1 text-[10px] font-medium text-text-muted bg-surface-hover px-2 py-1 rounded border border-surface-border">
              <span>ESC</span>
            </div>
          </div>

          {/* Results List */}
          <div className="max-h-[60vh] overflow-y-auto p-2 scrollbar-none">
            {filteredCommands.length === 0 ? (
              <div className="p-8 text-center text-sm text-text-muted">
                No results found for "<span className="text-text-primary">{query}</span>"
              </div>
            ) : (
              <div className="space-y-4 py-2">
                
                {/* Actions Group */}
                {filteredCommands.filter(c => c.group === "Actions").length > 0 && (
                  <div className="space-y-1">
                    <div className="px-3 mb-1 text-xs font-semibold text-text-muted tracking-wider">ACTIONS</div>
                    {filteredCommands.filter(c => c.group === "Actions").map(cmd => (
                      <button
                        key={cmd.id}
                        onClick={() => handleCommand(cmd)}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-text-primary hover:text-text-primary hover:bg-brand-indigo/20 transition-colors group text-left"
                      >
                        <cmd.icon className="w-4 h-4 text-brand-indigo group-hover:text-brand-indigo" />
                        {cmd.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Navigation Group */}
                {filteredCommands.filter(c => c.group === "Navigation").length > 0 && (
                  <div className="space-y-1">
                    <div className="px-3 mb-1 text-xs font-semibold text-text-muted tracking-wider">NAVIGATION</div>
                    {filteredCommands.filter(c => c.group === "Navigation").map(cmd => (
                      <button
                        key={cmd.id}
                        onClick={() => handleCommand(cmd)}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors text-left"
                      >
                        <cmd.icon className="w-4 h-4 text-text-muted" />
                        {cmd.label}
                      </button>
                    ))}
                  </div>
                )}

              </div>
            )}
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
