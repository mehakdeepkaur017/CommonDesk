import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Mail, User, Copy, CheckCircle2, ArrowRight, Users, Clock, Folder } from "lucide-react";
import { Input } from "../../components/ui/forms/Input";
import { PasswordInput } from "../../components/ui/forms/PasswordInput";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";
import { AuthService } from "../../services/auth.service";
import { WorkspaceService } from "../../services/workspace.service";


const createOrgSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  organizationName: z.string().min(2, "Organization name is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type CreateOrgValues = z.infer<typeof createOrgSchema>;

export const CreateOrganization = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [serverError, setServerError] = useState("");
  const [successData, setSuccessData] = useState<{ workspaceName: string, joinCode: string } | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateOrgValues>({
    resolver: zodResolver(createOrgSchema),
  });

  const onSubmit = async (data: CreateOrgValues) => {
    try {
      setServerError("");
      const responseData = await AuthService.registerOrg(data) as any;
      await login(responseData.accessToken, responseData.user);
      
      setSuccessData({
        workspaceName: responseData.workspace.name,
        joinCode: responseData.workspace.joinCode
      });
    } catch (err: any) {
      setServerError(err?.response?.data?.message || "Failed to create organization. Please try again.");
    }
  };

  const copyToClipboard = (text: string, type: 'code' | 'link') => {
    navigator.clipboard.writeText(text);
    if (type === 'code') {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const joinLink = `${window.location.origin}/auth/join-organization?code=${successData?.joinCode}`;



  if (successData) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg mx-auto text-center"
      >
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-brand-indigo to-brand-violet flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-brand-indigo/20 border border-white/10">
          <span className="text-4xl font-bold text-white">
            {successData.workspaceName.charAt(0).toUpperCase()}
          </span>
        </div>
        
        <h2 className="text-3xl font-bold font-heading mb-2 text-text-primary">{successData.workspaceName}</h2>
        <p className="text-text-secondary mb-8">
          Your workspace is ready. Invite your team using the unique join code below.
        </p>

        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-brand-indigo/10 border border-brand-indigo/20 rounded-2xl p-4 mb-8 flex items-center justify-center gap-3"
        >
          <Clock className="w-5 h-5 text-brand-indigo" />
          <span className="text-sm text-brand-indigo font-medium">
            Remember to approve member join requests once you access your Admin Console.
          </span>
        </motion.div>

        <div className="bg-surface border border-surface-border rounded-2xl p-6 mb-8 text-left space-y-6">
          <div>
            <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 block">Workspace Code</label>
            <div className="flex items-center justify-between bg-background border border-surface-border rounded-xl p-3">
              <code className="text-xl font-mono font-bold text-brand-indigo">{successData.joinCode}</code>
              <Button size="sm" variant="outline" onClick={() => copyToClipboard(successData.joinCode, 'code')} className="bg-surface">
                {copiedCode ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span className="ml-2">{copiedCode ? 'Copied' : 'Copy'}</span>
              </Button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 block">Direct Join Link</label>
            <div className="flex items-center justify-between bg-background border border-surface-border rounded-xl p-3">
              <span className="text-sm text-text-secondary truncate mr-4">{joinLink}</span>
              <Button size="sm" variant="outline" onClick={() => copyToClipboard(joinLink, 'link')} className="bg-surface">
                {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span className="ml-2">{copiedLink ? 'Copied' : 'Copy Link'}</span>
              </Button>
            </div>
          </div>
        </div>

        <Button className="w-full h-14 text-lg bg-brand-indigo hover:bg-brand-indigo/90" onClick={() => navigate('/admin')}>
          Continue to Admin Dashboard <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
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
        <h2 className="text-3xl font-bold font-heading mb-2 text-text-primary">Create Organization</h2>
        <p className="text-text-secondary">Set up a new workspace for your team.</p>
      </div>

      {serverError && (
        <div className="p-3 mb-4 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Organization Name"
          type="text"
          placeholder="Acme Corp"
          icon={<Building2 className="w-4 h-4" />}
          error={errors.organizationName?.message}
          {...register("organizationName")}
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
            "Create Workspace"
          )}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-text-secondary">
        Want to join an existing team?{" "}
        <Link to="/auth/join-organization" className="font-medium text-text-primary hover:text-brand-indigo transition-colors">
          Join Organization
        </Link>
      </p>
    </motion.div>
  );
};
