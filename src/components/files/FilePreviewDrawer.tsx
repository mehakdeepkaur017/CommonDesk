import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Clock, History, File as FileIcon, UploadCloud } from 'lucide-react';
import { Button } from '../ui/Button';
import { useFileVersions, useUploadNewVersion } from '../../hooks/queries/useFiles';
import { useToast } from '../feedback/ToastContext';
import { formatBytes } from '../../utils/format';
import { forceDownload } from '../../utils/download';

export const FilePreviewDrawer = ({ file, isOpen, onClose }: { file: any; isOpen: boolean; onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'history'>('preview');
  const { data: versionsData, isLoading: versionsLoading } = useFileVersions(file?.id);
  const versions = versionsData?.versions || [];
  
  const uploadVersionMutation = useUploadNewVersion();
  const { toast } = useToast();

  const handleNewVersion = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && file) {
      try {
        const formData = new FormData();
        formData.append('file', e.target.files[0]);
        await uploadVersionMutation.mutateAsync({ id: file.id, formData });
        toast({ title: 'Success', description: 'New version uploaded', type: 'success' });
      } catch (error: any) {
        toast({ title: 'Error', description: error.response?.data?.message || 'Failed to upload version', type: 'error' });
      }
    }
  };

  const renderPreview = () => {
    if (!file) return null;
    const url = file.secureUrl;
    
    if (file.format.startsWith('image/')) {
      return <img src={url} alt={file.filename} className="w-full h-auto rounded-lg object-contain max-h-[60vh]" />;
    }
    if (file.format === 'application/pdf') {
      const googleViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;
      return (
        <div className="space-y-3">
          <iframe src={googleViewerUrl} className="w-full h-[60vh] rounded-lg border border-surface-border" title="PDF Preview" />
          <button 
            onClick={() => window.open(url, '_blank')}
            className="text-xs text-brand-indigo hover:underline"
          >
            Open PDF in new tab ↗
          </button>
        </div>
      );
    }
    
    return (
      <div className="flex flex-col items-center justify-center h-[40vh] bg-surface-hover rounded-xl border border-surface-border">
        <FileIcon className="w-16 h-16 text-text-muted mb-4" />
        <p className="text-text-primary font-bold mb-2">No preview available</p>
        <p className="text-sm text-text-muted mb-6">{file.format}</p>
        <Button onClick={() => forceDownload(file.secureUrl, file.originalName || file.filename)} className="gap-2">
          <Download className="w-4 h-4" /> Download File
        </Button>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && file && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: '100%', opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-2xl bg-surface border-l border-surface-border shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-surface-border">
              <div className="overflow-hidden pr-4">
                <h2 className="text-xl font-bold font-heading text-text-primary truncate">{file.originalName || file.filename}</h2>
                <p className="text-sm text-text-muted flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 bg-surface-hover rounded text-xs">v{file.version}</span>
                  {formatBytes(file.sizeBytes)} • Uploaded {new Date(file.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-surface-hover rounded-lg transition-colors text-text-muted shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex border-b border-surface-border px-6">
              <button 
                onClick={() => setActiveTab('preview')} 
                className={`py-3 px-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'preview' ? 'border-brand-indigo text-brand-indigo' : 'border-transparent text-text-muted hover:text-text-primary'}`}
              >
                Preview
              </button>
              <button 
                onClick={() => setActiveTab('history')} 
                className={`py-3 px-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'history' ? 'border-brand-indigo text-brand-indigo' : 'border-transparent text-text-muted hover:text-text-primary'}`}
              >
                <History className="w-4 h-4" /> Version History
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'preview' ? (
                <div className="space-y-6">
                  {renderPreview()}
                  
                  {file.description && (
                    <div className="bg-surface-hover p-4 rounded-xl border border-surface-border">
                      <h4 className="text-sm font-bold text-text-primary mb-2">Description</h4>
                      <p className="text-sm text-text-muted">{file.description}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between bg-brand-indigo/5 border border-brand-indigo/20 p-4 rounded-xl">
                    <div>
                      <h4 className="font-bold text-text-primary">Upload New Version</h4>
                      <p className="text-xs text-text-muted">Replace this file with an updated version.</p>
                    </div>
                    <label className="cursor-pointer bg-brand-indigo text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-brand-indigo/90 transition-colors">
                      <UploadCloud className="w-4 h-4" />
                      Upload
                      <input type="file" className="hidden" onChange={handleNewVersion} disabled={uploadVersionMutation.isPending} />
                    </label>
                  </div>

                  <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-surface-border before:to-transparent">
                    {/* Current Version */}
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-surface bg-brand-indigo text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                        <span className="text-xs font-bold">v{file.version}</span>
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-brand-indigo bg-brand-indigo/5 shadow">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-text-primary text-sm">Current Version</span>
                          <span className="text-xs text-brand-indigo font-bold">Active</span>
                        </div>
                        <p className="text-xs text-text-muted">{new Date(file.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                    
                    {/* Older Versions */}
                    {versions.map((v: any) => (
                      <div key={v.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-surface bg-surface-hover text-text-muted shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                          <span className="text-xs font-bold">v{v.version}</span>
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-surface-border bg-surface shadow">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-text-primary text-sm">Uploaded by {v.uploader?.name || 'Unknown'}</span>
                          </div>
                          <p className="text-xs text-text-muted mb-3">{new Date(v.createdAt).toLocaleString()}</p>
                          <Button variant="outline" size="sm" onClick={() => forceDownload(v.secureUrl, v.originalName || v.filename)}>
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-surface-border bg-surface flex justify-end">
              <Button onClick={() => forceDownload(file.secureUrl, file.originalName || file.filename)} className="gap-2">
                <Download className="w-4 h-4" /> Download Current Version
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
