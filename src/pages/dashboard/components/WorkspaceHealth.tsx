import React from "react";
import { ShieldCheck, Server } from "lucide-react";
import { useWorkspace } from "../../../hooks/queries/useWorkspace";

export const WorkspaceHealth = () => {
  const { data: workspace, isLoading } = useWorkspace();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-semibold text-emerald-400">Workspace Systems Online</h3>
          <p className="text-sm text-emerald-400/60">All services are operating normally.</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4 text-sm font-medium">
        <div className="flex items-center gap-2 text-text-secondary">
          <Server className="w-4 h-4" /> Storage:
          <span className="text-text-primary">
            {isLoading ? "..." : `${workspace?.storageUsedGB}GB`}
          </span>
        </div>
      </div>
    </div>
  );
};
