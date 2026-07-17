import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2 } from "lucide-react";
import { memberService } from "../../services/member.service";
import { Input } from "../ui/forms/Input";
import { Button } from "../ui/Button";

const inviteSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  role: z.string(),
  department: z.string().optional(),
  message: z.string().optional(),
});

type InviteFormValues = z.infer<typeof inviteSchema>;

interface Props {
  onClose: () => void;
}

export const InviteMemberDrawer = ({ onClose }: Props) => {
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      role: "member",
    }
  });

  const onSubmit = async (data: InviteFormValues) => {
    try {
      await memberService.inviteMember({ email: data.email, roleId: data.role });
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error("Failed to send invite", err);
    }
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-brand-navy/80 backdrop-blur-sm z-50"
      />

      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-surface border-l border-surface-border shadow-2xl z-50 flex flex-col"
      >
        <div className="flex items-center justify-between p-6 border-b border-surface-border">
          <h2 className="text-xl font-bold font-heading text-text-primary">Invite Team Member</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors p-1 rounded-md hover:bg-surface-hover">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 scrollbar-none relative">
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center p-6"
              >
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-4 border border-emerald-500/30">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-2">Invitation Sent!</h3>
                <p className="text-sm text-text-muted">
                  An email has been sent with instructions on how to join the workspace.
                </p>
              </motion.div>
            ) : (
              <motion.form 
                key="form"
                id="invite-member-form" 
                onSubmit={handleSubmit(onSubmit)} 
                className="space-y-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Input
                  label="Email Address"
                  placeholder="colleague@example.com"
                  type="email"
                  error={errors.email?.message}
                  {...register("email")}
                  autoFocus
                />

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-text-primary ml-1">Workspace Role</label>
                  <select className="h-11 rounded-xl border border-surface-border bg-surface-hover px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-indigo/50" {...register("role")}>
                    <option value="member" className="bg-surface">Member</option>
                    <option value="admin" className="bg-surface">Organization Admin</option>
                  </select>
                  <p className="text-xs text-text-muted ml-1 mt-1">Admins can manage projects, members, and billing.</p>
                </div>

                <Input
                  label="Department (Optional)"
                  placeholder="e.g. Engineering, Design"
                  {...register("department")}
                />

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-text-primary ml-1">Personal Message (Optional)</label>
                  <textarea
                    className="flex w-full rounded-xl border border-surface-border bg-surface-hover px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-indigo/50 transition-all min-h-[100px] resize-none"
                    placeholder="Welcome to the team!"
                    {...register("message")}
                  />
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {!isSuccess && (
          <div className="p-6 border-t border-surface-border bg-surface-light/20 flex gap-3">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" form="invite-member-form" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Invite"}
            </Button>
          </div>
        )}
      </motion.div>
    </>
  );
};
