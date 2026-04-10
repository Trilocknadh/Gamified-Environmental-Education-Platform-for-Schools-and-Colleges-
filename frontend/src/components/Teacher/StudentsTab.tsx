import React, { useState, useEffect } from 'react';
import { Search, User, Award, Shield, Zap, Book, ChevronRight, Star, Trophy } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const StudentsTab = () => {
  const [students, setStudents] = useState([]);
  const [quizResults, setQuizResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [badgeName, setBadgeName] = useState('');
  const [awarding, setAwarding] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [studentsRes, resultsRes] = await Promise.all([
        api.get('/users/students'),
        api.get('/quizzes/results')
      ]);
      setStudents(studentsRes.data);
      setQuizResults(resultsRes.data);
    } catch (error) {
      toast.error('Failed to fetch student data');
    } finally {
      setLoading(false);
    }
  };

  const handleAwardBadge = async (e) => {
    e.preventDefault();
    if (!badgeName) return;
    setAwarding(true);
    try {
      await api.post(`/users/${selectedStudent._id}/badge`, { badge: badgeName });
      toast.success(`Awarded ${badgeName} to ${selectedStudent.name}!`);
      setBadgeName('');
      setSelectedStudent(null);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to award badge');
    } finally {
      setAwarding(false);
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-white">Student Analytics & Rewards</h2>
        <div className="relative w-full md:w-64">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
           <input 
             type="text"
             placeholder="Search students..."
             value={search}
             onChange={(e) => setSearch(e.target.value)}
             className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-white focus:border-emerald-500 outline-none"
           />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Student List */}
        <div className="lg:col-span-2 space-y-4">
           {loading ? (
             [1,2,3].map(i => <div key={i} className="glass-card h-20 animate-pulse" />)
           ) : filteredStudents.length === 0 ? (
             <div className="text-center py-20 text-slate-600">No students found matching your search.</div>
           ) : (
             filteredStudents.map((s) => (
               <div key={s._id} className={`glass-card p-4 flex items-center justify-between group hover:border-emerald-500/30 transition-all ${selectedStudent?._id === s._id ? 'border-emerald-500 bg-emerald-500/5' : ''}`}>
                  <div className="flex items-center gap-4">
                     <img src={s.avatar} alt="Avatar" className="w-12 h-12 rounded-full border-2 border-slate-800 p-0.5" />
                     <div>
                        <h3 className="font-bold text-white flex items-center gap-2">
                          {s.name} <span className="text-[10px] bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full">Lvl {s.level}</span>
                        </h3>
                        <p className="text-xs text-slate-500">{s.email}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                           <span className="text-[10px] text-slate-400 flex items-center gap-1"><Zap size={10} className="text-emerald-400" /> {s.xp} XP</span>
                           <span className="text-[10px] text-slate-400 flex items-center gap-1"><Award size={10} className="text-emerald-400" /> {s.badges.length} Badges</span>
                        </div>
                     </div>
                  </div>
                  <button 
                    onClick={() => setSelectedStudent(s)}
                    className="p-2 border border-slate-800 rounded-lg text-slate-500 hover:text-emerald-400 hover:border-emerald-500/30 transition-all"
                  >
                    <ChevronRight size={20} />
                  </button>
               </div>
             ))
           )}
        </div>

        {/* Sidebar: Details/Actions */}
        <div className="space-y-6">
           {selectedStudent ? (
             <div className="glass-card p-6 border-emerald-500/30 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="text-center pb-4 border-b border-slate-800">
                   <img src={selectedStudent.avatar} alt="Avatar" className="w-20 h-20 rounded-full border-4 border-emerald-500/20 mx-auto mb-3" />
                   <h3 className="text-xl font-bold text-white">{selectedStudent.name}</h3>
                   <p className="text-xs text-slate-500">{selectedStudent.email}</p>
                </div>

                {/* Badges Section */}
                <div>
                   <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2 font-bold">
                     <Trophy size={14} className="text-emerald-400" /> Current Badges
                   </h4>
                   <div className="flex flex-wrap gap-2">
                      {selectedStudent.badges.length === 0 ? (
                        <p className="text-[10px] text-slate-600 italic">No badges awarded yet.</p>
                      ) : (
                        selectedStudent.badges.map((b, i) => (
                          <span key={i} className="text-[10px] font-bold bg-slate-900 border border-slate-800 text-emerald-400 px-3 py-1 rounded-full">{b}</span>
                        ))
                      )}
                   </div>
                </div>

                {/* Award Badge Form */}
                <form onSubmit={handleAwardBadge} className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800 space-y-3">
                   <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-tight">Award New Badge</h4>
                   <input 
                     type="text"
                     placeholder="e.g. Eco Warrior"
                     value={badgeName}
                     onChange={(e) => setBadgeName(e.target.value)}
                     className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-emerald-500 outline-none"
                   />
                   <button 
                     disabled={awarding || !badgeName}
                     className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-black py-2.5 rounded-lg transition-all text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10"
                   >
                     {awarding ? <span className="w-4 h-4 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" /> : <><Star size={14} /> Award Badge</>}
                   </button>
                </form>

                {/* Quiz Scores */}
                <div>
                   <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2 font-bold">
                     <Book size={14} className="text-emerald-400" /> Quiz Performance
                   </h4>
                   <div className="space-y-2">
                      {quizResults.filter(r => r.userId._id === selectedStudent._id).length === 0 ? (
                        <p className="text-[10px] text-slate-600 italic text-center py-4 bg-slate-900/30 rounded-xl">No quiz scores recorded.</p>
                      ) : (
                        quizResults.filter(r => r.userId._id === selectedStudent._id).map((r, i) => (
                          <div key={i} className="flex justify-between items-center p-2.5 bg-slate-900/30 rounded-xl border border-slate-800/50">
                             <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-slate-200">{r.quizId.title}</span>
                                <span className="text-[8px] text-slate-500">{r.quizId.subject}</span>
                             </div>
                             <div className="text-right">
                                <span className={`text-xs font-black ${r.score >= 80 ? 'text-emerald-400' : r.score >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>{r.score}%</span>
                                <p className="text-[8px] text-slate-600">+{r.earnedXP} XP</p>
                             </div>
                          </div>
                        ))
                      )}
                   </div>
                </div>
             </div>
           ) : (
             <div className="glass-card h-80 flex flex-col items-center justify-center text-center p-8 border-dashed">
                <User size={48} className="text-slate-800 mb-4" />
                <h3 className="text-slate-500 font-bold mb-2">Student Insights</h3>
                <p className="text-xs text-slate-700 leading-relaxed italic">Select a student from the list to view their progress, analyze results, and award achievement badges.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default StudentsTab;
