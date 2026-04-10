import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, CheckCircle, XCircle, Clock, 
  Zap, RefreshCcw, 
  Trash2, ShieldCheck
} from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import MissionModal from '../../components/Teacher/MissionModal';
import { Submission, Mission } from '../../types';

const EnvironmentControl = () => {
  const [activeTab, setActiveTab] = useState('approvals');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Modal State
  const [showMissionModal, setShowMissionModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'approvals') {
        const { data } = await api.get('/submissions');
        setSubmissions(data);
      } else {
        const { data } = await api.get('/missions');
        setMissions(data);
      }
    } catch (error) {
      toast.error(`Failed to load ${activeTab}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, status: 'Approved' | 'Rejected') => {
    setProcessingId(id);
    try {
      await api.put(`/submissions/${id}`, { status });
      toast.success(`Submission ${status === 'Approved' ? 'Approved! XP Awarded.' : 'Rejected.'}`);
      setSubmissions(prev => prev.filter(s => s._id !== id));
    } catch (error) {
      toast.error('Action failed. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  const tabs = [
    { id: 'approvals', label: 'Pending Approvals', icon: ShieldCheck },
    { id: 'missions', label: 'Eco Missions', icon: Zap },
  ];

  return (
    <div className="space-y-8 relative p-4 pt-24">
      <AnimatePresence>
        {showMissionModal && (
          <MissionModal 
            onClose={() => setShowMissionModal(false)} 
            onSuccess={fetchData} 
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter italic">Eco <span className="text-emerald-500">System</span></h2>
          <p className="text-xs text-slate-500 uppercase font-black tracking-widest mt-1">Manage missions and sustainability impact</p>
        </div>

        <div className="flex items-center gap-3">
           <div className="flex items-center bg-slate-900 shadow-inner p-1 rounded-2xl border border-white/[0.05]">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    activeTab === tab.id ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' : 'text-slate-500 hover:text-slate-200'
                  }`}
                >
                  <tab.icon size={14} />
                  {tab.label}
                </button>
              ))}
           </div>
           
           {activeTab === 'missions' && (
             <button 
               onClick={() => setShowMissionModal(true)}
               className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl transition-all shadow-lg shadow-emerald-500/20"
             >
                <Plus size={18} /> New Mission
             </button>
           )}
           
           {activeTab === 'approvals' && (
             <button onClick={fetchData} className="p-3 bg-slate-900 border border-white/[0.05] rounded-xl text-slate-500 hover:text-emerald-400 transition-colors">
                <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
             </button>
           )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3].map(i => <div key={i} className="glass-card h-80 animate-pulse" />)}
          </div>
        ) : activeTab === 'approvals' ? (
          <motion.div 
            key="approvals" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {submissions.map((sub) => (
              <motion.div key={sub._id} layout className="glass-card flex flex-col group overflow-hidden border-white/[0.05]">
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                  <img 
                    src={`http://localhost:5000/${sub.image}`} 
                    alt="Proof" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 px-2 py-1 bg-emerald-500 text-slate-950 text-[10px] font-black rounded uppercase">Proof</div>
                </div>

                <div className="p-6 flex-grow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full border border-slate-700 overflow-hidden flex items-center justify-center bg-slate-900 shadow-inner">
                      {sub.userId?.avatar ? (
                        <img 
                          src={sub.userId.avatar.startsWith('http') ? sub.userId.avatar : `http://localhost:5000${sub.userId.avatar}`} 
                          className="w-full h-full object-cover" 
                          alt="" 
                        />
                      ) : (
                        <span className="text-xs font-black text-emerald-500 italic">{sub.userId?.name?.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-100">{sub.userId?.name}</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Level {sub.userId?.level || 1} Explorer</p>
                    </div>
                  </div>
                  <h3 className="text-md font-bold text-emerald-400 mb-2 flex items-center gap-2">
                    <Zap size={16} /> {sub.missionId?.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 line-clamp-2 italic leading-relaxed">"{sub.missionId?.description}"</p>
                </div>

                <div className="p-4 flex gap-3 border-t border-white/[0.05] bg-white/[0.02]">
                  <button
                    onClick={() => handleAction(sub._id, 'Rejected')}
                    disabled={processingId === sub._id}
                    className="flex-1 py-3 bg-slate-950 hover:bg-red-500/10 text-slate-500 hover:text-red-500 font-bold rounded-xl border border-white/[0.05] transition-all text-xs flex items-center justify-center gap-2"
                  >
                    <XCircle size={14} /> Reject
                  </button>
                  <button
                    onClick={() => handleAction(sub._id, 'Approved')}
                    disabled={processingId === sub._id}
                    className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl transition-all text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                  >
                    {processingId === sub._id ? <div className="w-3 h-3 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" /> : <><CheckCircle size={14} /> Approve</>}
                  </button>
                </div>
              </motion.div>
            ))}
            {submissions.length === 0 && (
              <div className="col-span-full py-20 text-center glass-card border-dashed">
                <Clock size={48} className="mx-auto text-slate-800 mb-4" />
                <h3 className="text-xl font-bold text-slate-600">No submissions pending</h3>
                <p className="text-xs text-slate-600">Great job! All student proofs have been reviewed.</p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="missions" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {missions.map((mission) => (
              <div key={mission._id} className="glass-card p-6 border-white/[0.05] group hover:border-emerald-500/30 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                     <Zap size={20} />
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button className="p-2 text-slate-500 hover:text-red-400"><Trash2 size={16} /></button>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{mission.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-6">{mission.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-white/[0.05]">
                   <span className="text-[10px] font-black uppercase text-emerald-400 tracking-widest">Reward: {mission.points} XP</span>
                   <span className="text-[10px] text-slate-600 font-bold uppercase">{mission.gradeLevel} Grade</span>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnvironmentControl;
