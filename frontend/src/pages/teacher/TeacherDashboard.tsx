import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  HelpCircle, 
  Zap,
  TrendingUp,
  Activity,
  ArrowRight
} from 'lucide-react';
import { 
  AreaChart, Area, 
  Tooltip, ResponsiveContainer
} from 'recharts';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { DashboardStats, ActivityFeed } from '../../types';

const TeacherDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activity, setActivity] = useState<ActivityFeed | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data } = await api.get('/teachers/dashboard-stats');
      setStats(data.stats);
      setActivity(data.recentActivity);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Students', value: stats?.totalStudents || 0, icon: Users, color: 'blue', desc: 'Enrolled in school' },
    { label: 'Active Students', value: stats?.activeStudents || 0, icon: Activity, color: 'emerald', desc: 'Active this week' },
    { label: 'Quizzes Done', value: stats?.totalQuizzesCompleted || 0, icon: HelpCircle, color: 'violet', desc: 'All time completions' },
    { label: 'Pending Missions', value: stats?.totalMissionsSubmitted || 0, icon: Zap, color: 'amber', desc: 'Awaiting review' },
  ];

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-10 p-4 pt-24">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 border-white/[0.05] relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
            <div className="flex items-start justify-between relative">
              <div>
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">{card.label}</p>
                <h3 className="text-4xl font-black text-white tracking-tighter">{card.value}</h3>
                <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
                  <TrendingUp size={10} className="text-emerald-400" /> {card.desc}
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-500/10">
                <card.icon size={24} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Charts Section */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card p-8 border-white/[0.05]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-black text-white tracking-tight italic">Engagement Trends</h3>
                <p className="text-xs text-slate-500 uppercase font-black tracking-widest mt-1">Recent Activity volume</p>
              </div>
            </div>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.trends || [
                  { name: 'Day 1', activity: 10 },
                  { name: 'Day 2', activity: 25 },
                  { name: 'Day 3', activity: 15 },
                  { name: 'Day 4', activity: 40 },
                  { name: 'Day 5', activity: 30 },
                  { name: 'Day 6', activity: 60 },
                  { name: 'Day 7', activity: 45 },
                ]}>
                  <defs>
                    <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }}
                    itemStyle={{ color: '#3b82f6' }}
                  />
                  <Area type="monotone" dataKey="activity" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorActivity)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Activity Sidebar */}
        <div className="space-y-6">
           <div className="glass-card p-6 border-white/[0.05]">
              <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                <Activity size={16} className="text-blue-400" /> Recent Submissions
              </h3>
              <div className="space-y-4">
                {activity?.submissions?.map((sub) => (
                  <div key={sub._id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] transition-all group cursor-pointer">
                    <div className="w-8 h-8 rounded-full border border-white/10 overflow-hidden flex items-center justify-center bg-slate-800">
                      {sub.userId?.avatar ? (
                        <img 
                          src={sub.userId.avatar.startsWith('http') ? sub.userId.avatar : `http://localhost:5000${sub.userId.avatar}`} 
                          className="w-full h-full object-cover" 
                          alt="" 
                        />
                      ) : (
                        <span className="text-[10px] font-black text-blue-400">{sub.userId?.name?.charAt(0)}</span>
                      )}
                    </div>
                    <div className="flex-grow min-w-0">
                       <p className="text-xs font-bold text-slate-200 truncate">{sub.userId?.name}</p>
                       <p className="text-[10px] text-slate-500 truncate">{sub.missionId?.title}</p>
                    </div>
                    <ArrowRight size={14} className="text-slate-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
                {(!activity || activity.submissions.length === 0) && (
                  <p className="text-[10px] text-slate-600 text-center py-4">No recent submissions</p>
                )}
              </div>
           </div>

           <div className="glass-card p-6 border-white/[0.05] bg-blue-500/5 border-blue-500/20">
              <h3 className="text-sm font-black text-white uppercase tracking-widest mb-2">Notice Board</h3>
              <p className="text-[10px] text-blue-400/80 leading-relaxed">
                Welcome to the new Teacher Command Center. Use the sidebar to manage quizzes, materials, and eco-missions. Weekly leaderboard reset is scheduled for Sunday midnight.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
