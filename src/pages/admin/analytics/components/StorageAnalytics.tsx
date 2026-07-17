import React from 'react';
import { HardDrive, FileText, Image as ImageIcon, Film, Archive } from 'lucide-react';
import { formatBytes } from '../../../../utils/format';

interface StorageAnalyticsProps {
  analytics: {
    totalFiles: number;
    totalBytes: number;
    byType: Array<{ format: string, count: number, bytes: number }>;
  }
}

export const StorageAnalytics = ({ analytics }: StorageAnalyticsProps) => {
  const getIcon = (format: string) => {
    if (format.startsWith('image/')) return <ImageIcon className="w-4 h-4 text-emerald-400" />;
    if (format.startsWith('video/')) return <Film className="w-4 h-4 text-purple-400" />;
    if (format === 'application/pdf') return <FileText className="w-4 h-4 text-orange-400" />;
    if (format.includes('zip') || format.includes('tar')) return <Archive className="w-4 h-4 text-blue-400" />;
    return <FileText className="w-4 h-4 text-brand-indigo" />;
  };

  const getLabel = (format: string) => {
    if (format.startsWith('image/')) return 'Images';
    if (format.startsWith('video/')) return 'Videos';
    if (format === 'application/pdf') return 'PDF Documents';
    if (format.includes('zip')) return 'Archives';
    return 'Other Files';
  };

  return (
    <div className="bg-surface border border-surface-border rounded-2xl flex flex-col h-full overflow-hidden">
      <div className="p-5 border-b border-surface-border flex items-center justify-between">
        <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
          <HardDrive className="w-5 h-5 text-brand-indigo" />
          Storage Analytics
        </h3>
      </div>
      
      <div className="p-5 flex-1">
        <div className="flex items-end gap-3 mb-6">
          <h3 className="text-4xl font-black text-text-primary">{formatBytes(analytics.totalBytes)}</h3>
          <span className="text-sm font-bold text-text-muted mb-1.5">{analytics.totalFiles} Files</span>
        </div>

        {analytics.byType.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center h-full">
            <Archive className="w-8 h-8 text-text-muted mb-3 opacity-50" />
            <h4 className="text-sm font-bold text-text-primary mb-1">No Files Uploaded</h4>
            <p className="text-xs text-text-muted">Upload files to projects and tasks to see storage breakdowns.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {analytics.byType.sort((a, b) => b.bytes - a.bytes).map((type, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 text-sm font-medium text-text-primary">
                    {getIcon(type.format)}
                    {getLabel(type.format)}
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-bold">{formatBytes(type.bytes)}</span>
                    <span className="text-xs text-text-muted">{type.count} files</span>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-surface-hover rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-brand-indigo rounded-full" 
                    style={{ width: `${(type.bytes / analytics.totalBytes) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
