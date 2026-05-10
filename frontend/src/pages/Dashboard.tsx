import React, { useEffect, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ListTodo,
  TrendingUp,
  Activity
} from 'lucide-react';
import api from '../api/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

interface Stats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  tasksByStatus: {
    todo: number;
    inProgress: number;
    completed: number;
  };
  recentActivity: any[];
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/tasks/stats');
        setStats(response.data);
      } catch (error) {
        toast.error('Failed to fetch dashboard stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-full">Loading...</div>;

  const chartData = [
    { name: 'To Do', value: stats?.tasksByStatus.todo || 0, color: '#94a3b8' },
    { name: 'In Progress', value: stats?.tasksByStatus.inProgress || 0, color: '#6366f1' },
    { name: 'Completed', value: stats?.tasksByStatus.completed || 0, color: '#8b5cf6' },
  ];

  const cards = [
    { label: 'Total Tasks', value: stats?.totalTasks, icon: ListTodo, color: 'text-slate-600', bg: 'bg-slate-100' },
    { label: 'Completed', value: stats?.completedTasks, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Overdue', value: stats?.overdueTasks, icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Success Rate', value: `${Math.round(((stats?.completedTasks || 0) / (stats?.totalTasks || 1)) * 100)}%`, icon: TrendingUp, color: 'text-accent-violet', bg: 'bg-violet-50' },
  ];

  return (
    <div className="space-y-10 max-w-6xl mx-auto py-4">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Overview</h1>
          <p className="text-slate-500 mt-1 font-medium">Monitoring your team's pulse and productivity.</p>
        </div>
        <div className="hidden md:block">
          <div className="flex -space-x-3">
            {[1,2,3,4].map(i => (
              <div key={i} className="w-10 h-10 rounded-full border-4 border-slate-50 bg-slate-200 flex items-center justify-center text-[10px] font-bold">
                U{i}
              </div>
            ))}
            <div className="w-10 h-10 rounded-full border-4 border-slate-50 bg-primary-600 flex items-center justify-center text-[10px] font-bold text-white">
              +12
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 border border-white/40"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{card.label}</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{card.value}</p>
              </div>
              <div className={`${card.bg} ${card.color} p-4 rounded-2xl shadow-inner`}>
                <card.icon className="w-7 h-7" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 glass-card p-8 border border-white/40"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-900">Task Performance</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary-500"></div>
                <span className="text-xs font-bold text-slate-500 uppercase">In Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-accent-violet"></div>
                <span className="text-xs font-bold text-slate-500 uppercase">Completed</span>
              </div>
            </div>
          </div>
          
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                  contentStyle={{ border: 'none', borderRadius: '20px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)' }}
                />
                <Bar dataKey="value" radius={[10, 10, 10, 10]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-8 border border-white/40"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-900">Live Feed</h3>
            <div className="p-2 bg-primary-50 text-primary-600 rounded-lg">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          
          <div className="space-y-6">
            {stats?.recentActivity.map((activity, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex gap-4 p-4 rounded-2xl hover:bg-white/40 transition-colors cursor-pointer group border border-transparent hover:border-white/20"
              >
                <div className="mt-1">
                  <div className={`w-3 h-3 rounded-full mt-1.5 ring-4 ring-white shadow-sm ${
                    activity.status === 'Completed' ? 'bg-accent-violet' : 'bg-primary-500'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 group-hover:text-primary-600 transition-colors truncate">{activity.title}</p>
                  <p className="text-xs text-slate-400 font-semibold">{activity.project.title}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="w-3 h-3 text-slate-300" />
                    <p className="text-[10px] text-slate-400 font-bold uppercase">
                      {new Date(activity.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
            {(!stats?.recentActivity || stats.recentActivity.length === 0) && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-4">
                  <Activity className="w-8 h-8" />
                </div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No recent updates</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
