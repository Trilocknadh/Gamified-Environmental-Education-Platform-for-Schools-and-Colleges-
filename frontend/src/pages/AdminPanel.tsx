import { useState, useEffect } from 'react';
import { 
  Users, UserCheck, ShieldCheck, TrendingUp, 
  Search, School
} from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('teachers');
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [teacherRes, studentRes] = await Promise.all([
        api.get('/teachers/all'),
        api.get('/users/students')
      ]);
      setTeachers(teacherRes.data);
      setStudents(studentRes.data);
    } catch (error) {
      toast.error('Failed to retrieve performance data');
    } finally {
      setLoading(false);
    }
  };

  const filteredData = activeTab === 'teachers' 
    ? teachers.filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.schoolName.toLowerCase().includes(search.toLowerCase()))
    : students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.schoolName.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#0a0f1d] p-4 md:p-8 pt-24 text-slate-200">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
             <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                <ShieldCheck className="text-indigo-400 w-8 h-8" />
             </div>
             <div>
                <h1 className="text-4xl font-black text-glow tracking-tighter">Admin Control Tower</h1>
                <p className="text-slate-400 text-sm">Monitoring educational impact across all roles</p>
             </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="flex bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800 w-full md:w-fit">
              <button 
                onClick={() => setActiveTab('teachers')}
                className={`px-8 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'teachers' ? 'bg-indigo-500 text-slate-900' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Users size={18} /> Teacher Performance
              </button>
              <button 
                onClick={() => setActiveTab('students')}
                className={`px-8 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'students' ? 'bg-emerald-500 text-slate-900' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <UserCheck size={18} /> Student Analytics
              </button>
            </div>

            <div className="relative w-full md:w-80 group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400" size={18} />
               <input 
                 type="text" 
                 placeholder="Search by name or school..."
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 className="w-full bg-slate-900/40 border border-slate-800 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-indigo-500/50 transition-all text-sm"
               />
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center py-32">
             <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900/50 border-b border-slate-800/50">
                    <th className="p-6 text-xs font-black text-slate-500 uppercase tracking-widest">Profile</th>
                    <th className="p-6 text-xs font-black text-slate-500 uppercase tracking-widest">Educational Hub</th>
                    <th className="p-6 text-xs font-black text-slate-500 uppercase tracking-widest text-center">
                      {activeTab === 'teachers' ? 'Missions Approved' : 'Current Level'}
                    </th>
                    <th className="p-6 text-xs font-black text-slate-500 uppercase tracking-widest text-right">XP Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/30">
                  {filteredData.map((person) => (
                    <tr key={person._id} className="hover:bg-slate-800/20 transition-all group">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl bg-slate-900 border flex items-center justify-center font-bold text-xl ${activeTab === 'teachers' ? 'border-indigo-500/20 text-indigo-400' : 'border-emerald-500/20 text-emerald-400'}`}>
                            {person.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-black text-slate-100 group-hover:text-glow transition-all">{person.name}</div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-tighter">{person.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                         <div className="flex items-center gap-2 text-sm text-slate-300 font-medium">
                            <School size={14} className="text-slate-500" /> {person.schoolName || 'Global'}
                         </div>
                      </td>
                      <td className="p-6 text-center">
                         <span className={`px-4 py-1.5 rounded-full text-xs font-black border ${
                            activeTab === 'teachers' 
                              ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' 
                              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                         }`}>
                           {activeTab === 'teachers' ? person.approvedCount : `Lvl ${person.level}`}
                         </span>
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex flex-col items-end">
                           <span className="text-lg font-black text-slate-100 font-mono tracking-tighter">
                             {person.xp.toLocaleString()}
                           </span>
                           <div className="flex gap-1 mt-1">
                             {(person.badges || []).slice(0, 3).map((b, i) => (
                               <div key={i} className="w-2 h-2 rounded-full bg-slate-700" title={b} />
                             ))}
                           </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredData.length === 0 && (
              <div className="py-20 text-center text-slate-500 italic">No matching records found for this criteria.</div>
            )}
          </div>
        )}

        {/* Global Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
           <div className="glass-card p-6 border-indigo-500/10 bg-indigo-500/[0.02]">
              <div className="flex items-center justify-between mb-4">
                 <h3 className="text-sm font-bold text-slate-400">Total Educators</h3>
                 <Users className="text-indigo-400" size={20} />
              </div>
              <div className="text-4xl font-black text-slate-100">{teachers.length}</div>
              <p className="text-xs text-slate-500 mt-2">Active across all registered schools</p>
           </div>
           <div className="glass-card p-6 border-emerald-500/10 bg-emerald-500/[0.02]">
              <div className="flex items-center justify-between mb-4">
                 <h3 className="text-sm font-bold text-slate-400">Student Warriors</h3>
                 <UserCheck className="text-emerald-400" size={20} />
              </div>
              <div className="text-4xl font-black text-slate-100">{students.length}</div>
              <p className="text-xs text-slate-500 mt-2">Engaged in gamified eco-learning</p>
           </div>
           <div className="glass-card p-6 border-yellow-500/10 bg-yellow-500/[0.02]">
              <div className="flex items-center justify-between mb-4">
                 <h3 className="text-sm font-bold text-slate-400">Platform Momentum</h3>
                 <TrendingUp className="text-yellow-400" size={20} />
              </div>
              <div className="text-4xl font-black text-slate-100">
                {Math.round((teachers.reduce((acc, t) => acc + (t.approvedCount || 0), 0) + students.reduce((acc, s) => acc + s.xp, 0)) / 1000)}k
              </div>
              <p className="text-xs text-slate-500 mt-2">Combined XP and approval units</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
