import { useState, useEffect } from 'react';
import { 
  Trophy, Star, Award, Zap, 
  Target, GraduationCap, School, ChevronRight
} from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const Performance = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSegment, setActiveSegment] = useState('students');

  useEffect(() => {
    fetchPerformance();
  }, []);

  const fetchPerformance = async () => {
    try {
      const { data } = await api.get('/admin/performance');
      setData(data);
    } catch (error) {
      toast.error('Failed to load performance metrics');
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

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-glow tracking-tighter">Performance Hub</h1>
          <p className="text-slate-400">Granular tracking of educational impact and user engagement</p>
        </div>
        <div className="flex bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800 w-full md:w-fit">
          <button 
            onClick={() => setActiveSegment('students')}
            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              activeSegment === 'students' ? 'bg-emerald-500 text-slate-900 shadow-lg shadow-emerald-500/20' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <GraduationCap size={18} /> Student Rankings
          </button>
          <button 
            onClick={() => setActiveSegment('teachers')}
            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              activeSegment === 'teachers' ? 'bg-indigo-500 text-slate-900 shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Trophy size={18} /> Teacher Engagement
          </button>
        </div>
      </header>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 gap-6">
        {activeSegment === 'students' ? (
          <div className="space-y-4">
             {data.topStudents.map((student, index) => (
               <div key={student._id} className="glass-card p-6 border-slate-800/40 hover:border-emerald-500/20 transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-6">
                     <div className="text-3xl font-black text-slate-800 tabular-nums w-8">
                       {index + 1}
                     </div>
                     <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center font-black text-2xl text-emerald-400">
                        {student.name.charAt(0)}
                     </div>
                     <div>
                        <div className="text-xl font-black text-slate-100 group-hover:text-glow transition-all">{student.name}</div>
                        <div className="flex items-center gap-3 mt-1">
                           <span className="text-xs text-slate-500 flex items-center gap-1"><School size={10} /> {student.schoolName || 'Global'}</span>
                           <span className="text-xs text-emerald-500/80 font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">Lvl {student.level}</span>
                        </div>
                     </div>
                  </div>
                  
                  <div className="flex items-center gap-12 text-right">
                     <div className="hidden md:block">
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Badges Earned</div>
                        <div className="flex gap-1 justify-end">
                           {(student.badges || []).slice(0, 4).map((_, bIdx) => (
                             <Award key={bIdx} size={14} className="text-indigo-400" />
                           ))}
                           {(student.badges || []).length > 4 && <span className="text-[10px] text-slate-500">+{student.badges.length - 4}</span>}
                        </div>
                     </div>
                     <div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Total Effort</div>
                        <div className="text-2xl font-black text-slate-100 font-mono tracking-tighter">
                          {student.xp.toLocaleString()} <span className="text-xs text-slate-600 ml-1">XP</span>
                        </div>
                     </div>
                     <ChevronRight size={20} className="text-slate-700 group-hover:text-emerald-400 transition-all" />
                  </div>
               </div>
             ))}
          </div>
        ) : (
          <div className="space-y-4">
            {data.topTeachers.map((teacher, index) => (
               <div key={teacher._id} className="glass-card p-6 border-slate-800/40 hover:border-indigo-500/20 transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-6">
                     <div className="text-3xl font-black text-slate-800 tabular-nums w-8">
                       {index + 1}
                     </div>
                     <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center font-black text-2xl text-indigo-400">
                        {teacher.name.charAt(0)}
                     </div>
                     <div>
                        <div className="text-xl font-black text-slate-100 group-hover:text-glow transition-all">{teacher.name}</div>
                        <div className="flex items-center gap-3 mt-1">
                           <span className="text-xs text-slate-500 flex items-center gap-1"><School size={10} /> {teacher.schoolName || 'Global'}</span>
                        </div>
                     </div>
                  </div>
                  
                  <div className="flex items-center gap-12 text-right">
                     <div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Content Creation</div>
                        <div className="flex items-center gap-4">
                           <div className="flex items-center gap-1.5">
                              <Zap size={14} className="text-yellow-400" />
                              <span className="text-lg font-black text-slate-200">{teacher.quizCount}</span>
                              <span className="text-[10px] text-slate-500 font-bold uppercase pt-1">Quizzes</span>
                           </div>
                           <div className="flex items-center gap-1.5">
                              <Target size={14} className="text-rose-400" />
                              <span className="text-lg font-black text-slate-200">{teacher.missionCount}</span>
                              <span className="text-[10px] text-slate-500 font-bold uppercase pt-1">Missions</span>
                           </div>
                        </div>
                     </div>
                     <ChevronRight size={20} className="text-slate-700 group-hover:text-indigo-400 transition-all" />
                  </div>
               </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Performance;
