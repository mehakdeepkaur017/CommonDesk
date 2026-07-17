import React from "react";
import { Link } from "react-router-dom";
import { FolderKanban, ChevronRight } from "lucide-react";
import { useProjects } from "../../../hooks/queries/useProjects";

export const MyProjects = () => {
  const { data: projectData, isLoading } = useProjects();
  const projects = projectData?.items || [];

  return (
    <section className="p-6 rounded-2xl bg-black/[0.02] dark:bg-background border border-surface-border min-h-[300px] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-brand-indigo" /> Active Projects
          </h3>
          <p className="text-xs text-text-muted">Projects currently in progress.</p>
        </div>
        <Link to="/dashboard/projects" className="text-xs text-brand-indigo hover:text-brand-indigo/80 font-medium">View All Projects</Link>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-brand-indigo border-t-transparent rounded-full animate-spin" />
        </div>
      ) : projects.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-surface-border rounded-xl bg-black/[0.01] dark:bg-background h-[200px]">
          <FolderKanban className="w-12 h-12 text-black/10 dark:text-white/10 mb-4" />
          <p className="text-sm font-medium text-text-muted">No active projects.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.slice(0, 4).map((project) => (
            <Link to={`/dashboard/projects`} key={project.id} className="flex items-center justify-between p-3 rounded-lg bg-surface hover:bg-surface-hover border border-surface-border transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-brand-indigo/10 flex items-center justify-center text-brand-indigo shrink-0 group-hover:scale-105 transition-transform">
                  <FolderKanban className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">{project.name}</p>
                  <p className="text-xs text-text-muted mt-0.5">{project.progress}% Complete</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-surface-border group-hover:text-brand-indigo transition-colors" />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};
