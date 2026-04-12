import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronRight } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { User } from '../../types';

const StudentManagement = () => {
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [gradeFilter, setGradeFilter] = useState<string>('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data } = await api.get('/teachers/students');
      setStudents(data);
    } catch (error) {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(s => 
    (s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase())) &&
    (gradeFilter === '' || s.assignedClass === gradeFilter)
  );

  return (
    <div className="space-y-8 p-4 pt-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter italic">Student <span className="text-blue-500">Directory</span></h2>
          <p className="text-xs text-slate-500 uppercase font-black tracking-widest mt-1">Monitor and manage academic performance</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
              <input 
                type="text" 
                placeholder="Search students..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-slate-900 border border-white/[0.05] rounded-xl py-2.5 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all w-64"
              />
           </div>
           <select 
             value={gradeFilter}
             onChange={(e) => setGradeFilter(e.target.value)}
             className="bg-slate-900 border border-white/[0.05] rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all"
           >
              <option value="">All Grades</option>
              {['6', '7', '8', '9', '10', '11', '12'].map(g => (
                <option key={g} value={g}>Grade {g}</option>
              ))}
           </select>
           
           <button 
             onClick={() => toast.success('Registration link copied to clipboard!')}
             className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95"
           >
              Add Student
           </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => <div key={i} className="glass-card h-40 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <motion.div
                key={student._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-6 border-white/[0.05] hover:border-blue-500/30 transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-white/10 p-1 flex items-center justify-center overflow-hidden">
                    {student.avatar ? (
                      <img src={student.avatar.startsWith('http') ? student.avatar : `https://gamified-environmental-education-w0n5.onrender.com${student.avatar}`} className="w-full h-full rounded-xl object-cover" alt="" />
                    ) : (
                      <span className="text-xl font-black text-blue-500 italic">{student.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="flex-grow min-w-0">
                     <h3 className="font-bold text-white truncate">{student.name}</h3>
                     <p className="text-[10px] text-slate-500 truncate uppercase tracking-widest font-black">{student.email}</p>
                  </div>
                  <ChevronRight size={16} className="text-slate-700 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                   <div className="p-3 bg-white/[0.02] border border-white/[0.05] rounded-xl">
                      <p className="text-[9px] font-black text-slate-600 uppercase mb-1">Current Level</p>
                      <p className="text-lg font-black text-white italic">Lvl {student.level}</p>
                   </div>
                   <div className="p-3 bg-white/[0.02] border border-white/[0.05] rounded-xl">
                      <p className="text-[9px] font-black text-slate-600 uppercase mb-1">Total Impact</p>
                      <p className="text-lg font-black text-blue-400 italic">{student.xp} XP</p>
                   </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mb-6 border border-white/[0.05]">
                <Search className="text-slate-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white">No students found</h3>
              <p className="text-sm text-slate-500 mt-2 max-w-xs px-4">
                We couldn't find any students matching your criteria or assigned to your school.
              </p>
              <button 
                onClick={fetchStudents}
                className="mt-8 text-blue-500 font-bold text-sm hover:underline"
              >
                Refresh Student List
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
