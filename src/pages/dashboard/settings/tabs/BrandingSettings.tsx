import React, { useState } from "react";
import { Upload, Image as ImageIcon } from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import { useToast } from "../../../../components/feedback/ToastContext";

export const BrandingSettings = () => {
  const [selectedColor, setSelectedColor] = useState("#4f46e5");
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast({ title: "Branding Saved", description: "Your workspace branding has been updated.", type: "success" });
    }, 800);
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold font-heading text-text-primary mb-1">Branding</h2>
        <p className="text-sm text-text-muted">Customize how your workspace looks to members.</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-medium text-text-primary">Workspace Logo</label>
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-2xl bg-surface-hover border border-surface-border flex items-center justify-center shrink-0">
              <ImageIcon className="w-8 h-8 text-surface-border" />
            </div>
            <div className="space-y-3 pt-1">
              <p className="text-xs text-text-muted">
                Recommended size: 256x256px. Max 2MB. API prepared for Cloudinary.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" size="sm" className="bg-surface-hover border-surface-border">
                  <Upload className="w-4 h-4 mr-2" /> Upload
                </Button>
                <Button variant="outline" size="sm" className="bg-transparent border-transparent text-text-muted hover:text-red-400">
                  Remove
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-text-primary">Brand Color</label>
          <div className="flex items-center gap-3">
            {["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6"].map((color) => (
              <button 
                key={color} 
                onClick={() => setSelectedColor(color)}
                className={`w-8 h-8 rounded-full border-2 transition-transform ${selectedColor === color ? "border-white scale-110 shadow-lg" : "border-transparent hover:scale-105"}`}
                style={{ backgroundColor: color }}
              />
            ))}
            <div className="w-px h-8 bg-surface mx-2" />
            <div className="h-9 px-3 rounded-lg border border-surface-border bg-surface-hover flex items-center text-sm text-text-secondary cursor-not-allowed">
              Custom Hex
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-surface-border flex justify-end">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
};
