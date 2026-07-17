import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Trash2, ExternalLink, Image as ImageIcon, FileText, Video, Music, Eye, Download, Archive, RefreshCw, FolderKanban, CheckSquare } from "lucide-react";
import { useFiles, useDeleteFile, useUpdateFile } from "../../hooks/queries/useFiles";
import { Button } from "../ui/Button";
import { useToast } from "../feedback/ToastContext";
import { FileUploadDrawer } from "../files/FileUploadDrawer";
import { FilePreviewDrawer } from "../files/FilePreviewDrawer";
import { formatBytes } from "../../utils/format";

interface Props {
  projectId: string;
}

export const ProjectFilesTab = ({ projectId }: Props) => {
  const { data: filesData, isLoading } = useFiles({ projectId });
  const files = filesData?.items || [];
  
  const deleteMutation = useDeleteFile();
  const updateMutation = useUpdateFile();
  const { toast } = useToast();
  
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<any>(null);

  const getFileIcon = (format: string) => {
    if (!format) return <FileText className="w-8 h-8 text-brand-indigo" />;
    if (format.startsWith("image/")) return <ImageIcon className="w-8 h-8 text-blue-500" />;
    if (format.startsWith("video/")) return <Video className="w-8 h-8 text-purple-500" />;
    if (format.startsWith("audio/")) return <Music className="w-8 h-8 text-amber-500" />;
    return <FileText className="w-8 h-8 text-brand-indigo" />;
  };

  const handleDelete = async (id: string, hard: boolean = false) => {
    if (confirm(`Are you sure you want to ${hard ? 'permanently delete' : 'archive'} this file?`)) {
      try {
        await deleteMutation.mutateAsync({ id, hard });
        toast({ title: 'Success', description: `File ${hard ? 'deleted' : 'archived'}`, type: 'success' });
      } catch (e) {
        toast({ title: 'Error', description: 'Action failed', type: 'error' });
      }
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await updateMutation.mutateAsync({ id, data: { archived: false } });
      toast({ title: 'Success', description: 'File restored', type: 'success' });
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to restore', type: 'error' });
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex-1 bg-surface border border-surface-border rounded-2xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-surface-border bg-black/[0.02] dark:bg-background flex items-center justify-between">
          <h3 className="font-bold text-text-primary">Project Files & Attachments ({files.length})</h3>
          <Button onClick={() => setIsUploadOpen(true)} className="gap-2" size="sm">
            <Upload className="w-4 h-4" /> Upload Asset
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-surface-border">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="w-6 h-6 border-2 border-brand-indigo/20 border-t-brand-indigo rounded-full animate-spin" />
            </div>
          ) : files.length === 0 ? (
            <div className="text-center p-12 text-text-muted">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No files uploaded yet.</p>
              <Button onClick={() => setIsUploadOpen(true)} className="mt-4" variant="outline">Upload First File</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <AnimatePresence>
                {files.map((file: any) => (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={file.id}
                    className={`bg-background border border-surface-border rounded-xl p-4 transition-colors group relative overflow-hidden ${file.archived ? 'opacity-50' : 'hover:border-brand-indigo/30'}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2 rounded-lg bg-surface-hover relative">
                        {getFileIcon(file.format)}
                        {file.taskId && (
                          <div className="absolute -bottom-1 -right-1 bg-surface rounded-full p-0.5" title="Task Attachment">
                            <CheckSquare className="w-3 h-3 text-purple-500" />
                          </div>
                        )}
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => setPreviewFile(file)}
                          className="p-1.5 rounded-md text-text-muted hover:text-brand-indigo hover:bg-brand-indigo/10 transition-colors"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(file.id, true)}
                          className="p-1.5 rounded-md text-text-muted hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <h4 className="text-sm font-bold text-text-primary truncate mb-1" title={file.originalName || file.filename}>
                      {file.originalName || file.filename}
                    </h4>
                    
                    <div className="flex items-center justify-between text-xs text-text-muted">
                      <span>{formatBytes(file.sizeBytes)} (v{file.version})</span>
                      <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    {file.uploader && (
                      <div className="mt-3 pt-3 border-t border-surface-border/50 flex items-center gap-2">
                         <div className="w-5 h-5 rounded-full bg-brand-indigo/20 flex items-center justify-center text-[8px] font-bold text-brand-indigo">
                           {file.uploader.name.charAt(0)}
                         </div>
                         <span className="text-xs text-text-muted truncate">{file.uploader.name}</span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      <FileUploadDrawer 
        isOpen={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)} 
        defaultLocation="project"
        defaultProjectId={projectId}
      />
      
      <FilePreviewDrawer 
        isOpen={!!previewFile} 
        file={previewFile} 
        onClose={() => setPreviewFile(null)} 
      />
    </div>
  );
};
