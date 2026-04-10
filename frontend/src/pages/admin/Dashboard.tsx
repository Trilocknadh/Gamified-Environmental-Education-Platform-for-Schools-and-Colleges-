import { useState, useEffect } from 'react';
import { 
  Users, UserCheck, ShieldCheck, TrendingUp, 
  BarChart3, Target, Zap, Clock
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar, Cell 
} from 'recharts';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/admin/stats');
      setStats(data);
    } catch (error) {
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  const kpis = [
    { label: 'Total Students', value: stats.studentCount, icon: UserCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Total Teachers', value: stats.teacherCount, icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { label: 'Quizzes Created', value: stats.quizCount, icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { label: 'Missions Active', value: stats.missionCount, icon: Target, color: 'text-rose-400', bg: 'bg-rose-500/10' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
            <BarChart3 className="text-indigo-400 w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black text-glow tracking-tighter">Command Center</h1>
        </div>
        <p className="text-slate-400">Holistic overview of EcoEdu platform health and growth</p>
      </header>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <div key={index} className="glass-card p-6 border-slate-800/50 hover:border-indigo-500/30 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">{kpi.label}</span>
              <div className={`p-2 rounded-lg ${kpi.bg}`}>
                <kpi.icon className={kpi.color} size={20} />
              </div>
            </div>
            <div className="text-4xl font-black text-slate-100 group-hover:text-glow transition-all">
              {kpi.value.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
              <TrendingUp size={12} className="text-emerald-400" />
              <span className="text-emerald-400 font-bold">+12%</span> vs last month
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Growth Chart */}
        <div className="glass-card p-8 border-slate-800/50">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-slate-100">User Acquisition</h3>
              <p className="text-sm text-slate-400">Daily registrations over the last 7 days</p>
            </div>
            <Clock className="text-slate-600" size={20} />
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.userGrowth.length > 0 ? stats.userGrowth : [{_id: 'No Data', count: 0}]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis 
                  dataKey="_id" 
                  stroke="#64748b" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => val.split('-').slice(1).join('/')}
                />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderRadius: '12px', 
                    border: '1px solid #1e293b',
                    color: '#f1f5f9'
                  }} 
                  itemStyle={{ color: '#818cf8' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#6366f1" 
                  strokeWidth={4} 
                  dot={{ r: 6, fill: '#6366f1', strokeWidth: 2, stroke: '#0f172a' }}
                  activeDot={{ r: 8, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Platform Engagement */}
        <div className="glass-card p-8 border-slate-800/50">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-slate-100">Activity Distribution</h3>
              <p className="text-sm text-slate-400">Comparison of core modules</p>
            </div>
            <ShieldCheck className="text-slate-600" size={20} />
          </div>

          <div className="h-[300px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={[
                 { name: 'Quizzes', count: stats.quizCount },
                 { name: 'Missions', count: stats.missionCount },
                 { name: 'Students', count: stats.studentCount },
                 { name: 'Teachers', count: stats.teacherCount }
               ]}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                 <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                 <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                 <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderRadius: '12px', 
                    border: '1px solid #1e293b'
                  }} 
                />
                 <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {[
                      { fill: '#818cf8' },
                      { fill: '#34d399' },
                      { fill: '#f87171' },
                      { fill: '#fbbf24' }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
