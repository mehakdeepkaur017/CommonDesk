import React, { forwardRef, useState, useEffect } from "react";
import { Eye, EyeOff, AlertTriangle } from "lucide-react";
import { Input, type InputProps } from "./Input";
import { motion, AnimatePresence } from "framer-motion";

export const PasswordInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [capsLockActive, setCapsLockActive] = useState(false);

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.getModifierState) {
          setCapsLockActive(e.getModifierState("CapsLock"));
        }
      };
      
      // We only want to listen when the input is focused, but to keep it simple,
      // we listen globally or attach it to the input via onKeyUp/Down
      window.addEventListener("keyup", handleKeyDown);
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keyup", handleKeyDown);
        window.removeEventListener("keydown", handleKeyDown);
      };
    }, []);

    return (
      <div className="relative w-full">
        <Input
          ref={ref}
          type={showPassword ? "text" : "password"}
          className={`pr-10 ${className}`}
          {...props}
        />
        
        <div className="absolute right-3 top-[34px] -translate-y-1/2 flex items-center gap-2">
          <AnimatePresence>
            {capsLockActive && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                title="Caps Lock is ON"
              >
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              </motion.div>
            )}
          </AnimatePresence>
          
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-text-muted hover:text-text-primary transition-colors focus:outline-none"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";
