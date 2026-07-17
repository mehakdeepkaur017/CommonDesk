import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "../ui/Button";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog = ({
  isOpen,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  danger = false,
  onConfirm,
  onCancel
}: ConfirmDialogProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-brand-navy/80 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-md bg-surface rounded-2xl border border-surface-border shadow-2xl p-6 overflow-hidden"
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-full shrink-0 ${danger ? 'bg-red-500/10 text-red-400' : 'bg-brand-indigo/10 text-brand-indigo'}`}>
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-text-primary mb-2">{title}</h3>
                <p className="text-sm text-text-secondary mb-6 leading-relaxed">
                  {description}
                </p>
                <div className="flex items-center gap-3 justify-end">
                  <Button variant="outline" onClick={onCancel} className="bg-transparent border-surface-border hover:bg-surface-hover">
                    {cancelText}
                  </Button>
                  <Button onClick={onConfirm} className={danger ? "bg-red-600 hover:bg-red-700 text-text-primary border-none" : ""}>
                    {confirmText}
                  </Button>
                </div>
              </div>
            </div>
            <button 
              onClick={onCancel}
              className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
