import React, { useState, useEffect } from 'react';
import { Plus, Zap, Shield, Trash2, Camera, MapPin, Gift } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const MissionsTab = () => {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    rewardXP: 100,
    difficulty: 'Intermediate',
    type: 'Eco Action'
  });

  useEffect(() => {
    fetchMissions();
  }, []);

  const fetchMissions = async () => {
    try {
      const { data } = await api.get('/missions');
      setMissions(data);
    } catch (error) {
      toast.error('Failed to fetch missions');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/missions', formData);
      toast.success('Mission created successfully!');
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        rewardXP: 100,
        difficulty: 'Intermediate',
        type: 'Eco Action'
      });
      fetchMissions();
    } catch (error) {
      toast.error('Failed to create mission');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Eco Activities & Missions</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/10"
        >
          {showForm ? 'Cancel' : <><Plus size={18} /> New Mission</>}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Mission Title</label>
                <input 
                  type="text" required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none font-bold"
                  placeholder="e.g. Tree Plantation Drive"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Mission Type</label>
                <input 
                  type="text" required
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none"
                  placeholder="e.g. Recycling, Quiz, Field Trip"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Difficulty</label>
                <select 
                  value={formData.difficulty}
                  onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none"
                >
                  {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Reward XP</label>
                <input 
                  type="number" required
                  value={formData.rewardXP}
                  onChange={(e) => setFormData({...formData, rewardXP: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none"
                  placeholder="e.g. 100"
                  min="1"
                />
              </div>
           </div>
           <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Description / Instructions</label>
              <textarea 
                required
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none h-24"
                placeholder="Examine the steps needed to complete this mission..."
              />
           </div>
          <button type="submit" className="w-full bg-emerald-500 text-slate-950 font-black py-4 rounded-xl hover:bg-emerald-400 transition-all flex items-center justify-center gap-2">
            <Zap size={20} /> Launch Mission
          </button>
        </form>
      )}

      {/* Mission List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          [1,2].map(i => <div key={i} className="glass-card h-40 animate-pulse" />)
        ) : missions.length === 0 ? (
          <div className="col-span-2 text-center py-20 text-slate-600 italic">No missions launched yet. Create one to engage students!</div>
        ) : (
          missions.map((m) => (
            <div key={m._id} className="glass-card overflow-hidden group hover:border-emerald-500/30 transition-all">
              <div className="p-5 bg-gradient-to-br from-emerald-500/5 to-transparent flex flex-col gap-4">
                <div className="flex justify-between items-start">
                   <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl">
                         <Shield size={22} />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-lg group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{m.title}</h3>
                        <span className="text-[10px] text-emerald-500 font-bold border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase">{m.difficulty}</span>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-xs font-bold text-emerald-400">+{m.rewardXP} XP</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest">{m.type}</p>
                   </div>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 italic">"{m.description}"</p>
                
                <div className="flex items-center gap-4 mt-2">
                   <div className="flex items-center gap-1.5 text-[10px] text-slate-500 border border-slate-800 px-3 py-1 rounded-lg">
                      <Camera size={12} /> Photo Required
                   </div>
                   <div className="flex items-center gap-1.5 text-[10px] text-slate-500 border border-slate-800 px-3 py-1 rounded-lg">
                      <Gift size={12} /> Manual Approval
                   </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MissionsTab;
