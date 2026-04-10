import React, { useState } from 'react';
import { X, Save, User, Phone, MapPin } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';

const AdminProfileModal = ({ onClose }) => {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phoneNumber: user?.phoneNumber || '',
    address: user?.address || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put('/auth/profile', formData);
      setUser(data);
      toast.success('Admin identity updated!');
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg glass-card border-indigo-500/20 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-white/[0.05] flex items-center justify-between bg-slate-900">
           <div>
              <h2 className="text-2xl font-black text-white tracking-tight italic">protocol <span className="text-indigo-500">Update</span></h2>
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Manage administrative identity</p>
           </div>
           <button onClick={onClose} className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                <User size={12} /> Admin Full Name
              </label>
              <input 
                type="text" required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-slate-950/50 border border-white/[0.05] rounded-xl px-4 py-3 text-white focus:border-indigo-500/50 outline-none font-bold"
              />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                  <Phone size={12} /> Admin Contact
                </label>
                <input 
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  className="w-full bg-slate-950/50 border border-white/[0.05] rounded-xl px-4 py-3 text-white focus:border-indigo-500/50 outline-none font-bold"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                  <MapPin size={12} /> Command Base Region
                </label>
                <input 
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full bg-slate-950/50 border border-white/[0.05] rounded-xl px-4 py-3 text-white focus:border-indigo-500/50 outline-none font-bold"
                  placeholder="City, Sector"
                />
              </div>
           </div>

           <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl flex items-start gap-3">
              <ShieldCheck size={16} className="text-indigo-500 mt-1 shrink-0" />
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-relaxed">
                Notice: Skill and interest fields are unavailable for the Administrator role. Update the security PIN in System Settings for enhanced protection.
              </p>
           </div>

           <div className="pt-6 border-t border-white/[0.05] flex justify-end gap-4">
              <button 
                type="button" onClick={onClose}
                className="px-6 py-2 text-slate-500 font-bold hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl transition-all shadow-xl shadow-indigo-500/20 flex items-center gap-3 disabled:opacity-50"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <><Save size={18} /> Sync Identity</>}
              </button>
           </div>
        </form>
      </div>
    </div>
  );
};

const ShieldCheck = ({ size, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export default AdminProfileModal;
