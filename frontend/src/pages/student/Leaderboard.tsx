import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Star, User, Zap, Crown, TrendingUp, Search } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

interface UserItem {
  _id: string;
  name: string;
  xp: number;
  ecoXp?: number;
  eduXp?: number;
  level: number;
  badges: string[];
  avatar?: string;
}

const Leaderboard = () => {
  const [topUsers, setTopUsers] = useState<UserItem[]>([]);
  const [myRankInfo, setMyRankInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('global');

  const tabs = [
    { id: 'global', label: 'Global', icon: Star, color: 'yellow' },
    { id: 'eco', label: 'Eco', icon: Trophy, color: 'emerald' },
    { id: 'edu', label: 'Education', icon: Medal, color: 'blue' },
  ];

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const typeParam = activeTab === 'global' ? '' : `?type=${activeTab}`;
      const [leaderboardRes, rankRes] = await Promise.all([
        api.get(`/leaderboard${typeParam}`),
        api.get(`/leaderboard/my-rank${typeParam}`)
      ]);
      setTopUsers(leaderboardRes.data);
      setMyRankInfo(rankRes.data);
    } catch (error) {
      toast.error('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const getScoreDisplay = (user: UserItem) => {
    if (activeTab === 'eco') return user.ecoXp || 0;
    if (activeTab === 'edu') return user.eduXp || 0;
    return user.xp || 0;
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 px-4">
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-black text-white tracking-tight mb-2 italic">Hall of Guardians</h1>
          <p className="text-slate-400">Honoring the top contributors to our planet and community.</p>
        </div>
        <div className="flex bg-slate-800/40 p-1 rounded-2xl border border-slate-700/50">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === tab.id 
                  ? `bg-${tab.color}-500 text-slate-950 shadow-lg` 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
           <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
           <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Calculating Global Ranks...</p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-16"
          >
            {/* Podium */}
            <div className="flex flex-col md:flex-row items-end justify-center gap-4 md:gap-0 px-4 pt-10">
              {/* Silver - 2nd */}
              {topUsers[1] && (
                <div className="w-full md:w-64 flex flex-col items-center order-2 md:order-1">
                  <div className="mb-4 text-center">
                     <div className="w-20 h-20 rounded-full border-4 border-slate-400 p-1 mb-2 relative mx-auto overflow-hidden flex items-center justify-center bg-slate-900 border border-slate-700/50">
                        {topUsers[1].avatar ? (
                          <img 
                             src={topUsers[1].avatar.startsWith('http') ? topUsers[1].avatar : `https://gamified-environmental-education-w0n5.onrender.com${topUsers[1].avatar}`} 
                             className="w-full h-full rounded-full object-cover" 
                             alt="" 
                          />
                        ) : (
                          <span className="text-2xl font-black text-slate-400 italic">{topUsers[1].name.charAt(0)}</span>
                        )}
                        <div className="absolute -top-2 -right-2 bg-slate-400 text-slate-950 w-8 h-8 rounded-full flex items-center justify-center font-black border-4 border-slate-900 text-sm">2</div>
                     </div>
                     <h4 className="font-bold text-white line-clamp-1">{topUsers[1].name}</h4>
                     <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{getScoreDisplay(topUsers[1])} XP</p>
                  </div>
                  <motion.div 
                    initial={{ height: 0 }} animate={{ height: 160 }}
                    className="w-full bg-gradient-to-t from-slate-800/80 to-slate-700/50 border-x border-t border-slate-600/30 rounded-t-3xl flex items-center justify-center"
                  >
                     <Medal className="text-slate-400 w-12 h-12 opacity-20" />
                  </motion.div>
                </div>
              )}

              {/* Gold - 1st */}
              {topUsers[0] && (
                <div className="w-full md:w-72 flex flex-col items-center order-1 md:order-2 z-10">
                  <div className="mb-6 text-center transform scale-110">
                     <div className="w-24 h-24 rounded-full border-4 border-yellow-500 p-1 mb-3 relative mx-auto shadow-[0_0_30px_rgba(234,179,8,0.3)] overflow-hidden flex items-center justify-center bg-slate-900">
                        {topUsers[0].avatar ? (
                          <img 
                             src={topUsers[0].avatar.startsWith('http') ? topUsers[0].avatar : `https://gamified-environmental-education-w0n5.onrender.com${topUsers[0].avatar}`} 
                             className="w-full h-full rounded-full object-cover" 
                             alt="" 
                          />
                        ) : (
                           <span className="text-3xl font-black text-yellow-500 italic">{topUsers[0].name.charAt(0)}</span>
                        )}
                        <div className="absolute -top-3 -right-3 bg-yellow-500 text-slate-950 w-10 h-10 rounded-full flex items-center justify-center font-black border-4 border-slate-900 text-lg">1</div>
                        <Crown className="absolute -top-10 left-1/2 -translate-x-1/2 text-yellow-500 fill-yellow-500 w-8 h-8 animate-bounce" />
                     </div>
                     <h4 className="font-black text-xl text-white tracking-tight">{topUsers[0].name}</h4>
                     <p className="text-yellow-500 font-black uppercase tracking-widest text-sm">{getScoreDisplay(topUsers[0])} XP</p>
                  </div>
                  <motion.div 
                    initial={{ height: 0 }} animate={{ height: 220 }}
                    className="w-full bg-gradient-to-t from-yellow-500/20 to-yellow-500/10 border-x border-t border-yellow-500/30 rounded-t-[2.5rem] flex items-center justify-center shadow-[0_0_50px_rgba(234,179,8,0.1)]"
                  >
                     <Trophy className="text-yellow-500 w-16 h-16 opacity-30" />
                  </motion.div>
                </div>
              )}

              {/* Bronze - 3rd */}
              {topUsers[2] && (
                <div className="w-full md:w-64 flex flex-col items-center order-3">
                  <div className="mb-4 text-center">
                     <div className="w-20 h-20 rounded-full border-4 border-orange-600 p-1 mb-2 relative mx-auto overflow-hidden flex items-center justify-center bg-slate-900">
                        {topUsers[2].avatar ? (
                          <img 
                             src={topUsers[2].avatar.startsWith('http') ? topUsers[2].avatar : `https://gamified-environmental-education-w0n5.onrender.com${topUsers[2].avatar}`} 
                             className="w-full h-full rounded-full object-cover" 
                             alt="" 
                          />
                        ) : (
                          <span className="text-2xl font-black text-orange-600 italic">{topUsers[2].name.charAt(0)}</span>
                        )}
                        <div className="absolute -top-2 -right-2 bg-orange-600 text-slate-950 w-8 h-8 rounded-full flex items-center justify-center font-black border-4 border-slate-900 text-sm">3</div>
                     </div>
                     <h4 className="font-bold text-white line-clamp-1">{topUsers[2].name}</h4>
                     <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{getScoreDisplay(topUsers[2])} XP</p>
                  </div>
                  <motion.div 
                    initial={{ height: 0 }} animate={{ height: 120 }}
                    className="w-full bg-gradient-to-t from-slate-800/80 to-slate-800/40 border-x border-t border-slate-700/30 rounded-t-3xl flex items-center justify-center"
                  >
                     <Medal className="text-orange-600 w-12 h-12 opacity-20" />
                  </motion.div>
                </div>
              )}
            </div>

            {/* Table */}
            <div className="glass-card overflow-hidden border-slate-800/50">
               <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                  <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-500">Student Rankings</h3>
                  <div className="relative">
                     <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
                     <input type="text" placeholder="Search student..." className="bg-slate-950 border border-slate-800 rounded-lg py-1.5 pl-9 pr-3 text-xs focus:outline-none focus:border-emerald-500/50 transition-all text-slate-400" />
                  </div>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800/50">
                           <th className="px-8 py-4">Rank</th>
                           <th className="px-8 py-4">Guardian</th>
                           <th className="px-8 py-4">Level</th>
                           <th className="px-8 py-4 text-right">Impact Score</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-800/30">
                        {topUsers.map((user, idx) => (
                           <tr key={user._id} className={`group hover:bg-white/[0.02] transition-colors ${myRankInfo?.rank === idx + 1 ? 'bg-emerald-500/5' : ''}`}>
                              <td className="px-8 py-5">
                                 <div className="flex items-center gap-3">
                                    <span className={`text-sm font-black ${idx < 3 ? 'text-white' : 'text-slate-500'}`}>#{idx + 1}</span>
                                    {idx < 3 && <TrendingUp size={12} className="text-emerald-500 animate-pulse" />}
                                 </div>
                              </td>
                              <td className="px-8 py-5">
                                 <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden">
                                       {user.avatar ? (
                                          <img src={user.avatar.startsWith('http') ? user.avatar : `${BASE_URL}${user.avatar}`} className="w-full h-full object-cover opacity-80" alt="" />
                                       ) : (
                                          <span className="text-xs font-black text-emerald-500 italic">{user.name.charAt(0)}</span>
                                       )}
                                    </div>
                                    <div>
                                       <div className="font-bold text-slate-200 group-hover:text-emerald-400 transition-colors flex items-center gap-2">
                                          {user.name}
                                          {myRankInfo?.rank === idx + 1 && <span className="text-[8px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded uppercase border border-emerald-500/20">You</span>}
                                       </div>
                                       <p className="text-[10px] text-slate-500 font-medium">Eco Guardian</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-8 py-5">
                                 <span className="text-xs font-bold text-slate-400">Level {user.level}</span>
                              </td>
                              <td className="px-8 py-5 text-right">
                                 <div className="flex items-center justify-end gap-2">
                                    <Zap size={12} className="text-yellow-400" />
                                    <span className="text-sm font-black text-emerald-400 font-mono tracking-tighter">{getScoreDisplay(user)}</span>
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>

            {/* My Fixed Rank Card (if not in top 10) */}
            {myRankInfo && (
              <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-20">
                 <motion.div 
                   initial={{ y: 100 }} animate={{ y: 0 }}
                   className="glass-card p-4 border-emerald-500/40 bg-slate-900/90 backdrop-blur-xl flex items-center justify-between shadow-2xl"
                 >
                    <div className="flex items-center gap-6">
                       <div className="flex flex-col items-center justify-center bg-emerald-500 text-slate-950 w-12 h-12 rounded-2xl font-black">
                          <span className="text-[10px] leading-none opacity-60">RANK</span>
                          <span className="text-xl leading-none">#{myRankInfo.rank}</span>
                       </div>
                       <div className="h-8 w-[1px] bg-slate-700" />
                       <div>
                          <h5 className="font-bold text-white text-sm">Your Current Standing</h5>
                          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Total {activeTab} contribution</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <div className="flex items-center gap-2 justify-end mb-1">
                          <Zap size={14} className="text-yellow-400" />
                          <span className="text-xl font-black text-emerald-400 font-mono">{myRankInfo.xp}</span>
                       </div>
                       <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest">Keep going!</p>
                    </div>
                 </motion.div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default Leaderboard;
