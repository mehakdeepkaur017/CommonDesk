import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { CheckSquare } from 'lucide-react';

interface TaskAnalyticsProps {
  analytics: {
    byStatus: Record<string, number>;
    byPriority: Record<string, number>;
  }
}

const STATUS_COLORS: Record<string, string> = {
  todo: '#94a3b8',
  in_progress: '#3b82f6',
  review: '#f59e0b',
  completed: '#10b981',
  blocked: '#ef4444',
  cancelled: '#64748b'
};

const PRIORITY_COLORS: Record<string, string> = {
  low: '#3b82f6',
  medium: '#f59e0b',
  high: '#ef4444',
  urgent: '#7f1d1d'
};

export const TaskAnalytics = ({ analytics }: TaskAnalyticsProps) => {
  const statusData = Object.entries(analytics.byStatus).map(([name, value]) => ({ name, value })).filter(d => d.value > 0);
  const priorityData = Object.entries(analytics.byPriority).map(([name, value]) => ({ name, value })).filter(d => d.value > 0);

  const hasData = statusData.length > 0 || priorityData.length > 0;

  return (
    <div className="bg-surface border border-surface-border p-5 rounded-2xl">
      <div className="flex items-center gap-2 mb-6">
        <CheckSquare className="w-5 h-5 text-brand-indigo" />
        <h3 className="text-lg font-bold text-text-primary">Task Analytics</h3>
      </div>

      {!hasData ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-12 h-12 bg-surface-hover rounded-xl flex items-center justify-center mb-4">
            <CheckSquare className="w-5 h-5 text-text-muted" />
          </div>
          <h4 className="text-sm font-bold text-text-primary mb-1">Not Enough Data</h4>
          <p className="text-xs text-text-muted max-w-[250px]">Create and assign tasks in your workspace to unlock these charts.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-sm font-bold text-text-muted mb-4 text-center">Tasks by Status</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || '#cbd5e1'} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-text-muted mb-4 text-center">Tasks by Priority</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" opacity={0.2} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, textTransform: 'capitalize' }} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[entry.name] || '#cbd5e1'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
