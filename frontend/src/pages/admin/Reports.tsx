import { useState, useEffect } from 'react';
import { 
  PieChart as PieChartIcon, Activity, TrendingUp, 
  Target, BookOpen, Download
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  Tooltip, Legend, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const COLORS = ['#818cf8', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#2dd4bf'];

const Reports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { data } = await api.get('/admin/reports');
      setData(data);
    } catch (error) {
      toast.error('Failed to load analytical reports');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  const subjectsData = data.subjectStats.map(s => ({
    name: s._id || 'General',
    value: s.count
  }));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-glow tracking-tighter">Strategic Insights</h1>
          <p className="text-slate-400">Advanced analytics for curriculum and engagement optimization</p>
        </div>
        <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-6 py-3 rounded-xl font-bold transition-all border border-slate-700">
          <Download size={18} /> Export Full Report (PDF)
        </button>
      </header>

      {/* Top Level Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 border-indigo-500/10 bg-indigo-500/[0.02]">
           <div className="flex items-center gap-2 mb-4">
              <Activity className="text-indigo-400" size={18} />
              <span className="text-sm font-bold text-slate-400">Mission Success Rate</span>
           </div>
           <div className="text-4xl font-black text-slate-100">{data.missionStats.rate.toFixed(1)}%</div>
           <p className="text-xs text-slate-500 mt-2">Approved vs Total Submissions</p>
        </div>
        <div className="glass-card p-6 border-emerald-500/10 bg-emerald-500/[0.02]">
           <div className="flex items-center gap-2 mb-4">
              <Target className="text-emerald-400" size={18} />
              <span className="text-sm font-bold text-slate-400">Total Validations</span>
           </div>
           <div className="text-4xl font-black text-slate-100">{data.missionStats.approved}</div>
           <p className="text-xs text-slate-500 mt-2">Unique successful mission outcomes</p>
        </div>
        <div className="glass-card p-6 border-amber-500/10 bg-amber-500/[0.02]">
           <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="text-amber-400" size={18} />
              <span className="text-sm font-bold text-slate-400">Participation Index</span>
           </div>
           <div className="text-4xl font-black text-slate-100">8.4</div>
           <p className="text-xs text-slate-500 mt-2">Platform interaction score (avg)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Subject Distribution */}
        <div className="glass-card p-8 border-slate-800/50">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-slate-100">Subject Popularity</h3>
              <p className="text-sm text-slate-400">Participation breakdown by academic topic</p>
            </div>
            <BookOpen className="text-slate-600" size={20} />
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={subjectsData.length > 0 ? subjectsData : [{name: 'No Data', value: 1}]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {subjectsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderRadius: '12px', 
                    border: '1px solid #1e293b'
                  }} 
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  formatter={(value) => <span className="text-xs font-bold text-slate-400 ml-2 uppercase tracking-tighter">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Learning Balance Radar */}
        <div className="glass-card p-8 border-slate-800/50">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-slate-100">Educational Balance</h3>
              <p className="text-sm text-slate-400">Engagement across different learning modalities</p>
            </div>
            <PieChartIcon className="text-slate-600" size={20} />
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                { subject: 'Quizzes', A: 120, B: 110, fullMark: 150 },
                { subject: 'Missions', A: 98, B: 130, fullMark: 150 },
                { subject: 'Materials', A: 86, B: 130, fullMark: 150 },
                { subject: 'Social', A: 99, B: 100, fullMark: 150 },
                { subject: 'Eco Impact', A: 85, B: 90, fullMark: 150 },
              ]}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                <Radar name="Engagement" dataKey="A" stroke="#818cf8" fill="#818cf8" fillOpacity={0.4} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderRadius: '12px', 
                    border: '1px solid #1e293b'
                  }} 
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
