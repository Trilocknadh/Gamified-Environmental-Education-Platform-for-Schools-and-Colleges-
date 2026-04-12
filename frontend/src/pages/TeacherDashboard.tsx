import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, XCircle, Clock, Search, ExternalLink, 
  User, Shield, Zap, Filter, RefreshCcw, Book, HelpCircle, LayoutGrid, Users
} from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

// Sub-components
import MaterialsTab from '../components/Teacher/MaterialsTab';
import QuizzesTab from '../components/Teacher/QuizzesTab';
import MissionsTab from '../components/Teacher/MissionsTab';
import StudentsTab from '../components/Teacher/StudentsTab';

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState('reviews');
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    if (activeTab === 'reviews') {
      fetchSubmissions();
    }
  }, [activeTab]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/submissions');
      setSubmissions(data);
    } catch (error) {
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, status) => {
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
    { id: 'reviews', label: 'Reviews', icon: <Shield size={18} />, color: 'emerald' },
    { id: 'resources', label: 'Resources', icon: <Book size={18} />, color: 'blue' },
    { id: 'quizzes', label: 'Quizzes', icon: <HelpCircle size={18} />, color: 'violet' },
    { id: 'missions', label: 'Missions', icon: <Zap size={18} />, color: 'amber' },
    { id: 'students', label: 'Students', icon: <Users size={18} />, color: 'rose' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'reviews':
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Mission Submissions</h2>
              <div className="flex items-center gap-3">
                <button 
                  onClick={fetchSubmissions}
                  className="p-2 bg-slate-800/50 hover:bg-slate-800 text-slate-400 rounded-lg border border-slate-700/50 transition-colors"
                >
                   <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
                </button>
                <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/20">
                  {submissions.length} Pending
                </span>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => <div key={i} className="glass-card h-80 animate-pulse" />)}
              </div>
            ) : submissions.length === 0 ? (
              <div className="text-center py-20 glass-card bg-slate-900/10 border-dashed">
                <Clock size={48} className="mx-auto text-slate-700 mb-4" />
                <h3 className="text-xl font-bold text-slate-500">All clear!</h3>
                <p className="text-xs text-slate-600">No pending submissions to review right now.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence>
                  {submissions.map((sub) => (
                    <motion.div
                      key={sub._id} layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="glass-card flex flex-col group overflow-hidden"
                    >
                      <div className="relative aspect-video overflow-hidden bg-slate-950">
                        <img 
                          src={`https://gamified-environmental-education-w0n5.onrender.com/${sub.image}`} 
                          alt="Proof" 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-3 left-3 px-2 py-1 bg-emerald-500 text-slate-950 text-[10px] font-black rounded uppercase">Proof</div>
                      </div>

                      <div className="p-5 flex-grow">
                        <div className="flex items-center gap-3 mb-4">
                          <img src={sub.userId.avatar} className="w-8 h-8 rounded-full border border-slate-700" alt="Avatar" />
                          <div>
                             <p className="text-xs font-bold text-slate-100">{sub.userId.name}</p>
                             <p className="text-[10px] text-slate-500">{sub.userId.email}</p>
                          </div>
                        </div>
                        <h3 className="text-md font-bold text-emerald-400 mb-1 flex items-center gap-2">
                          <Zap size={14} /> {sub.missionId.title}
                        </h3>
                        <p className="text-[10px] text-slate-400 line-clamp-2 italic">"{sub.missionId.description}"</p>
                      </div>

                      <div className="p-4 flex gap-3 border-t border-slate-800">
                        <button
                          onClick={() => handleAction(sub._id, 'Rejected')}
                          disabled={processingId === sub._id}
                          className="flex-1 py-2 bg-slate-900 hover:bg-red-500/10 text-slate-500 hover:text-red-500 font-bold rounded-lg border border-slate-800 transition-all text-xs flex items-center justify-center gap-2"
                        >
                          <XCircle size={14} /> Reject
                        </button>
                        <button
                          onClick={() => handleAction(sub._id, 'Approved')}
                          disabled={processingId === sub._id}
                          className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-all text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10"
                        >
                          {processingId === sub._id ? <div className="w-3 h-3 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" /> : <><CheckCircle size={14} /> Approve</>}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        );
      case 'resources': return <MaterialsTab />;
      case 'quizzes': return <QuizzesTab />;
      case 'missions': return <MissionsTab />;
      case 'students': return <StudentsTab />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1d] p-4 md:p-8 pt-24 text-slate-200">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div>
              <div className="flex items-center gap-2 text-emerald-400 font-black text-xs uppercase tracking-[0.2em] mb-2 bg-emerald-500/5 border border-emerald-500/20 w-fit px-3 py-1 rounded-full">
                 <Shield size={14} /> Teacher Command Center
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-glow tracking-tighter">
                Control <span className="text-emerald-500">Panel</span>
              </h1>
           </div>
           
           {/* Tab Navigation */}
           <div className="flex flex-wrap items-center bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800 shadow-2xl">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300
                    ${activeTab === tab.id 
                      ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 translate-y-[-1px]' 
                      : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800/50'}
                  `}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
           </div>
        </div>

        {/* Global Stats or Quick Info (Optional) */}

        {/* Dynamic Content */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
           {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
