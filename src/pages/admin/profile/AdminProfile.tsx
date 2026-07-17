import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { User, Mail, Camera, Save, Loader2, LogOut } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../components/feedback/ToastContext";
import { AuthService } from "../../../services/auth.service";

export const AdminProfile = () => {
  const { user, updateUser, logout } = useAuth();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("avatar", file);

      // apiClient returns response.data directly due to interceptor
      const res = await AuthService.uploadAvatar(formData);
      const newAvatarUrl = res.avatarUrl || res.data?.avatarUrl; 
      
      if (newAvatarUrl) {
        updateUser({ avatarUrl: newAvatarUrl });
        toast({ title: "Photo Updated", description: "Your profile photo has been successfully updated.", type: "success" });
      }
    } catch (error) {
      toast({ title: "Upload Failed", description: "Could not upload photo. Please try again.", type: "error" });
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 h-full pb-10"
    >
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 shrink-0">
        <h1 className="text-2xl font-bold font-heading text-text-primary mb-2">My Profile</h1>
        <p className="text-sm text-text-muted mb-6">Manage your personal account settings and preferences.</p>
        
        <div className="space-y-4">
          <div className="bg-surface-hover rounded-xl p-4 border border-surface-border">
            <div className="flex items-center gap-3">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="Avatar" className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-brand-indigo/10 text-brand-indigo flex items-center justify-center font-bold text-lg">
                  {user?.name?.charAt(0) || "U"}
                </div>
              )}
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-text-primary truncate">{user?.name}</p>
                <p className="text-xs text-text-muted truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-red-500 bg-red-500/10 hover:bg-red-500/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 space-y-8">
        {/* Personal Information */}
        <div className="glass-card rounded-2xl border border-surface-border bg-black/[0.02] dark:bg-background p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold font-heading text-text-primary mb-1">Personal Information</h2>
            <p className="text-sm text-text-muted">View your personal details and manage your public profile.</p>
          </div>

          <div className="space-y-6 max-w-2xl">
            {/* Avatar */}
            <div className="flex items-center gap-6 pb-6 border-b border-surface-border">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-indigo to-brand-violet flex items-center justify-center text-2xl font-bold text-white relative group cursor-pointer overflow-hidden border border-surface-border shrink-0"
              >
                {isUploading ? (
                  <Loader2 className="w-6 h-6 animate-spin text-white" />
                ) : (
                  <>
                    {user?.avatarUrl ? (
                      <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      user?.name?.charAt(0) || "U"
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                  </>
                )}
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
              <div>
                <h3 className="text-sm font-bold text-text-primary mb-1">Profile Photo</h3>
                <p className="text-xs text-text-muted mb-3">Recommended size 256x256px.</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-surface-hover border-surface-border hover:bg-surface"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? "Uploading..." : "Upload Photo"}
                </Button>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-indigo" />
                <input 
                  type="text" 
                  value={user?.name || ""}
                  readOnly
                  className="w-full h-10 bg-surface-hover/50 border border-surface-border rounded-lg pl-10 pr-3 text-sm text-text-primary font-medium focus:outline-none cursor-default"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-indigo" />
                <input 
                  type="email" 
                  value={user?.email || ""}
                  readOnly
                  className="w-full h-10 bg-surface-hover/50 border border-surface-border rounded-lg pl-10 pr-3 text-sm text-text-primary font-medium focus:outline-none cursor-default"
                />
              </div>
              <p className="text-xs text-text-muted mt-2">Your email address is set at registration and cannot be changed.</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
