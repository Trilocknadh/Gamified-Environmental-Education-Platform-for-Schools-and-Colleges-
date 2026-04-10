import React, { useState, useEffect } from 'react';
import { MessageSquare, User, Mail, Calendar, CheckCircle, Clock, Search, Filter } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const StudentFeedback = () => {
  const [feedback, setFeedback] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const { data } = await api.get('/feedback');
      setFeedback(data);
    } catch (error) {
      toast.error('Failed to load feedback logs');
    } finally {
      setLoading(false);
    }
  };

  const filteredFeedback = feedback.filter(item => {
    const matchesSearch = 
      item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.userId?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'All' || item.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const { data } = await api.patch(`/feedback/${id}`, { status: newStatus });
      setFeedback(prev => prev.map(f => f._id === id ? data : f));
      toast.success(`Marked as ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return (
    <div className="p-8 space-y-6 pt-24 animate-pulse">
       <div className="h-10 bg-slate-800 w-48 rounded-xl" />
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-64 bg-slate-800/50 rounded-3xl" />)}
       </div>
    </div>
  );

  return (
    <div className="space-y-10 p-4 pt-24 pb-20 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter italic flex items-center gap-3">
             Student <span className="text-blue-500">Inbox</span>
             <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          </h2>
          <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.3em] mt-2">Manage complaints and suggestions</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input 
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-900 border border-white/[0.05] rounded-2xl pl-12 pr-6 py-3.5 text-sm text-white focus:outline-none focus:border-blue-500/50 w-full md:w-80 transition-all font-bold"
              />
           </div>
           
           <div className="flex bg-slate-900 p-1 rounded-2xl border border-white/[0.05]">
              {['All', 'Pending', 'Resolved'].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${filterStatus === s ? 'bg-blue-500 text-slate-950 shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-white'}`}
                >
                  {s}
                </button>
              ))}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredFeedback.map((item, idx) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: idx * 0.05 }}
              key={item._id}
              className="glass-card flex flex-col group border-white/[0.05] hover:border-blue-500/20 transition-all duration-500"
            >
              {/* Header */}
              <div className="p-8 border-b border-white/[0.05] relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                 <div className="flex justify-between items-start mb-4">
                    <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${item.status === 'Pending' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}>
                       {item.status === 'Pending' ? <Clock size={10} /> : <CheckCircle size={10} />}
                       {item.status}
                    </div>
                    <span className="text-[10px] font-black text-slate-600 flex items-center gap-1">
                       <Calendar size={12} /> {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                 </div>
                 <h3 className="text-xl font-black text-white italic tracking-tight">{item.subject}</h3>
              </div>

              {/* Body */}
              <div className="p-8 flex-grow space-y-6">
                 <p className="text-slate-400 text-sm leading-relaxed font-medium line-clamp-4 italic">
                    "{item.message}"
                 </p>
                 
                 <div className="pt-6 border-t border-white/[0.05] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-blue-400 border border-white/[0.05] group-hover:border-blue-500/20 transition-all font-black text-lg">
                          {item.userId?.name.charAt(0)}
                       </div>
                       <div>
                          <p className="text-xs font-black text-white">{item.userId?.name}</p>
                          <p className="text-[10px] font-bold text-slate-500 flex items-center gap-1"><Mail size={10} /> {item.userId?.email}</p>
                       </div>
                    </div>
                    
                    {item.status === 'Pending' ? (
                      <button 
                        onClick={() => handleStatusUpdate(item._id, 'Resolved')}
                        className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-slate-950 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-emerald-500/20 hover:border-emerald-500"
                      >
                        Resolve
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleStatusUpdate(item._id, 'Pending')}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/5"
                      >
                        Reopen
                      </button>
                    )}
                 </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>


        {filteredFeedback.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center space-y-4">
             <div className="w-20 h-20 rounded-3xl bg-slate-900 flex items-center justify-center text-slate-700 border border-dashed border-slate-800">
                <MessageSquare size={40} />
             </div>
             <div>
                <h4 className="text-xl font-bold text-slate-400 italic">No feedback entries found</h4>
                <p className="text-sm text-slate-600 font-bold uppercase tracking-widest mt-1">Inbox is clear!</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentFeedback;
