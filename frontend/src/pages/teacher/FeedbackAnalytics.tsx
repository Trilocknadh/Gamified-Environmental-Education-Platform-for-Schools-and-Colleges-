import { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  Radar, RadarChart, PolarGrid, PolarAngleAxis
} from 'recharts';
import { Award, Target, Zap, Users, Star, TrendingUp } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const FeedbackAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data } = await api.get('/teachers/analytics');
      setData(data);
    } catch (error) {
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444'];

  if (loading) return (
    <div className="p-8 space-y-6 pt-24 animate-pulse">
       <div className="h-10 bg-slate-800 w-48 rounded-xl" />
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-32 bg-slate-800/50 rounded-3xl" />)}
       </div>
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[1,2].map(i => <div key={i} className="h-96 bg-slate-800/50 rounded-3xl" />)}
       </div>
    </div>
  );

  return (
    <div className="space-y-10 p-4 pt-24 pb-20 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter italic">Growth <span className="text-blue-500">Analytics</span></h2>
          <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.3em] mt-2">Quantitative class performance overview</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-2xl border border-white/[0.05]">
          <TrendingUp size={14} className="text-emerald-500" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Real-time Data Active</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 flex items-center gap-5"
        >
          <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 border border-blue-500/20">
            <Users size={24} />
          </div>
          <div>
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Avg Class Level</p>
             <h4 className="text-2xl font-black text-white italic">{data?.summary?.avgLevel || '4.2'}</h4>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 flex items-center gap-5"
        >
          <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 border border-emerald-500/20">
            <Zap size={24} fill="currentColor" />
          </div>
          <div>
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Class XP</p>
             <h4 className="text-2xl font-black text-white italic">{data?.summary?.totalXP?.toLocaleString() || '12,450'}</h4>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 flex items-center gap-5"
        >
          <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 border border-amber-500/20">
            <Star size={24} fill="currentColor" />
          </div>
          <div>
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Top Performer</p>
             <h4 className="text-lg font-black text-white italic truncate max-w-[150px]">{data?.summary?.topPerformer || 'N/A'}</h4>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Subject Mastery - Premium Area Chart */}
        <div className="glass-card p-8 bg-slate-900/40">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-lg font-bold text-white leading-none">Subject Mastery</h3>
              <p className="text-xs text-slate-500 mt-2">Class proficiency levels (%)</p>
            </div>
            <Target size={20} className="text-blue-500" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.subjectPerformance || []}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#475569" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="#475569" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false}
                  dx={-10}
                  domain={[0, 100]}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderRadius: '16px', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    padding: '12px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorScore)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Topic Engagement - Donut Chart */}
        <div className="glass-card p-8 bg-slate-900/40">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-lg font-bold text-white leading-none">Topic Engagement</h3>
              <p className="text-xs text-slate-500 mt-2">Activity volume distribution</p>
            </div>
            <Award size={20} className="text-emerald-500" />
          </div>
          <div className="h-80 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-grow w-full h-full min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data?.participationDist || []}
                    cx="50%" cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                    animationBegin={500}
                    animationDuration={1500}
                  >
                    {(data?.participationDist || []).map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={10} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-4 w-full md:w-48">
               {(data?.participationDist || []).map((item: any, idx: number) => (
                 <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.name}</span>
                    </div>
                    <span className="text-sm font-black text-white italic">{item.value}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Class Skill Matrix - Radar Chart */}
        <div className="lg:col-span-2 glass-card p-10 bg-slate-900/40 border-dashed border-white/[0.05]">
           <div className="text-center mb-12">
              <h3 className="text-xl font-black text-white italic tracking-tight">Class Skill Matrix</h3>
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.4em] mt-2 italic">Holistic Performance Profile (Scaled 0-100)</p>
           </div>
           
           <div className="h-[450px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data?.skillMatrix || []}>
                  <PolarGrid stroke="#ffffff05" />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    stroke="#475569" 
                    fontSize={11} 
                    fontWeight="black"
                    tick={{ dy: 5 }}
                  />
                  <Radar 
                    name="Class Average" 
                    dataKey="A" 
                    stroke="#8b5cf6" 
                    fill="#8b5cf6" 
                    fillOpacity={0.3} 
                    strokeWidth={3}
                    animationDuration={2500}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      borderRadius: '16px', 
                      border: '1px solid rgba(139, 92, 246, 0.2)',
                      boxShadow: '0 0 30px rgba(139, 92, 246, 0.1)'
                    }} 
                  />
                </RadarChart>
              </ResponsiveContainer>
           </div>
           
           <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
              {(data?.skillMatrix || []).map((item: any, idx: number) => (
                <div key={idx} className="p-4 bg-white/[0.02] border border-white/[0.05] rounded-3xl text-center">
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{item.subject}</p>
                   <p className="text-xl font-black text-violet-400 italic">{item.A}%</p>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackAnalytics;

