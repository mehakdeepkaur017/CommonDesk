import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FolderKanban, Users, CheckSquare, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../api/axios';
import { useDebounce } from '../../hooks/useDebounce';
import { useWorkspace } from '../../hooks/queries/useWorkspace';
import { useProjects } from '../../hooks/queries/useProjects';
import { useMembers } from '../../hooks/queries/useMembers';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette = ({ isOpen, onClose }: CommandPaletteProps) => {
  const { data: workspaceData } = useWorkspace();
  const { data: projectData } = useProjects();
  const { data: memberData } = useMembers();

  const projects = projectData?.items || [];
  const members = memberData?.items || memberData || [];

  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const [results, setResults] = useState<{ projects: any[], members: any[], tasks: any[] }>({ projects: [], members: [], tasks: [] });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open triggered by parent state usually, but this acts as toggle if we pass down setOpen
        }
      }
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!debouncedQuery) {
      setResults({ projects: [], members: [], tasks: [] });
      return;
    }

    const fetchSearch = async () => {
      setIsLoading(true);
      try {
        const res = await apiClient.get(`/search?q=${debouncedQuery}`);
        setResults(res as any);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSearch();
  }, [debouncedQuery]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
          className="relative w-full max-w-2xl bg-surface border border-surface-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        >
          {/* Search Input */}
          <div className="flex items-center px-4 py-4 border-b border-surface-border">
            <Search className="w-5 h-5 text-text-muted shrink-0" />
            <input 
              autoFocus
              type="text" 
              placeholder="Search members, projects, and tasks..." 
              className="flex-1 bg-transparent border-none outline-none px-4 text-text-primary placeholder:text-text-muted"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {isLoading && <div className="w-4 h-4 border-2 border-brand-indigo/20 border-t-brand-indigo rounded-full animate-spin shrink-0" />}
            <button onClick={onClose} className="p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors ml-2">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto p-2 scrollbar-none">
            {!query && (
              <div className="p-8 text-center">
                <p className="text-sm text-text-muted">Start typing to search across your workspace.</p>
              </div>
            )}
            
            {query && !isLoading && results.projects.length === 0 && results.members.length === 0 && results.tasks.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-sm text-text-muted">No results found for "{query}".</p>
              </div>
            )}

            {results.projects.length > 0 && (
              <div className="mb-4">
                <div className="px-3 py-1.5 text-[11px] font-bold text-text-muted uppercase tracking-wider">Projects</div>
                {results.projects.map((p) => (
                  <button 
                    key={p.id}
                    onClick={() => { navigate(`/admin/projects/${p.id}`); onClose(); }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left hover:bg-brand-indigo/10 hover:text-brand-indigo text-text-secondary transition-colors"
                  >
                    <FolderKanban className="w-4 h-4 opacity-50" />
                    <span className="font-medium text-sm text-text-primary">{p.name}</span>
                  </button>
                ))}
              </div>
            )}

            {results.members.length > 0 && (
              <div className="mb-4">
                <div className="px-3 py-1.5 text-[11px] font-bold text-text-muted uppercase tracking-wider">Members</div>
                {results.members.map((m: any) => (
                  <button 
                    key={m.user.id}
                    onClick={() => { navigate('/admin/members'); onClose(); }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left hover:bg-brand-indigo/10 hover:text-brand-indigo text-text-secondary transition-colors"
                  >
                    <Users className="w-4 h-4 opacity-50" />
                    <span className="font-medium text-sm text-text-primary">{m.user.name}</span>
                    <span className="text-xs opacity-50">- {m.role.name}</span>
                  </button>
                ))}
              </div>
            )}

            {results.tasks.length > 0 && (
              <div className="mb-4">
                <div className="px-3 py-1.5 text-[11px] font-bold text-text-muted uppercase tracking-wider">Tasks</div>
                {results.tasks.map((t) => (
                  <button 
                    key={t.id}
                    onClick={() => { navigate(`/admin/tasks`); onClose(); }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left hover:bg-brand-indigo/10 hover:text-brand-indigo text-text-secondary transition-colors"
                  >
                    <CheckSquare className="w-4 h-4 opacity-50" />
                    <span className="font-medium text-sm text-text-primary">{t.title}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-2 bg-black/[0.02] dark:bg-background border-t border-surface-border text-xs text-text-muted flex justify-between">
            <div className="flex gap-4">
              <span><kbd className="font-sans font-medium px-1 rounded bg-surface border border-surface-border mr-1">↑↓</kbd> to navigate</span>
              <span><kbd className="font-sans font-medium px-1 rounded bg-surface border border-surface-border mr-1">Enter</kbd> to select</span>
            </div>
            <span><kbd className="font-sans font-medium px-1 rounded bg-surface border border-surface-border mr-1">Esc</kbd> to close</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
