import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  className = '',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  disabled,
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-xl';
  
  const variants = {
    primary: 'bg-brand-indigo text-white hover:bg-brand-indigo/90 shadow-sm focus:ring-brand-indigo',
    secondary: 'bg-surface-hover text-text-primary hover:bg-surface border border-surface-border focus:ring-brand-indigo',
    outline: 'border border-surface-border bg-transparent hover:bg-surface-hover text-text-primary focus:ring-brand-indigo',
    ghost: 'bg-transparent hover:bg-surface-hover text-text-secondary hover:text-text-primary focus:ring-brand-indigo',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 shadow-sm',
  };
  
  const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base',
    icon: 'h-9 w-9 p-0',
  };

  const darkModeOffsets = "dark:focus:ring-offset-brand-navy";

  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${darkModeOffsets} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
      ) : null}
      {children}
    </motion.button>
  );
});

Button.displayName = 'Button';
