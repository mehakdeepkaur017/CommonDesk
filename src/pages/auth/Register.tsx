import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, User } from "lucide-react";
import { Input } from "../../components/ui/forms/Input";
import { PasswordInput } from "../../components/ui/forms/PasswordInput";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";
import { AuthService } from "../../services/auth.service";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  role: z.enum(["ADMIN", "MEMBER"], { errorMap: () => ({ message: "Please select a role" }) }),
  acceptTerms: z.boolean().refine((val) => val === true, "You must accept the terms"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const calculateStrength = (pass: string) => {
  let score = 0;
  if (!pass) return score;
  if (pass.length > 8) score += 1;
  if (pass.length >= 12) score += 1;
  if (/[A-Z]/.test(pass)) score += 1;
  if (/[0-9]/.test(pass)) score += 1;
  if (/[^A-Za-z0-9]/.test(pass)) score += 1;
  return Math.min(4, score);
};

export const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [strength, setStrength] = useState(0);
  const [serverError, setServerError] = useState("");
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const passwordValue = watch("password");

  useEffect(() => {
    setStrength(calculateStrength(passwordValue || ""));
  }, [passwordValue]);

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setServerError("");
      const res = await AuthService.registerOrg({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        organizationName: data.name + "'s Workspace",
      });
      const responseData = res as any;
      login(responseData.accessToken, responseData.user);
      
      if (responseData.user.role === 'ADMIN') {
        navigate("/onboarding");
      } else {
        navigate("/join");
      }
    } catch (err: any) {
      setServerError(err?.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  const strengthColors = ["bg-surface", "bg-red-400", "bg-amber-400", "bg-emerald-400", "bg-brand-teal"];
  const strengthText = ["", "Weak", "Fair", "Good", "Strong"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold font-heading mb-2 text-text-primary">Create an account</h2>
        <p className="text-text-secondary">Create your CommonDesk account to get started.</p>
      </div>

      {serverError && (
        <div className="p-3 mb-4 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          placeholder="Jane Doe"
          icon={<User className="w-4 h-4" />}
          error={errors.name?.message}
          {...register("name")}
          autoFocus
        />

        <Input
          label="Email address"
          type="email"
          placeholder="name@company.com"
          icon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          {...register("email")}
        />

        <div className="space-y-2">
          <label className="text-sm font-medium text-text-primary">Register as</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
              <input type="radio" value="ADMIN" {...register("role")} className="text-brand-indigo focus:ring-brand-indigo bg-surface-hover border-surface-border" />
              Administrator
            </label>
            <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
              <input type="radio" value="MEMBER" {...register("role")} className="text-brand-indigo focus:ring-brand-indigo bg-surface-hover border-surface-border" />
              Member
            </label>
          </div>
          {errors.role && <p className="text-xs text-red-400">{errors.role.message}</p>}
        </div>
        
        <div className="space-y-2">
          <PasswordInput
            label="Password"
            placeholder="Create a strong password"
            error={errors.password?.message}
            {...register("password")}
          />
          {passwordValue && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 flex gap-1 h-1">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-full transition-colors duration-300 ${
                      i < strength ? strengthColors[strength] : "bg-surface"
                    }`}
                  />
                ))}
              </div>
              <span className={`text-[10px] font-medium w-10 text-right ${
                strength === 4 ? "text-brand-teal" : strength >= 2 ? "text-emerald-400" : "text-text-muted"
              }`}>
                {strengthText[strength]}
              </span>
            </div>
          )}
        </div>

        <PasswordInput
          label="Confirm Password"
          placeholder="Repeat password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <div className="flex items-start gap-2 py-2 mt-2">
          <input
            type="checkbox"
            id="acceptTerms"
            className="mt-1 w-4 h-4 rounded bg-surface-hover border-surface-border text-brand-indigo focus:ring-brand-indigo focus:ring-offset-brand-navy"
            {...register("acceptTerms")}
          />
          <label htmlFor="acceptTerms" className="text-sm text-text-secondary select-none cursor-pointer leading-tight">
            I agree to the <a href="#" className="text-text-primary hover:underline">Terms of Service</a> and{" "}
            <a href="#" className="text-text-primary hover:underline">Privacy Policy</a>.
          </label>
        </div>
        {errors.acceptTerms && (
          <p className="text-xs text-red-400 ml-6">{errors.acceptTerms.message}</p>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-4"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-surface-border border-t-white rounded-full animate-spin" />
          ) : (
            "Create Account"
          )}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-text-secondary">
        Already have an account?{" "}
        <Link to="/auth/login" className="font-medium text-text-primary hover:text-brand-indigo transition-colors">
          Log in instead
        </Link>
      </p>
    </motion.div>
  );
};
