import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Leaf, 
  Zap, 
  ChevronRight, 
  Camera, 
  Send, 
  X, 
  Trash2, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Plus,
  History,
  Target
} from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const EcoActivities = () => {
  const [missions, setMissions] = useState<any[]>([]);
  const [mySubmissions, setMySubmissions] = useState<any[]>([]);
  const [selectedMission, setSelectedMission] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'available' | 'my-missions'>('available');

  // Submission State
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [missionsRes, submissionsRes] = await Promise.all([
        api.get('/missions'),
        api.get('/submissions/my-submissions')
      ]);
      setMissions(missionsRes.data);
      setMySubmissions(submissionsRes.data);
    } catch (error) {
      toast.error('Failed to fetch mission data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSubmission = (mission: any) => {
    if (mission.completed) {
      toast.success('You have already completed this mission! Impact point awarded.', { icon: '🌱' });
      return;
    }
    setSelectedMission(mission);
    setImage(null);
    setPreviewUrl(null);
    setDescription('');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        return toast.error('File size must be less than 5MB');
      }
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmitMission = async () => {
    if (!image) return toast.error('Please upload photo proof!');
    if (!description.trim()) return toast.error('Please add a short description!');
    
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('missionId', selectedMission._id);
    formData.append('image', image);
    formData.append('description', description); // Controller might need to be updated to handle this, but adding it for UI completeness

    try {
      await api.post('/submissions', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Mission submitted for review!', { icon: '🚀' });
      setSelectedMission(null);
      fetchData(); // Refresh submissions
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Rejected': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return <CheckCircle size={14} />;
      case 'Rejected': return <AlertCircle size={14} />;
      default: return <Clock size={14} />;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">Eco Missions</h1>
          <p className="text-slate-400">Transform awareness into action and track your environmental impact.</p>
        </div>
        <div className="flex bg-slate-800/40 p-1 rounded-2xl border border-slate-700/50 w-full md:w-auto">
          <button 
            onClick={() => setActiveTab('available')}
            className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'available' ? 'bg-emerald-500 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Target size={16} /> Available
          </button>
          <button 
            onClick={() => setActiveTab('my-missions')}
            className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'my-missions' ? 'bg-emerald-500 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <History size={16} /> My Missions
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
           <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
           <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Accessing Mission Log...</p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {activeTab === 'available' ? (
            <motion.div 
              key="available"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {missions.map((mission, idx) => (
                <motion.div
                  key={mission._id}
                  whileHover={{ y: -8 }}
                  className={`glass-card p-8 flex flex-col group transition-all relative overflow-hidden ${
                    mission.completed 
                    ? 'border-emerald-500/40 bg-emerald-500/10 cursor-default' 
                    : 'hover:border-emerald-500/30 cursor-pointer bg-emerald-500/5'
                  }`}
                  onClick={() => handleOpenSubmission(mission)}
                >
                  {mission.completed && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                  )}
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-emerald-500/10 rounded-2xl group-hover:bg-emerald-500/20 transition-colors">
                      <Leaf className="text-emerald-400 w-6 h-6" />
                    </div>
                    <div className="px-4 py-1.5 bg-slate-900/80 rounded-full text-xs font-black text-emerald-400 border border-emerald-500/20 uppercase tracking-widest">
                      +{mission.points} XP
                    </div>
                  </div>
                  <h3 className="text-xl font-black mb-3 text-slate-100 group-hover:text-emerald-400 transition-colors tracking-tight">
                    {mission.title}
                  </h3>
                  <p className="text-slate-400 text-sm mb-8 flex-grow leading-relaxed italic">
                    "{mission.description}"
                  </p>
                  <div className="flex items-center text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] gap-2 mt-auto group-hover:translate-x-2 transition-transform">
                    {mission.completed ? (
                      <span className="flex items-center gap-2"><CheckCircle size={14} /> Mission Accomplished</span>
                    ) : (
                      <>Start Mission <ChevronRight size={14} /></>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="my-missions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {mySubmissions.length === 0 ? (
                <div className="py-20 text-center glass-card border-dashed">
                   <Clock className="mx-auto text-slate-600 mb-4" size={48} />
                   <h3 className="text-xl font-bold text-slate-400">No mission history yet</h3>
                   <p className="text-slate-500 mt-1">Start your first eco-activity to earn badges!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mySubmissions.map((sub) => (
                    <div key={sub._id} className="glass-card overflow-hidden group">
                       <div className="relative aspect-video overflow-hidden">
                          <img src={sub.image.startsWith('http') ? sub.image : `http://localhost:5000/${sub.image}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Proof" />
                          <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 backdrop-blur-md border ${getStatusColor(sub.status)}`}>
                             {getStatusIcon(sub.status)} {sub.status}
                          </div>
                       </div>
                       <div className="p-6">
                          <h4 className="font-bold text-slate-100 mb-1">{sub.missionId?.title || 'Unknown Mission'}</h4>
                          <p className="text-xs text-slate-500 font-medium">Points: {sub.missionId?.points || 0} XP</p>
                          <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center">
                             <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{new Date(sub.createdAt).toLocaleDateString()}</span>
                             {sub.status === 'Approved' && <CheckCircle size={16} className="text-emerald-400" />}
                          </div>
                       </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Submission Modal */}
      <AnimatePresence>
        {selectedMission && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
              onClick={() => setSelectedMission(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-card w-full max-w-xl p-8 relative z-10 overflow-hidden shadow-2xl border-emerald-500/20"
            >
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-500/10 rounded-2xl">
                    <Camera className="text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white italic">Submit Proof</h2>
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{selectedMission.title}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedMission(null)} className="p-2 text-slate-500 hover:text-white transition-colors">
                  <X />
                </button>
              </div>

              <div className="space-y-6">
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageChange}
                />

                {!previewUrl ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full aspect-video rounded-3xl border-2 border-dashed border-slate-700 hover:border-emerald-500/50 bg-slate-900/50 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all group"
                  >
                    <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Plus size={32} className="text-slate-500 group-hover:text-emerald-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-slate-300 font-bold italic">Upload Mission Proof</p>
                      <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mt-1">Images only (Max 5MB)</p>
                    </div>
                  </div>
                ) : (
                  <div className="relative aspect-video rounded-3xl overflow-hidden border border-emerald-500/30 shadow-2xl group">
                    <img src={previewUrl} className="w-full h-full object-cover" alt="Proof" />
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <button 
                         onClick={() => {setImage(null); setPreviewUrl(null);}}
                         className="p-4 bg-red-500 text-white rounded-full hover:scale-110 transition-transform shadow-lg"
                       >
                         <Trash2 size={24} />
                       </button>
                    </div>
                  </div>
                )}

                <div>
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Action Description</label>
                   <textarea 
                     value={description}
                     onChange={(e) => setDescription(e.target.value)}
                     placeholder="What eco-impact did you make?..."
                     className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl p-4 text-slate-200 focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-700 min-h-[100px]"
                   />
                </div>
                
                <button
                  onClick={handleSubmitMission}
                  disabled={isSubmitting || !image || !description.trim()}
                  className={`w-full h-16 rounded-2xl font-black transition-all shadow-xl flex items-center justify-center gap-3 active:scale-[0.98] ${
                    !image || isSubmitting || !description.trim()
                      ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700' 
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" />
                  ) : (
                    <>Submit Mission <Send size={18} fill="currentColor" /></>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EcoActivities;
