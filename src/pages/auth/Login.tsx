import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Loader2 } from "lucide-react";
import { AuthService } from "../../services/auth.service";
import { useAuth } from "../../context/AuthContext";
import { Input } from "../../components/ui/forms/Input";
import { PasswordInput } from "../../components/ui/forms/PasswordInput";
import { Button } from "../../components/ui/Button";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const Login = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const { login } = useAuth();

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const res = await AuthService.login(data);
      const responseData = res as any;
      await login(responseData.accessToken, responseData.user);
      
      const hasWorkspace = !!localStorage.getItem('commondesk_workspace');
      
      if (!hasWorkspace && responseData.user.role === 'ADMIN') {
        navigate("/onboarding");
      } else if (responseData.user.role === 'ADMIN') {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err: any) {
      setServerError(err?.response?.data?.message || "Login failed. Please check your credentials.");
      console.error("Login failed", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold font-heading mb-2 text-text-primary">Welcome back</h2>
        <p className="text-text-secondary">Log in to your CommonDesk account.</p>
      </div>

      {serverError && (
        <div className="p-3 mb-4 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email address"
          type="email"
          placeholder="name@company.com"
          icon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          {...register("email")}
          autoFocus
        />
        
        <div className="space-y-1">
          <label className="text-sm font-medium text-text-primary ml-1">Password</label>

          <PasswordInput
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password")}
          />
        </div>

        <div className="flex items-center gap-2 py-2">
          <input
            type="checkbox"
            id="remember"
            className="w-4 h-4 rounded bg-surface-hover border-surface-border text-brand-indigo focus:ring-brand-indigo focus:ring-offset-brand-navy"
            {...register("remember")}
          />
          <label htmlFor="remember" className="text-sm text-text-secondary select-none cursor-pointer">
            Remember me for 30 days
          </label>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-2"
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin mx-auto" />
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      <div className="mt-8 pt-6 border-t border-surface-border text-center">
        <p className="text-sm text-text-secondary mb-4">Don't have an account?</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/auth/join-organization" className="text-sm font-medium text-brand-indigo hover:text-brand-indigo/80 transition-colors">
            Join existing workspace
          </Link>
          <span className="hidden sm:inline text-surface-border">•</span>
          <Link to="/auth/create-organization" className="text-sm font-medium text-text-primary hover:text-brand-indigo transition-colors">
            Create new workspace
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
