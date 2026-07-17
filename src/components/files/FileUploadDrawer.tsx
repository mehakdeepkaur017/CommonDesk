import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UploadCloud, FolderKanban, CheckSquare, File as FileIcon, Globe, Lock, Trash2, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { useUploadFile } from '../../hooks/queries/useFiles';
import { useProjects } from '../../hooks/queries/useProjects';
import { useTasks } from '../../hooks/queries/useTasks';
import { useToast } from '../feedback/ToastContext';

export const FileUploadDrawer = ({ 
  isOpen, 
  onClose,
  defaultLocation = 'workspace',
  defaultProjectId = '',
  defaultTaskId = ''
}: { 
  isOpen: boolean; 
  onClose: () => void;
  defaultLocation?: 'workspace' | 'project' | 'task';
  defaultProjectId?: string;
  defaultTaskId?: string;
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [location, setLocation] = useState<'workspace' | 'project' | 'task'>(defaultLocation);
  const [projectId, setProjectId] = useState<string>(defaultProjectId);
  const [taskId, setTaskId] = useState<string>(defaultTaskId);
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('workspace');
  
  const [files, setFiles] = useState<File[]>([]);
  
  const uploadMutation = useUploadFile();
  const { toast } = useToast();
  const { data: projectsData } = useProjects();
  const { data: tasksData } = useTasks({ limit: 1000 });
  const projects = projectsData?.items || [];
  const tasks = tasksData?.items || [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files as FileList)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    
    if (location === 'project' && !projectId) {
      toast({ title: 'Error', description: 'Please select a project', type: 'error' });
      return;
    }
    if (location === 'task' && !taskId) {
      toast({ title: 'Error', description: 'Please select a task', type: 'error' });
      return;
    }

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        if (location === 'project') formData.append('projectId', projectId);
        if (location === 'task') {
          formData.append('taskId', taskId);
          const taskObj = tasks.find((t: any) => t.id === taskId);
          if (taskObj?.projectId) formData.append('projectId', taskObj.projectId);
        }
        if (location === 'workspace') {
          formData.append('description', description);
          formData.append('visibility', visibility);
        }
        await uploadMutation.mutateAsync(formData);
      }
      toast({ title: 'Success', description: `${files.length} files uploaded successfully`, type: 'success' });
      reset();
      onClose();
    } catch (e: any) {
      toast({ title: 'Upload Failed', description: e.response?.data?.message || 'Something went wrong', type: 'error' });
    }
  };

  const reset = () => {
    setStep(1);
    setFiles([]);
    setProjectId(defaultProjectId);
    setTaskId(defaultTaskId);
    setDescription('');
    setLocation(defaultLocation);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: '100%', opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-surface border-l border-surface-border shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-surface-border">
              <div>
                <h2 className="text-xl font-bold font-heading text-text-primary">Upload Assets</h2>
                <p className="text-sm text-text-muted">Step {step} of 2</p>
              </div>
              <button onClick={handleClose} className="p-2 hover:bg-surface-hover rounded-lg transition-colors text-text-muted">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {step === 1 ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-text-primary mb-3">Upload Destination</label>
                    <div className="grid grid-cols-1 gap-3">
                      <button onClick={() => setLocation('workspace')} className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-colors ${location === 'workspace' ? 'border-brand-indigo bg-brand-indigo/5' : 'border-surface-border hover:bg-surface-hover'}`}>
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${location === 'workspace' ? 'bg-brand-indigo text-white' : 'bg-surface-hover text-text-muted'}`}>
                          <Globe className="w-5 h-5" />
                        </div>
                        <div>
                          <p className={`font-bold ${location === 'workspace' ? 'text-brand-indigo' : 'text-text-primary'}`}>Workspace Document</p>
                          <p className="text-xs text-text-muted mt-0.5">Visible to the entire organization</p>
                        </div>
                      </button>
                      
                      <button onClick={() => setLocation('project')} className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-colors ${location === 'project' ? 'border-brand-indigo bg-brand-indigo/5' : 'border-surface-border hover:bg-surface-hover'}`}>
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${location === 'project' ? 'bg-brand-indigo text-white' : 'bg-surface-hover text-text-muted'}`}>
                          <FolderKanban className="w-5 h-5" />
                        </div>
                        <div>
                          <p className={`font-bold ${location === 'project' ? 'text-brand-indigo' : 'text-text-primary'}`}>Project Asset</p>
                          <p className="text-xs text-text-muted mt-0.5">Visible only to project members</p>
                        </div>
                      </button>

                      <button onClick={() => setLocation('task')} className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-colors ${location === 'task' ? 'border-brand-indigo bg-brand-indigo/5' : 'border-surface-border hover:bg-surface-hover'}`}>
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${location === 'task' ? 'bg-brand-indigo text-white' : 'bg-surface-hover text-text-muted'}`}>
                          <CheckSquare className="w-5 h-5" />
                        </div>
                        <div>
                          <p className={`font-bold ${location === 'task' ? 'text-brand-indigo' : 'text-text-primary'}`}>Task Attachment</p>
                          <p className="text-xs text-text-muted mt-0.5">Attach specific files directly to a task</p>
                        </div>
                      </button>
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {location === 'workspace' && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-text-primary mb-1.5">Description (Optional)</label>
                          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 bg-transparent border border-surface-border rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-brand-indigo" placeholder="e.g. Employee Handbook Q3" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-text-primary mb-1.5">Visibility</label>
                          <select value={visibility} onChange={(e) => setVisibility(e.target.value)} className="w-full px-3 py-2 bg-surface-hover border border-surface-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-brand-indigo">
                            <option value="workspace">Entire Workspace</option>
                            <option value="admins">Admins Only</option>
                          </select>
                        </div>
                      </motion.div>
                    )}
                    
                    {location === 'project' && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-text-primary mb-1.5">Select Project</label>
                          <select value={projectId} onChange={(e) => setProjectId(e.target.value)} className="w-full px-3 py-2 bg-surface-hover border border-surface-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-brand-indigo">
                            <option value="">Choose a project...</option>
                            {projects.map((p: any) => (
                              <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                          </select>
                        </div>
                      </motion.div>
                    )}

                    {location === 'task' && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-text-primary mb-1.5">Select Task</label>
                          <select value={taskId} onChange={(e) => setTaskId(e.target.value)} className="w-full px-3 py-2 bg-surface-hover border border-surface-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-brand-indigo">
                            <option value="">Choose a task...</option>
                            {tasks.map((t: any) => (
                              <option key={t.id} value={t.id}>{t.project?.name ? `[${t.project.name}] ` : ''}{t.title}</option>
                            ))}
                          </select>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              ) : (
                <div className="space-y-6">
                  <div className="relative border-2 border-dashed border-surface-border hover:border-brand-indigo transition-colors rounded-2xl p-8 flex flex-col items-center justify-center text-center group cursor-pointer bg-surface-hover/30">
                    <input type="file" multiple onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <div className="w-14 h-14 bg-brand-indigo/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-6 h-6 text-brand-indigo" />
                    </div>
                    <p className="font-bold text-text-primary mb-1">Click or drag files here</p>
                    <p className="text-sm text-text-muted">Support for images, PDFs, and documents up to 50MB</p>
                  </div>

                  {files.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-text-primary">Selected Files ({files.length})</h4>
                      <div className="space-y-2">
                        {files.map((file, i) => (
                          <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-surface-border bg-surface-hover">
                            <div className="flex items-center gap-3 overflow-hidden">
                              <FileIcon className="w-4 h-4 text-text-muted shrink-0" />
                              <span className="text-sm text-text-primary truncate">{file.name}</span>
                            </div>
                            <button onClick={() => removeFile(i)} className="text-text-muted hover:text-red-400 p-1">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-surface-border bg-surface flex items-center justify-between">
              {step === 2 ? (
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              ) : (
                <div />
              )}
              
              {step === 1 ? (
                <Button onClick={() => setStep(2)}>Continue</Button>
              ) : (
                <Button onClick={handleUpload} isLoading={uploadMutation.isPending} disabled={files.length === 0} className="gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Upload Files
                </Button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
