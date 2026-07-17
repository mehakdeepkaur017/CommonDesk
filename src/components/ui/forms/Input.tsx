import React, { forwardRef } from "react";
import { cn } from "../../../lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-sm font-medium text-text-primary ml-1">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "flex h-11 w-full rounded-xl border border-surface-border bg-surface-hover px-3 py-2 text-sm text-text-primary placeholder:text-text-muted",
              "transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-brand-indigo/50 focus:border-brand-indigo focus:bg-surface",
              "disabled:cursor-not-allowed disabled:opacity-50",
              icon && "pl-10",
              error && "border-red-500/50 focus:ring-red-500/50 focus:border-red-500",
              className
            )}
            {...props}
          />
        </div>
        <AnimatePresence>
          {error && (
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-xs text-red-400 ml-1"
            >
              {error}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    );
  }
);
Input.displayName = "Input";
