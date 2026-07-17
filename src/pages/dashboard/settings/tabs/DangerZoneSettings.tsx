import React, { useState } from "react";
import { AlertOctagon, X, Trash2 } from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../../../components/feedback/ToastContext";

export const DangerZoneSettings = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const { toast } = useToast();

  const handleArchive = () => {
    toast({ title: "Workspace Archived", description: "This workspace is now read-only.", type: "success" });
  };

  const handleTransfer = () => {
    toast({ title: "Transfer Initiated", description: "An email has been sent to the new owner.", type: "success" });
  };

  const handleDelete = () => {
    if (confirmText.toLowerCase() === "delete") {
      setIsDeleteModalOpen(false);
      toast({ title: "Workspace Deleted", description: "Your workspace and all data have been queued for deletion.", type: "success" });
      setConfirmText("");
    }
  };

  return (
    <div className="space-y-8 max-w-2xl relative">
      <div>
        <h2 className="text-xl font-bold text-red-400 mb-1 flex items-center gap-2">
          <AlertOctagon className="w-5 h-5" /> Danger Zone
        </h2>
        <p className="text-sm text-red-400/70">Destructive actions that cannot be easily undone.</p>
      </div>

      <div className="space-y-4">
        
        <div className="flex items-center justify-between p-5 rounded-xl border border-red-500/20 bg-red-500/5">
          <div>
            <h3 className="text-sm font-bold text-text-primary mb-1">Archive Workspace</h3>
            <p className="text-xs text-text-muted max-w-sm">
              Make this workspace read-only. Members will not be able to create or edit content.
            </p>
          </div>
          <Button onClick={handleArchive} variant="outline" size="sm" className="bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20">
            Archive
          </Button>
        </div>

        <div className="flex items-center justify-between p-5 rounded-xl border border-red-500/20 bg-red-500/5">
          <div>
            <h3 className="text-sm font-bold text-text-primary mb-1">Transfer Ownership</h3>
            <p className="text-xs text-text-muted max-w-sm">
              Transfer administrative control of this workspace to another member.
            </p>
          </div>
          <Button onClick={handleTransfer} variant="outline" size="sm" className="bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20">
            Transfer
          </Button>
        </div>

        <div className="flex items-center justify-between p-5 rounded-xl border border-red-500/30 bg-red-500/10">
          <div>
            <h3 className="text-sm font-bold text-red-400 mb-1">Delete Workspace</h3>
            <p className="text-xs text-red-400/70 max-w-sm">
              Permanently delete this workspace and all of its data. This action is irreversible.
            </p>
          </div>
          <Button onClick={() => setIsDeleteModalOpen(true)} size="sm" className="bg-red-600 hover:bg-red-700 text-text-primary border-none">
            Delete
          </Button>
        </div>

      </div>

      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute inset-0 bg-brand-navy/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-surface border border-red-500/20 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
                    <AlertOctagon className="w-5 h-5 text-red-500" />
                    Delete Workspace
                  </h3>
                  <button onClick={() => setIsDeleteModalOpen(false)} className="text-text-muted hover:text-text-primary transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <p className="text-sm text-text-secondary mb-6">
                  This action is permanent and cannot be undone. All projects, tasks, files, and member data will be deleted.
                </p>

                <div className="mb-6">
                  <label className="block text-xs font-medium text-text-secondary mb-2">
                    Type <strong className="text-red-400">delete</strong> to confirm
                  </label>
                  <input 
                    type="text" 
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    className="w-full h-10 bg-surface-hover border border-surface-border rounded-lg px-3 text-sm text-text-primary focus:outline-none focus:border-red-500/50 transition-colors"
                  />
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 border-surface-border" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                  <Button 
                    className="flex-1 bg-red-600 hover:bg-red-700 text-text-primary border-none"
                    disabled={confirmText.toLowerCase() !== "delete"}
                    onClick={handleDelete}
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Delete Data
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
