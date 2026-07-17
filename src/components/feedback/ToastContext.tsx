import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, X } from 'lucide-react';

interface ToastOptions {
  title: string;
  description?: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
}

interface Toast extends ToastOptions {
  id: string;
}

interface ToastContextType {
  toast: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(({ title, description, type = 'info', duration = 3000 }: ToastOptions) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, type, duration }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="bg-surface border border-surface-border shadow-xl rounded-xl p-4 flex gap-3 w-80 items-start"
            >
              {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />}
              {t.type === 'error' && <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />}
              {t.type === 'info' && <CheckCircle2 className="w-5 h-5 text-brand-indigo shrink-0 mt-0.5" />}
              
              <div className="flex-1">
                <h4 className="text-sm font-medium text-text-primary">{t.title}</h4>
                {t.description && <p className="text-xs text-text-secondary mt-1">{t.description}</p>}
              </div>

              <button 
                onClick={() => removeToast(t.id)}
                className="text-text-muted hover:text-text-primary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
