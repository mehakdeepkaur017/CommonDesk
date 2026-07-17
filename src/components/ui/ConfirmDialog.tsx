import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger',
  isLoading = false
}: ConfirmDialogProps) => {

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
      // Basic Enter key support for confirmation dialogs
      if (e.key === 'Enter' && isOpen && !isLoading) onConfirm();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onConfirm, isLoading]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
          className="relative w-full max-w-md bg-surface border border-surface-border rounded-2xl shadow-2xl overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="dialog-title"
          tabIndex={-1}
        >
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-full shrink-0 ${
                type === 'danger' ? 'bg-red-500/10 text-red-500' : 
                type === 'warning' ? 'bg-orange-500/10 text-orange-500' : 
                'bg-brand-indigo/10 text-brand-indigo'
              }`}>
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 id="dialog-title" className="text-lg font-bold text-text-primary mb-1">{title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
              </div>
              <button 
                onClick={onClose}
                className="p-1 -mr-2 -mt-2 text-text-muted hover:text-text-primary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="px-6 py-4 bg-black/[0.02] dark:bg-background border-t border-surface-border flex justify-end gap-3">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              {cancelText}
            </Button>
            <Button 
              onClick={onConfirm} 
              disabled={isLoading}
              className={
                type === 'danger' ? 'bg-red-500 hover:bg-red-600 text-white border-transparent' : 
                type === 'warning' ? 'bg-orange-500 hover:bg-orange-600 text-white border-transparent' : 
                ''
              }
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : confirmText}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
