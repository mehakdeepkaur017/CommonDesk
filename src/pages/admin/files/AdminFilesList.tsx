import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, FileBox, Upload,
  Trash2, Archive, Download, Eye, FileText, Image, Film, File,
  Database, RefreshCw, FolderKanban, CheckSquare, Globe, ChevronRight
} from 'lucide-react';
import { useFiles, useStorageStats, useDeleteFile, useUpdateFile } from '../../../hooks/queries/useFiles';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../components/feedback/ToastContext';
import { FileUploadDrawer } from '../../../components/files/FileUploadDrawer';
import { FilePreviewDrawer } from '../../../components/files/FilePreviewDrawer';
import { formatBytes } from '../../../utils/format';
import { forceDownload } from '../../../utils/download';

export const AdminFilesList = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'workspace' | 'project' | 'task' | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<any>(null);
  
  const { data: statsData } = useStorageStats();
  
  // Only fetch files if a category is selected
  const { data: filesData, isLoading } = useFiles(
    { search, location: selectedCategory || '' }, 
    { enabled: !!selectedCategory }
  );
  
  const deleteMutation = useDeleteFile();
  const updateMutation = useUpdateFile();
  const { toast } = useToast();

  const stats = statsData?.stats || { totalFiles: 0, totalBytes: 0, workspaceDocs: 0, projectAssets: 0, taskAttachments: 0 };
  const files = selectedCategory ? (filesData?.items || []) : [];

  const getFileIcon = (format: string) => {
    if (!format) return <File className="w-5 h-5 text-brand-indigo" />;
    if (format.startsWith('image/')) return <Image className="w-5 h-5 text-emerald-400" />;
    if (format.startsWith('video/')) return <Film className="w-5 h-5 text-purple-400" />;
    if (format === 'application/pdf') return <FileText className="w-5 h-5 text-orange-400" />;
    return <File className="w-5 h-5 text-brand-indigo" />;
  };

  const handleDownload = (secureUrl: string, filename: string) => {
    forceDownload(secureUrl, filename);
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-text-primary mb-1">Workspace Asset Center</h1>
          <p className="text-sm text-text-muted">Manage global documents, project assets, and task attachments.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="gap-2" onClick={() => setIsUploadOpen(true)}>
            <Upload className="w-4 h-4" /> Upload Asset
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between bg-brand-indigo/10 text-brand-indigo px-4 py-3 rounded-xl border border-brand-indigo/20">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          <span className="font-bold">Total Storage Used:</span>
          <span>{formatBytes(stats.totalBytes)} ({stats.totalFiles} files)</span>
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button 
          onClick={() => setSelectedCategory(selectedCategory === 'workspace' ? null : 'workspace')}
          className={`text-left border p-5 rounded-2xl flex flex-col justify-between transition-all ${
            selectedCategory === 'workspace' ? 'border-brand-indigo bg-brand-indigo/5 ring-1 ring-brand-indigo' : 'border-surface-border bg-surface hover:bg-surface-hover'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedCategory === 'workspace' ? 'bg-brand-indigo text-white' : 'bg-emerald-500/10 text-emerald-500'}`}>
              <Globe className="w-6 h-6" />
            </div>
            {selectedCategory === 'workspace' && <ChevronRight className="w-5 h-5 text-brand-indigo" />}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-text-primary">{stats.workspaceDocs}</h3>
            <p className="text-sm text-text-muted mt-1 font-medium">Workspace Documents</p>
          </div>
        </button>

        <button 
          onClick={() => setSelectedCategory(selectedCategory === 'project' ? null : 'project')}
          className={`text-left border p-5 rounded-2xl flex flex-col justify-between transition-all ${
            selectedCategory === 'project' ? 'border-brand-indigo bg-brand-indigo/5 ring-1 ring-brand-indigo' : 'border-surface-border bg-surface hover:bg-surface-hover'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedCategory === 'project' ? 'bg-brand-indigo text-white' : 'bg-blue-500/10 text-blue-500'}`}>
              <FolderKanban className="w-6 h-6" />
            </div>
            {selectedCategory === 'project' && <ChevronRight className="w-5 h-5 text-brand-indigo" />}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-text-primary">{stats.projectAssets}</h3>
            <p className="text-sm text-text-muted mt-1 font-medium">Project Assets</p>
          </div>
        </button>

        <button 
          onClick={() => setSelectedCategory(selectedCategory === 'task' ? null : 'task')}
          className={`text-left border p-5 rounded-2xl flex flex-col justify-between transition-all ${
            selectedCategory === 'task' ? 'border-brand-indigo bg-brand-indigo/5 ring-1 ring-brand-indigo' : 'border-surface-border bg-surface hover:bg-surface-hover'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedCategory === 'task' ? 'bg-brand-indigo text-white' : 'bg-purple-500/10 text-purple-500'}`}>
              <CheckSquare className="w-6 h-6" />
            </div>
            {selectedCategory === 'task' && <ChevronRight className="w-5 h-5 text-brand-indigo" />}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-text-primary">{stats.taskAttachments}</h3>
            <p className="text-sm text-text-muted mt-1 font-medium">Task Attachments</p>
          </div>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {selectedCategory ? (
          <motion.div 
            key="table"
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                {selectedCategory === 'workspace' && <Globe className="w-5 h-5 text-emerald-500"/>}
                {selectedCategory === 'project' && <FolderKanban className="w-5 h-5 text-blue-500"/>}
                {selectedCategory === 'task' && <CheckSquare className="w-5 h-5 text-purple-500"/>}
                {selectedCategory === 'workspace' ? 'Workspace Documents' : selectedCategory === 'project' ? 'Project Assets' : 'Task Attachments'}
              </h2>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input 
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search files..."
                  className="w-full h-10 bg-surface border border-surface-border rounded-lg pl-10 pr-4 text-sm text-text-primary focus:outline-none focus:border-brand-indigo transition-colors"
                />
              </div>
            </div>

            <div className="bg-surface border border-surface-border rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead>
                    <tr className="border-b border-surface-border bg-black/[0.02] dark:bg-background">
                      <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider w-[35%]">File Name</th>
                      <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Context</th>
                      <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Size</th>
                      <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Uploaded By</th>
                      <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    
                    {isLoading && (
                      [1, 2, 3].map(i => (
                        <tr key={i}>
                          <td className="px-6 py-4"><div className="h-6 w-3/4 bg-surface-hover rounded animate-pulse" /></td>
                          <td className="px-6 py-4"><div className="h-6 w-24 bg-surface-hover rounded animate-pulse" /></td>
                          <td className="px-6 py-4"><div className="h-6 w-16 bg-surface-hover rounded animate-pulse" /></td>
                          <td className="px-6 py-4"><div className="h-6 w-24 bg-surface-hover rounded animate-pulse" /></td>
                          <td className="px-6 py-4"><div className="h-6 w-24 bg-surface-hover rounded animate-pulse" /></td>
                          <td className="px-6 py-4 text-right"><div className="h-8 w-8 bg-surface-hover rounded animate-pulse inline-block" /></td>
                        </tr>
                      ))
                    )}

                    {!isLoading && files.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center">
                          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-surface-hover mb-4">
                            <FileBox className="w-5 h-5 text-text-muted" />
                          </div>
                          <h3 className="text-sm font-bold text-text-primary mb-1">No files found</h3>
                          <p className="text-xs text-text-muted">Upload a new asset or adjust your filters.</p>
                        </td>
                      </tr>
                    )}

                    {!isLoading && files.map((file: any) => (
                      <tr key={file.id} className={`hover:bg-black/[0.02] dark:bg-background transition-colors group ${file.archived ? 'opacity-50' : ''}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-surface-hover flex items-center justify-center shrink-0">
                              {getFileIcon(file.format)}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-text-primary line-clamp-1">{file.originalName || file.filename}</p>
                              <p className="text-xs text-text-muted flex gap-2 mt-0.5">
                                <span className="bg-surface-hover px-1.5 rounded">v{file.version}</span>
                                {file.archived && <span className="text-orange-400">Archived</span>}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {!file.projectId && !file.taskId ? (
                            <span className="flex items-center gap-1.5 text-xs font-medium text-text-muted">Organization Wide</span>
                          ) : file.taskId ? (
                            <div>
                              <p className="text-xs text-text-primary truncate max-w-[150px]">{file.task?.title}</p>
                              <p className="text-[10px] text-text-muted mt-0.5 truncate max-w-[150px]">{file.project?.name}</p>
                            </div>
                          ) : (
                            <div>
                              <p className="text-xs text-text-primary truncate max-w-[150px]">{file.project?.name}</p>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs text-text-primary font-medium">{formatBytes(file.sizeBytes)}</span>
                        </td>
                        <td className="px-6 py-4 flex items-center gap-2">
                          {file.uploader?.avatarUrl ? (
                            <img src={file.uploader.avatarUrl} className="w-6 h-6 rounded-full" />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-brand-indigo flex items-center justify-center text-white text-[10px] font-bold">
                              {file.uploader?.name?.[0]}
                            </div>
                          )}
                          <span className="text-xs text-text-secondary truncate max-w-[100px]">{file.uploader?.name}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs text-text-secondary">
                            {new Date(file.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => setPreviewFile(file)} className="p-2 rounded-lg text-text-muted hover:text-brand-indigo hover:bg-brand-indigo/10" title="Preview & History">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDownload(file.secureUrl, file.originalName || file.filename)} className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface" title="Download">
                              <Download className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(file.id, true)} className="p-2 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10" title="Delete">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="empty"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center p-16 text-center border-2 border-dashed border-surface-border rounded-2xl bg-surface/30"
          >
            <div className="w-16 h-16 bg-brand-indigo/10 text-brand-indigo rounded-full flex items-center justify-center mb-4">
              <FileBox className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">Select a Category</h3>
            <p className="text-sm text-text-muted max-w-md">
              Choose one of the categories above to view its associated files, or upload a new asset directly.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <FileUploadDrawer isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} defaultLocation={selectedCategory || 'workspace'} />
      <FilePreviewDrawer isOpen={!!previewFile} file={previewFile} onClose={() => setPreviewFile(null)} />
    </motion.div>
  );
};
