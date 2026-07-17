import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, User, Hash, Clock, CheckCircle2 } from "lucide-react";
import { Input } from "../../components/ui/forms/Input";
import { PasswordInput } from "../../components/ui/forms/PasswordInput";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";
import { AuthService } from "../../services/auth.service";

const joinOrgSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  workspaceCode: z.string().min(1, "Workspace Code is required").toUpperCase(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type JoinOrgValues = z.infer<typeof joinOrgSchema>;

export const JoinOrganization = () => {
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const [serverError, setServerError] = useState("");
  const [isPending, setIsPending] = useState(false);
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<JoinOrgValues>({
    resolver: zodResolver(joinOrgSchema),
  });

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      setValue("workspaceCode", code);
    }
  }, [searchParams, setValue]);

  const onSubmit = async (data: JoinOrgValues) => {
    try {
      setServerError("");
      const responseData = await AuthService.joinOrg(data) as any;
      await login(responseData.accessToken, responseData.user);
      
      // Successfully created a join request
      setIsPending(true);
    } catch (err: any) {
      setServerError(err?.response?.data?.message || "Failed to join organization. Please try again.");
    }
  };

  if (isPending) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md mx-auto text-center"
      >
        <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center mx-auto mb-6">
          <Clock className="w-8 h-8 text-amber-400" />
        </div>
        
        <h2 className="text-3xl font-bold font-heading mb-2 text-text-primary">Request Sent!</h2>
        <p className="text-text-secondary mb-8">
          Your request to join the workspace has been sent successfully. Please check back later and sign in once an administrator approves your request.
        </p>

        <div className="bg-surface border border-surface-border rounded-xl p-6 flex items-center gap-4 text-left">
           <div className="w-10 h-10 rounded-full bg-surface-hover flex items-center justify-center">
             <CheckCircle2 className="w-5 h-5 text-text-muted" />
           </div>
           <div>
             <h4 className="font-semibold text-text-primary">Waiting for Approval</h4>
             <p className="text-sm text-text-muted">You can safely close this page.</p>
           </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold font-heading mb-2 text-text-primary">Join Organization</h2>
        <p className="text-text-secondary">Enter a workspace code to join your team.</p>
      </div>

      {serverError && (
        <div className="p-3 mb-4 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Workspace Code"
          type="text"
          placeholder="CD-XXXXXX"
          icon={<Hash className="w-4 h-4" />}
          error={errors.workspaceCode?.message}
          {...register("workspaceCode")}
          className="uppercase"
          autoFocus
        />

        <div className="h-px bg-surface-border my-6" />

        <Input
          label="Your Full Name"
          type="text"
          placeholder="Jane Doe"
          icon={<User className="w-4 h-4" />}
          error={errors.name?.message}
          {...register("name")}
        />

        <Input
          label="Email address"
          type="email"
          placeholder="name@company.com"
          icon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          {...register("email")}
        />
        
        <PasswordInput
          label="Password"
          placeholder="Create a strong password"
          error={errors.password?.message}
          {...register("password")}
        />

        <PasswordInput
          label="Confirm Password"
          placeholder="Repeat password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-6"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-surface-border border-t-white rounded-full animate-spin" />
          ) : (
            "Request to Join"
          )}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-text-secondary">
        Want to start a new workspace?{" "}
        <Link to="/auth/create-organization" className="font-medium text-text-primary hover:text-brand-indigo transition-colors">
          Create Organization
        </Link>
      </p>
    </motion.div>
  );
};
