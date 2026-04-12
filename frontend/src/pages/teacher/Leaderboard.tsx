import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { User } from '../../types';

const TeacherLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('global');

  useEffect(() => {
    fetchLeaderboard();
  }, [category]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/leaderboard', { params: { type: category } });
      setLeaderboard(data);
    } catch (error) {
      toast.error('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Are you sure you want to reset ALL student XP and LEADERBOARD data? This cannot be undone.')) return;
    try {
      await api.post('/leaderboard/reset');
      toast.success('Leaderboard reset successfully');
      fetchLeaderboard();
    } catch (error) {
      toast.error('Reset failed');
    }
  };

  const categories = [
    { id: 'global', label: 'Overall XP' },
    { id: 'eco', label: 'Eco Impact' },
    { id: 'edu', label: 'Academic XP' },
    { id: 'interest', label: 'Interests' },
  ];

  return (
    <div className="space-y-8 p-4 pt-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter italic">Competition <span className="text-yellow-500">Analytics</span></h2>
          <p className="text-xs text-slate-500 uppercase font-black tracking-widest mt-1">Live ranking monitoring</p>
        </div>

        <div className="flex items-center gap-3">
           <div className="flex bg-slate-900 p-1 rounded-xl border border-white/[0.05]">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${
                    category === cat.id ? 'bg-yellow-500 text-slate-950' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
           </div>
           <button 
             onClick={handleReset}
             className="px-4 py-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 rounded-xl transition-all text-xs font-black uppercase tracking-widest"
           >
             Reset Weekly
           </button>
        </div>
      </div>

      <div className="glass-card overflow-hidden border-white/[0.05]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/[0.02] border-b border-white/[0.05]">
              <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Rank</th>
              <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Student Warrior</th>
              <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Level</th>
              <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Impact Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            {loading ? (
              [1,2,3,4,5].map(i => (
                <tr key={i} className="animate-pulse">
                   <td colSpan={4} className="p-8 bg-white/[0.01]" />
                </tr>
              ))
            ) : leaderboard.map((user, idx) => (
              <tr key={user._id} className="hover:bg-white/[0.01] transition-colors group">
                <td className="p-6">
                   <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black italic text-xs ${
                     idx === 0 ? 'bg-yellow-400 text-slate-950 shadow-lg shadow-yellow-400/20' : 
                     idx === 1 ? 'bg-slate-300 text-slate-950' :
                     idx === 2 ? 'bg-amber-600 text-white' : 'text-slate-500'
                   }`}>
                     #{idx + 1}
                   </div>
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-slate-900 overflow-hidden">
                      {user.avatar ? (
                        <img src={user.avatar.startsWith('http') ? user.avatar : `https://gamified-environmental-education-w0n5.onrender.com${user.avatar}`} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <span className="text-xs font-black text-yellow-500 italic">{user.name.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                        <p className="font-bold text-slate-200 group-hover:text-yellow-400 transition-colors">{user.name}</p>
                        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-6 text-center">
                   <span className="text-xs font-black text-white bg-slate-800 px-3 py-1 rounded-full border border-white/5">
                      Lvl {user.level}
                   </span>
                </td>
                <td className="p-6 text-right">
                   <div className="flex flex-col items-end">
                      <span className="text-xl font-black text-white italic tracking-tighter">{user.xp.toLocaleString()}</span>
                      <span className="text-[9px] font-black text-slate-600 uppercase">Total XP</span>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
         {leaderboard.length === 0 && !loading && (
           <div className="p-20 text-center text-slate-600 italic">No rankings available yet.</div>
         )}
      </div>
    </div>
  );
};

export default TeacherLeaderboard;
