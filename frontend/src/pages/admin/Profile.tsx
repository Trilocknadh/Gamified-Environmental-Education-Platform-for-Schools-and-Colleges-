import { useState, useRef } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { 
  Mail, ShieldCheck, 
  Phone, MapPin, 
  LogOut, Camera,
  Shield, Edit3, Settings,
  AlertCircle
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { AnimatePresence, motion } from 'framer-motion';
import AdminProfileModal from '../../components/Admin/AdminProfileModal';
import { useNavigate } from 'react-router-dom';

const AdminProfile = () => {
  const { user, updateUser, logout } = useAuthStore();
  const [showEditModal, setShowEditModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4 pt-24 pb-20">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;

          const formData = new FormData();
          formData.append('avatar', file);

          const toastId = toast.loading('Upgrading protocol identity...');
          try {
            const { data } = await api.put('/users/profile/avatar', formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
            });
            updateUser({ ...user, avatar: data.avatar });
            toast.success('Admin identity updated.', { id: toastId });
          } catch (error: any) {
            toast.error(error.response?.data?.message || 'Upload failed', { id: toastId });
          }
        }}
      />

      <AnimatePresence>
        {showEditModal && (
          <AdminProfileModal onClose={() => setShowEditModal(false)} />
        )}
      </AnimatePresence>

      {/* Admin Identity Layer */}
      <div className="glass-card overflow-hidden border-indigo-500/20 relative group shadow-[0_0_50px_rgba(79,70,229,0.1)]">
        <div className="h-56 bg-gradient-to-br from-[#0c1222] via-[#1e1b4b] to-[#0c1222] relative">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
           <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
        </div>
        
        <div className="px-10 pb-12 relative">
          <div className="flex flex-col md:flex-row items-end gap-10 -mt-24">
            <div className="relative group/avatar">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-48 h-48 rounded-[2rem] border-[8px] border-[#0a0f1d] overflow-hidden shadow-2xl bg-slate-900 relative cursor-pointer group-hover:border-indigo-500/30 transition-all"
              >
                {user.avatar ? (
                  <img 
                    src={user.avatar.startsWith('http') ? user.avatar : `http://localhost:5000${user.avatar}`} 
                    className="w-full h-full object-cover" 
                    alt="Admin Avatar" 
                  />
                ) : (
                  <div className="w-full h-full bg-indigo-500/10 flex items-center justify-center text-indigo-500 text-5xl font-black italic">
                    {user.name.charAt(0)}
                  </div>
                )}
                <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-all backdrop-blur-sm">
                   <div className="p-3 bg-indigo-500 rounded-2xl text-slate-900">
                      <Camera size={24} />
                   </div>
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-indigo-500 text-slate-900 p-2.5 rounded-2xl border-4 border-[#0a0f1d] shadow-xl animate-pulse">
                 <ShieldCheck size={20} />
              </div>
            </div>

            <div className="flex-grow pb-4">
              <div className="flex flex-wrap items-center gap-4 mb-3">
                <h1 className="text-5xl font-black text-white tracking-tighter italic drop-shadow-lg">{user.name}</h1>
                <div className="px-4 py-1.5 bg-indigo-500/20 border border-indigo-500/30 rounded-xl">
                   <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Super Admin Protocol</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-6 text-slate-400 font-bold text-sm">
                <div className="flex items-center gap-2 bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/[0.05]">
                  <Mail size={16} className="text-indigo-400" /> {user.email}
                </div>
                {user.phoneNumber && (
                  <div className="flex items-center gap-2 bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/[0.05]">
                    <Phone size={16} className="text-indigo-400" /> {user.phoneNumber}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4 pb-4">
               <button 
                 onClick={() => setShowEditModal(true)}
                 className="flex items-center gap-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-indigo-500/20 group/btn"
               >
                 <Edit3 size={16} className="group-hover/btn:rotate-12 transition-transform" /> protocol Update
               </button>
               <button 
                 onClick={logout}
                 className="p-3.5 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-2xl border border-rose-500/20 transition-all shadow-lg shadow-rose-500/5"
                 title="System Exit"
               >
                 <LogOut size={20} />
               </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Core Admin Stats & Access */}
        <div className="lg:col-span-12">
            <div className="glass-card p-10 border-indigo-500/10 bg-gradient-to-br from-indigo-500/5 to-transparent">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="flex items-center gap-6">
                     <div className="p-5 bg-indigo-500/10 rounded-[2rem] border border-indigo-500/20 text-indigo-400 shadow-inner">
                        <Shield size={40} />
                     </div>
                     <div>
                        <h3 className="text-3xl font-black text-white tracking-tight italic">System <span className="text-indigo-400">Authority</span></h3>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Full Administrative Privileges • Level 0 Override</p>
                     </div>
                  </div>

                  <div className="flex flex-wrap gap-4">
                      <div className="p-4 bg-slate-900/60 border border-indigo-500/10 rounded-2xl flex items-center gap-4 group hover:border-indigo-500/30 transition-all cursor-pointer">
                         <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-slate-900 transition-all">
                            <MapPin size={20} />
                         </div>
                         <div>
                            <p className="text-[9px] uppercase font-black text-slate-600 tracking-widest">Base Region</p>
                            <p className="text-sm font-bold text-slate-200">{user.address || 'Global Sub-sector'}</p>
                         </div>
                      </div>

                      <div 
                        onClick={() => navigate('/admin/settings')}
                        className="p-4 bg-slate-900/60 border border-indigo-500/10 rounded-2xl flex items-center gap-4 group hover:border-emerald-500/30 transition-all cursor-pointer"
                      >
                         <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-900 transition-all">
                            <Settings size={20} />
                         </div>
                         <div>
                            <p className="text-[9px] uppercase font-black text-slate-600 tracking-widest">Security Protocol</p>
                            <p className="text-sm font-bold text-slate-200 flex items-center gap-2">PIN Verified <AlertCircle size={14} className="text-emerald-500" /></p>
                         </div>
                      </div>
                  </div>
               </div>
            </div>
        </div>

        {/* Note on Admin Role */}
        <div className="lg:col-span-12">
           <div className="p-8 bg-indigo-500/5 border border-indigo-500/10 rounded-[2.5rem] flex items-center gap-8">
              <div className="hidden md:flex w-24 h-24 bg-indigo-600/20 rounded-full items-center justify-center text-indigo-500 animate-pulse">
                  <ShieldCheck size={48} />
              </div>
              <div>
                  <h4 className="text-lg font-black text-indigo-400 italic mb-2">Administrative Responsibilities</h4>
                  <p className="text-slate-400 text-sm leading-relaxed max-w-3xl">
                    As a system administrator, your profile is focused on management and security. Skills, interests, and educational histories are hidden in this view to maintain a professional control-center aesthetic. Use the <strong>Settings</strong> panel to update your secure access PIN and manage platform-wide configurations.
                  </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
