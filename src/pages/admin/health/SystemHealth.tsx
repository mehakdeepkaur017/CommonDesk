import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Server, Database, Cloud, Activity, Radio, 
  Wifi, HardDrive, RefreshCcw, CheckCircle2
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';

// Mocking the query state for health checks
const useHealthStatus = () => {
  const [isRefetching, setIsRefetching] = useState(false);
  const refetch = () => {
    setIsRefetching(true);
    setTimeout(() => setIsRefetching(false), 1500);
  };
  return { isLoading: false, isRefetching, refetch };
};

export const SystemHealth = () => {
  const { isRefetching, refetch } = useHealthStatus();

  const services = [
    { name: 'Core Backend API', icon: Server, latency: '24ms', uptime: '99.99%', status: 'operational' },
    { name: 'Primary Database', icon: Database, latency: '12ms', uptime: '99.99%', status: 'operational' },
    { name: 'Redis Cache', icon: HardDrive, latency: '2ms', uptime: '100%', status: 'operational' },
    { name: 'WebSocket Server (Socket.io)', icon: Radio, latency: '45ms', uptime: '99.95%', status: 'operational' },
    { name: 'Background Queue (BullMQ)', icon: Activity, latency: '--', uptime: '100%', status: 'operational' },
    { name: 'Cloudinary CDN', icon: Cloud, latency: '65ms', uptime: '99.98%', status: 'operational' },
    { name: 'File Storage Service', icon: HardDrive, latency: '18ms', uptime: '99.99%', status: 'operational' },
    { name: 'Edge Routing', icon: Wifi, latency: '15ms', uptime: '100%', status: 'operational' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-text-primary mb-1">System Health</h1>
          <p className="text-sm text-text-muted">Real-time monitoring of infrastructure, databases, and third-party integrations.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={refetch} disabled={isRefetching} className="gap-2">
            <RefreshCcw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} /> Run Diagnostics
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {services.map((service, i) => (
          <div key={i} className="p-5 bg-surface border border-surface-border rounded-2xl relative overflow-hidden group hover:border-surface-border transition-colors">
            
            {isRefetching ? (
              <div className="absolute inset-0 bg-white/80 dark:bg-[#0f182b]/80 backdrop-blur-sm z-10 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-brand-indigo/20 border-t-brand-indigo rounded-full animate-spin" />
              </div>
            ) : null}

            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-surface-hover flex items-center justify-center text-text-secondary">
                <service.icon className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-3 h-3" /> Operational
              </div>
            </div>
            
            <h3 className="text-sm font-bold text-text-primary mb-3">{service.name}</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-text-muted uppercase tracking-wider mb-0.5">Latency</p>
                <p className="text-sm font-medium text-text-primary">{service.latency}</p>
              </div>
              <div>
                <p className="text-[10px] text-text-muted uppercase tracking-wider mb-0.5">Uptime</p>
                <p className="text-sm font-medium text-text-primary">{service.uptime}</p>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Resource Utilization */}
      <div className="bg-surface border border-surface-border rounded-2xl p-6 mt-6">
        <h3 className="text-lg font-bold text-text-primary mb-6">Resource Utilization</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div>
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-medium text-text-primary">CPU Usage</span>
              <span className="text-xs text-brand-indigo font-bold">24%</span>
            </div>
            <div className="w-full h-2 bg-surface-hover rounded-full overflow-hidden">
              <div className="h-full bg-brand-indigo w-[24%] rounded-full" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-medium text-text-primary">Memory (RAM)</span>
              <span className="text-xs text-purple-400 font-bold">68%</span>
            </div>
            <div className="w-full h-2 bg-surface-hover rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 w-[68%] rounded-full" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-medium text-text-primary">Active Connections</span>
              <span className="text-xs text-emerald-400 font-bold">12%</span>
            </div>
            <div className="w-full h-2 bg-surface-hover rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-[12%] rounded-full" />
            </div>
          </div>

        </div>
      </div>

    </motion.div>
  );
};
