import React from "react";
import { FileBox } from "lucide-react";
import { useFiles } from "../../../hooks/queries/useFiles";

export const RecentFiles = () => {
  const { data, isLoading } = useFiles();
  const files = data?.items?.slice(0, 5) || [];

  return (
    <div className="glass-card rounded-3xl p-6 md:p-8 border border-surface-border bg-black/[0.02] dark:bg-background flex flex-col min-h-[400px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold font-heading text-text-primary">Recent Files</h2>
          <p className="text-sm text-text-muted mt-1">Latest uploads and attachments.</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center">
        {isLoading ? (
          <div className="text-sm text-text-muted">Loading files...</div>
        ) : files.length === 0 ? (
          <div className="max-w-xs mx-auto">
            <div className="w-16 h-16 bg-brand-violet/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-brand-violet/20">
              <FileBox className="w-8 h-8 text-brand-violet opacity-80" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">No files found</h3>
            <p className="text-sm text-text-muted">
              Upload files or attach documents to projects to see them here.
            </p>
          </div>
        ) : (
          <div className="w-full text-text-muted text-sm space-y-3">
             {files.map((file: any) => (
                <div key={file.id} className="group bg-surface hover:bg-surface-hover border border-surface-border rounded-xl p-3 flex items-start gap-3 transition-colors text-left cursor-pointer">
                  <div className="mt-0.5 text-brand-violet shrink-0">
                    <FileBox className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-text-primary text-sm line-clamp-1">{file.name}</p>
                    <p className="text-xs text-text-muted mt-0.5 line-clamp-1">{file.project?.name || 'No Project'}</p>
                  </div>
                </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
};
