import React, { useState } from 'react';
import { X, Plus, Save, Zap, Globe } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const MissionModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    points: 100,
    gradeLevel: '10'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/missions', formData);
      toast.success('Eco Mission launched!');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Failed to launch mission');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl glass-card border-white/[0.05] shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-8 border-b border-white/[0.05] flex items-center justify-between">
           <div>
              <h2 className="text-2xl font-black text-white tracking-tight italic">Launch <span className="text-emerald-500">Eco Mission</span></h2>
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Deploy a new environmental challenge</p>
           </div>
           <button onClick={onClose} className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2 col-span-2">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Mission Title</label>
                <input 
                  type="text" required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-slate-950/50 border border-white/[0.05] rounded-xl px-4 py-3 text-white focus:border-emerald-500/50 outline-none font-bold"
                  placeholder="e.g. Recycling Awareness Drive"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Target Grade</label>
                <select 
                  value={formData.gradeLevel}
                  onChange={(e) => setFormData({...formData, gradeLevel: e.target.value})}
                  className="w-full bg-slate-950/50 border border-white/[0.05] rounded-xl px-4 py-3 text-white focus:border-emerald-500/50 outline-none font-bold"
                >
                  {['6', '7', '8', '9', '10', '11', '12', 'BTech', 'Degree'].map(g => (
                    <option key={g} value={g}>Level {g}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">XP Reward</label>
                <input 
                  type="number" required
                  value={formData.points}
                  onChange={(e) => setFormData({...formData, points: e.target.value})}
                  className="w-full bg-slate-950/50 border border-white/[0.05] rounded-xl px-4 py-3 text-white focus:border-emerald-500/50 outline-none font-bold text-center"
                  min="1"
                />
              </div>

              <div className="space-y-2 col-span-2">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Description & Requirements</label>
                <textarea 
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-slate-950/50 border border-white/[0.05] rounded-xl px-4 py-3 text-white focus:border-emerald-500/50 outline-none font-medium h-32"
                  placeholder="Explain the mission steps and what proof should be submitted..."
                />
              </div>
           </div>

           <div className="flex justify-end gap-4">
              <button 
                type="button" onClick={onClose}
                className="px-8 py-3 text-slate-500 font-bold hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="px-10 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl transition-all shadow-xl shadow-emerald-500/20 flex items-center gap-3 disabled:opacity-50"
              >
                {loading ? <div className="w-5 h-5 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" /> : <><Zap size={20} /> Launch Mission</>}
              </button>
           </div>
        </form>
      </div>
    </div>
  );
};

export default MissionModal;
