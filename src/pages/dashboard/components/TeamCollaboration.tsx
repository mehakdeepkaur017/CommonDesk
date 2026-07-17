import React from "react";
import { Users, ChevronRight } from "lucide-react";
import { useMembers } from "../../../hooks/queries/useMembers";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../components/feedback/ToastContext";

const InitialsAvatar = ({ name, size = "w-10 h-10", className = "" }: { name?: string; size?: string; className?: string }) => {
  const initials = name ? name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() : "?";
  return (
    <div className={`${size} rounded-full bg-gradient-to-br from-brand-indigo to-brand-violet flex items-center justify-center text-text-primary font-medium ${className}`}>
      {initials}
    </div>
  );
};

export const TeamCollaboration = () => {
  const { data: members, isLoading } = useMembers();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleMessage = (e: React.MouseEvent, name: string) => {
    e.stopPropagation();
    toast({ title: "Coming Soon", description: `Messaging ${name} will be available in the next release.`, type: "info" });
  };

  return (
    <section className="p-6 rounded-2xl bg-black/[0.02] dark:bg-background border border-surface-border min-h-[300px] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" /> Team Activity
          </h3>
          <p className="text-xs text-text-muted">Who is online and working.</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 scrollbar-none space-y-4">
        {isLoading ? (
          <div className="text-sm text-text-muted text-center py-4">Loading members...</div>
        ) : members?.items?.length === 0 ? (
          <div className="text-sm text-text-muted text-center py-4">No team members yet.</div>
        ) : (
          <div className="space-y-4">
            {members?.items?.map((member, i) => (
              <motion.div 
                key={member.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => navigate(`/dashboard/members?id=${member.id}`)}
                className="flex items-center justify-between p-3 rounded-lg bg-surface hover:bg-surface-hover border border-surface-border transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold uppercase shrink-0 overflow-hidden relative">
                    {member.avatarUrl ? (
                      <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      member.name?.[0] || 'U'
                    )}
                    <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-background ${
                      member.status === "online" ? "bg-emerald-500" :
                      member.status === "busy" ? "bg-red-500" : "bg-gray-500"
                    }`} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-text-primary group-hover:text-emerald-500 transition-colors">
                      {member.name}
                    </div>
                    <div className="text-xs text-text-muted">{member.role}</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-surface-border group-hover:text-emerald-500 transition-colors" />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
