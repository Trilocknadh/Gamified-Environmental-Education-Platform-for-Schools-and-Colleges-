import { useState, useEffect } from 'react';
import { 
  Zap, 
  Leaf, 
  BookOpen, 
  Trophy, 
  TrendingUp, 
  Flame, 
  CheckCircle2, 
  LayoutDashboard,
  Target,
  Rocket,
  ArrowUpRight,
  ShieldCheck,
  PlayCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis
} from 'recharts';
import { Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import api from '../../api/axios';

const StudentDashboard = () => {
  const { user } = useAuthStore();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await api.get('/users/dashboard-stats');
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchDashboardData();
  }, [user]);

  if (!user || loading || !dashboardData) return (
    <div className="min-h-screen bg-[#060a16] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
    </div>
  );

  const nextLevelXP = dashboardData.level * 1000;
  const progressPercent = Math.min(((dashboardData.points % nextLevelXP) / nextLevelXP) * 100, 100);

  const performanceData = dashboardData.performanceData;
  const skillMatrix = dashboardData.skillMatrix;
  const activityData = dashboardData.activityData;

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b'];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 bg-transparent"
    >
      {/* Dynamic Command Header */}
      <motion.header 
        variants={itemVariants}
        className="relative p-10 rounded-[3rem] bg-gradient-to-br from-slate-900/80 to-slate-950/90 border border-white/5 overflow-hidden group shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] -mr-64 -mt-64 animate-pulse-subtle" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] -ml-32 -mb-32 animate-float-slow" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* User Identity */}
          <div className="flex items-center gap-8">
            <div className="relative p-1 rounded-3xl bg-gradient-to-tr from-emerald-500/50 to-blue-500/50 shadow-2xl">
              <div className="w-28 h-28 rounded-[1.4rem] bg-slate-950 overflow-hidden p-1 border border-white/10 flex items-center justify-center">
                {user.avatar ? (
                  <img 
                    src={user.avatar.startsWith('http') ? user.avatar : `https://gamified-environmental-education-w0n5.onrender.com${user.avatar}`} 
                    alt="" 
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="w-full h-full rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 text-3xl font-black italic">
                    {user.name.charAt(0)}
                  </div>
                )}
              </div>
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute -bottom-2 -right-2 w-10 h-10 bg-slate-900 border-2 border-emerald-500 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <ShieldCheck size={20} className="text-emerald-500" />
              </motion.div>
            </div>
            
            <div>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 mb-2"
              >
                <div className="px-3 py-1 bg-emerald-500 text-slate-900 rounded-full text-[9px] font-black uppercase tracking-[0.2em]">
                  Elite Guardian
                </div>
                <div className="flex items-center gap-1 text-orange-500">
                  <Flame size={14} fill="currentColor" />
                  <span className="text-xs font-black uppercase tracking-wider">{user.streak || 12} Day Streak</span>
                </div>
              </motion.div>
              <h1 className="text-5xl font-black text-white tracking-tighter italic">
                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">{user.name.split(' ')[0]}</span>
              </h1>
              <p className="text-sm text-slate-500 mt-3 font-medium flex items-center gap-2">
                <Trophy size={16} className="text-yellow-500/70" />
                Level {user.level || 1} • {user.xp.toLocaleString()} Total XP
              </p>
            </div>
          </div>

          {/* Level Intelligence Station */}
          <div className="flex flex-col gap-5 min-w-[320px] max-w-sm w-full p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-md">
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Evolution Progress</p>
                <h4 className="text-xl font-black text-white italic">Rank {user.level || 1} <span className="text-slate-600">→</span> {user.level + 1}</h4>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest leading-none mb-1">XP Remaining</p>
                <p className="text-lg font-black text-white italic">{(nextLevelXP - (user.xp % nextLevelXP)).toLocaleString()}</p>
              </div>
            </div>
            <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden shadow-inner">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all duration-1000"
              />
            </div>
          </div>
        </div>
      </motion.header>

      {/* Primary Analytics Console */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        
        {/* Rapid Response Controls (Left) */}
        <div className="xl:col-span-3 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] italic">Quick Navigation</h3>
            <div className="w-12 h-[1px] bg-slate-800" />
          </div>

          <nav className="space-y-4">
            {[
              { to: '/academic/subjects', icon: BookOpen, label: 'Knowledge Base', sub: 'Learn Concepts', color: 'bg-emerald-500', glow: 'shadow-emerald-500/20' },
              { to: '/environment/missions', icon: Rocket, label: 'Eco Missions', sub: 'Active Operations', color: 'bg-blue-500', glow: 'shadow-blue-500/20' },
              { to: '/environment/quiz', icon: PlayCircle, label: 'Skill Assessment', sub: 'Take Quizzes', color: 'bg-violet-500', glow: 'shadow-violet-500/20' },
              { to: '/leaderboard', icon: Trophy, label: 'Global Rankings', sub: 'Elite Standings', color: 'bg-amber-500', glow: 'shadow-amber-500/20' },
            ].map((item, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Link to={item.to} className="block group">
                  <div className="glass-card p-5 flex items-center gap-5 hover:bg-white/[0.04] hover:scale-[1.02] transition-all duration-300 premium-border overflow-hidden">
                    <div className={`w-14 h-14 rounded-2xl ${item.color}/10 flex items-center justify-center text-white p-3 group-hover:scale-110 transition-transform duration-500 ${item.glow}`}>
                       <item.icon size={26} className="text-white opacity-80" />
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-sm font-black text-white italic tracking-tight">{item.label}</h4>
                      <p className="text-[10px] text-slate-500 mt-1 uppercase font-black tracking-widest">{item.sub}</p>
                    </div>
                    <ArrowUpRight size={16} className="text-slate-700 group-hover:text-emerald-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Mini Insights Card */}
          <motion.div variants={itemVariants} className="p-8 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/20 relative overflow-hidden group">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl transition-all group-hover:scale-150" />
            <div className="relative z-10 text-center">
               <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <Zap className="text-emerald-400" size={28} fill="currentColor" />
               </div>
               <h4 className="text-lg font-black text-white italic">Level Up Near!</h4>
               <p className="text-[10px] text-slate-500 mt-3 font-bold uppercase tracking-widest leading-relaxed">
                 You are just <span className="text-emerald-400">{(nextLevelXP - (dashboardData.points % nextLevelXP)).toLocaleString()} XP</span> away from your next evolution phase.
               </p>
            </div>
          </motion.div>
        </div>

        {/* Tactical Intelligence (Center) */}
        <div className="xl:col-span-6 space-y-10">
          
          {/* Main Performance Area Chart */}
          <motion.div variants={itemVariants} className="glass-card p-8 bg-slate-900/40 glow-subtle">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-xl font-black text-white italic leading-none flex items-center gap-3">
                  <LayoutDashboard size={20} className="text-emerald-500" />
                  Performance Matrix
                </h3>
                <p className="text-[10px] text-slate-500 mt-2 uppercase font-black tracking-widest italic">Multi-disciplinary Proficiency Tracking</p>
              </div>
              <div className="flex bg-slate-800 p-1 rounded-xl">
                 <button className="px-4 py-1.5 text-[9px] font-black uppercase tracking-widest bg-emerald-500 text-slate-950 rounded-lg shadow-lg">Weekly</button>
                 <button className="px-4 py-1.5 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Monthly</button>
              </div>
            </div>
            
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorPerf" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis 
                    dataKey="subject" 
                    stroke="#475569" 
                    fontSize={10} 
                    fontWeight="black" 
                    tickLine={false} 
                    axisLine={false}
                    dy={15}
                  />
                  <YAxis 
                    stroke="#475569" 
                    fontSize={10} 
                    fontWeight="black" 
                    tickLine={false} 
                    axisLine={false}
                    dx={-10}
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      borderRadius: '1.5rem', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                      padding: '15px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#10b981" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorPerf)" 
                    animationDuration={2500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Action Intensity Doughnut */}
            <motion.div variants={itemVariants} className="glass-card p-8 group">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-black text-white italic uppercase tracking-[0.2em]">Operational Mix</h3>
                <TrendingUp size={16} className="text-slate-600 group-hover:text-emerald-500 transition-colors" />
              </div>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={activityData}
                      cx="50%" cy="50%"
                      innerRadius={70}
                      outerRadius={95}
                      paddingAngle={10}
                      dataKey="value"
                      stroke="none"
                    >
                      {activityData.map((_entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]} 
                          className="hover:opacity-80 transition-opacity cursor-pointer outline-none"
                          style={{ filter: `drop-shadow(0 0 10px ${COLORS[index % COLORS.length]}33)` }}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderRadius: '1rem', border: '1px solid #1e293b' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-8">
                 {activityData.map((item, i) => (
                   <div key={i} className="text-center">
                      <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">{item.name}</p>
                      <p className="text-sm font-black text-white italic">{item.value}</p>
                   </div>
                 ))}
              </div>
            </motion.div>

            {/* Daily Challenge Portal */}
            <motion.div variants={itemVariants} className="glass-card p-8 flex flex-col items-center justify-center text-center space-y-6 bg-blue-500/[0.03] border-blue-500/10">
              <div className="w-20 h-20 bg-blue-500/10 rounded-[2rem] flex items-center justify-center border border-blue-500/20 shadow-xl shadow-blue-500/10">
                <Target size={32} className="text-blue-400" />
              </div>
              <div>
                <h4 className="text-xl font-black text-white italic tracking-tight">Active Operation</h4>
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-2 px-6">Neutralize Carbon footprint in next mission</p>
              </div>
              <button className="w-full py-4 bg-blue-500 hover:bg-blue-400 text-slate-950 font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl transition-all shadow-lg shadow-blue-500/20 active:scale-95">
                Initiate Protocol
              </button>
            </motion.div>
          </div>
        </div>

        {/* Global Standings (Right) */}
        <div className="xl:col-span-3 space-y-10">
          <motion.div variants={itemVariants} className="glass-card p-8 bg-slate-900/60 border-dashed border-white/5 h-full">
            <div className="flex items-center justify-between mb-10">
               <div>
                 <h3 className="text-lg font-black text-white italic leading-none">Global Rank</h3>
                 <p className="text-[10px] text-slate-500 mt-2 font-black uppercase tracking-widest">Greenwood Int. Leaderboard</p>
               </div>
               <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                  <Trophy size={20} />
               </div>
            </div>

            <div className="space-y-6">
               {dashboardData.leaderboard.map((player: any, idx: number) => (
                 <div key={idx} className={`p-4 rounded-2xl flex items-center gap-4 transition-all ${player._id === user._id ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-white/[0.02] border border-white/5 grayscale hover:grayscale-0'}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${idx < 3 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-500'}`}>
                      {idx + 1}
                    </div>
                    <div className="flex-grow min-w-0">
                       <p className={`text-xs font-black truncate ${player._id === user._id ? 'text-white' : 'text-slate-400'}`}>{player.name}</p>
                       <p className="text-[9px] font-bold text-slate-600 mt-0.5 uppercase tracking-tighter">{player.xp.toLocaleString()} XP Points</p>
                    </div>
                    {player._id === user._id && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                 </div>
               ))}
            </div>

            <button className="w-full mt-10 py-4 border border-white/5 hover:bg-white/5 rounded-2xl text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-[0.2em] transition-all">
              View Full Standings
            </button>
            
            {/* Skill Radar - Nested in sidebar for density */}
            <div className="mt-12 pt-12 border-t border-white/5">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest text-center mb-10">Class Skill Matrix</h3>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillMatrix}>
                    <PolarGrid stroke="#ffffff05" />
                    <PolarAngleAxis dataKey="subject" stroke="#475569" fontSize={9} fontWeight="black" />
                    <Radar 
                      name="User" 
                      dataKey="A" 
                      stroke="#10b981" 
                      fill="#10b981" 
                      fillOpacity={0.4} 
                      strokeWidth={3}
                      animationDuration={3000}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
};

export default StudentDashboard;

