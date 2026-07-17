import React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 p-1 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 rounded-xl">
      <button
        onClick={() => setTheme('light')}
        className={`p-1.5 rounded-lg transition-colors ${
          theme === 'light' 
            ? 'bg-surface shadow-sm text-brand-indigo' 
            : 'text-text-muted hover:text-text-primary hover:bg-surface-hover'
        }`}
        title="Light Mode"
      >
        <Sun className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`p-1.5 rounded-lg transition-colors ${
          theme === 'dark' 
            ? 'bg-surface shadow-sm text-brand-indigo' 
            : 'text-text-muted hover:text-text-primary hover:bg-surface-hover'
        }`}
        title="Dark Mode"
      >
        <Moon className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme('system')}
        className={`p-1.5 rounded-lg transition-colors ${
          theme === 'system' 
            ? 'bg-surface shadow-sm text-brand-indigo' 
            : 'text-text-muted hover:text-text-primary hover:bg-surface-hover'
        }`}
        title="System Preference"
      >
        <Monitor className="w-4 h-4" />
      </button>
    </div>
  );
};
