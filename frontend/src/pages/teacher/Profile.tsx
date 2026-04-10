import { useState, useRef } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { 
  Mail, School, Shield, 
  Phone, MapPin, Award, 
  LogOut, Camera, BookOpen,
  Clock, Edit3, Briefcase
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { AnimatePresence } from 'framer-motion';
import TeacherProfileModal from '../../components/Teacher/TeacherProfileModal';

const TeacherProfile = () => {
  const { user, updateUser, logout } = useAuthStore();
  const [showEditModal, setShowEditModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

          const toastId = toast.loading('Upgrading faculty identity...');
          try {
            const { data } = await api.put('/users/profile/avatar', formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
            });
            updateUser({ ...user, avatar: data.avatar });
            toast.success('Avatar updated! Looking professional.', { id: toastId });
          } catch (error: any) {
            toast.error(error.response?.data?.message || 'Upload failed', { id: toastId });
          }
        }}
      />

      <AnimatePresence>
        {showEditModal && (
          <TeacherProfileModal onClose={() => setShowEditModal(false)} />
        )}
      </AnimatePresence>

      {/* Profile Header Layer */}
      <div className="glass-card overflow-hidden border-white/[0.05] relative group">
        <div className="h-56 bg-gradient-to-br from-slate-900 via-blue-900/40 to-slate-900 relative">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
           <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
        </div>
        
        <div className="px-10 pb-12 relative">
          <div className="flex flex-col md:flex-row items-end gap-10 -mt-24">
            <div className="relative group/avatar">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-48 h-48 rounded-[2rem] border-[8px] border-[#0a0f1d] overflow-hidden shadow-2xl bg-slate-900 relative cursor-pointer"
              >
                {user.avatar ? (
                  <img 
                    src={user.avatar.startsWith('http') ? user.avatar : `http://localhost:5000${user.avatar}`} 
                    className="w-full h-full object-cover" 
                    alt="Avatar" 
                  />
                ) : (
                  <div className="w-full h-full bg-blue-500/10 flex items-center justify-center text-blue-500 text-5xl font-black italic">
                    {user.name.charAt(0)}
                  </div>
                )}
                <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-all backdrop-blur-sm">
                   <div className="p-3 bg-blue-500 rounded-2xl text-slate-950">
                      <Camera size={24} />
                   </div>
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-slate-950 p-2.5 rounded-2xl border-4 border-[#0a0f1d] shadow-xl">
                 <Shield size={20} />
              </div>
            </div>

            <div className="flex-grow pb-4">
              <div className="flex flex-wrap items-center gap-4 mb-3">
                <h1 className="text-5xl font-black text-white tracking-tighter italic">{user.name}</h1>
                <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                   <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">EcoEdu Faculty</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-6 text-slate-400 font-bold text-sm">
                <div className="flex items-center gap-2 bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/[0.05]">
                  <Mail size={16} className="text-blue-500" /> {user.email}
                </div>
                {user.phoneNumber && (
                  <div className="flex items-center gap-2 bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/[0.05]">
                    <Phone size={16} className="text-emerald-500" /> {user.phoneNumber}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4 pb-4">
               <button 
                 onClick={() => setShowEditModal(true)}
                 className="flex items-center gap-2 px-8 py-3.5 bg-blue-500 hover:bg-blue-400 text-slate-950 font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-blue-500/20 group/btn"
               >
                 <Edit3 size={16} className="group-hover/btn:rotate-12 transition-transform" /> Update Profile
               </button>
               <button 
                 onClick={logout}
                 className="p-3.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl border border-red-500/20 transition-all"
                 title="Logout"
               >
                 <LogOut size={20} />
               </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Essential Info */}
        <div className="lg:col-span-4 space-y-6">
           <div className="glass-card p-8 border-white/[0.05]">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-8">Base Information</h3>
              
              <div className="space-y-6">
                 <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-500/5 rounded-2xl text-blue-400 border border-blue-500/10">
                       <School size={20} />
                    </div>
                    <div>
                        <p className="text-[9px] uppercase font-black text-slate-600 tracking-widest mb-1">Current Faculty Institute</p>
                        <p className="text-md font-bold text-slate-200 leading-tight">{user.schoolName || 'Faculty affiliation not yet verified'}</p>
                    </div>
                 </div>

                 <div className="flex items-start gap-4">
                    <div className="p-3 bg-emerald-500/5 rounded-2xl text-emerald-400 border border-emerald-500/10">
                       <MapPin size={20} />
                    </div>
                    <div>
                       <p className="text-[9px] uppercase font-black text-slate-600 tracking-widest mb-1">Mailing Address</p>
                       <p className="text-md font-bold text-slate-200 leading-tight">{user.address || 'Address Not Provided'}</p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="glass-card p-8 border-white/[0.05] bg-gradient-to-br from-blue-500/5 to-transparent">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Credentials</h3>
                <Award className="text-blue-400" size={18} />
              </div>
              <div className="space-y-3">
                 {user.badges?.map(badge => (
                   <div key={badge} className="p-3 bg-slate-900/50 border border-white/[0.05] rounded-xl text-xs font-bold text-slate-300 flex items-center justify-between">
                      {badge} <Shield size={12} className="text-blue-500" />
                   </div>
                 ))}
                 {(!user.badges || user.badges.length === 0) && (
                   <div className="text-center py-4">
                      <p className="text-[10px] text-slate-600 italic font-medium uppercase">Standard Educator Tier</p>
                   </div>
                 )}
              </div>
           </div>
        </div>
      </div>

      {/* Professional Portfolio - Full width bottom section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-10 mt-8"
      >
        <div className="flex items-center gap-3 mb-10 pb-6 border-b border-white/[0.05]">
            <Briefcase className="text-blue-500" size={24} />
            <h3 className="text-2xl font-black text-white tracking-tight italic">Faculty <span className="text-blue-500">Portfolio</span></h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
          {/* Column 1: Core Credentials */}
          <div className="space-y-8">
             <div className="p-6 bg-slate-900/40 border border-white/[0.05] rounded-3xl group hover:border-blue-500/30 transition-colors">
                <p className="text-[9px] uppercase font-black text-slate-600 tracking-[0.2em] mb-3">Faculty Expertise</p>
                <h4 className="text-xl font-bold text-white flex items-center gap-2">
                   <BookOpen size={16} className="text-blue-400" /> {user.subjectExpertise || 'Generalist'}
                </h4>
             </div>
             <div className="p-6 bg-slate-900/40 border border-white/[0.05] rounded-3xl group hover:border-emerald-500/30 transition-colors">
                <p className="text-[9px] uppercase font-black text-slate-600 tracking-[0.2em] mb-3">Teaching Tenure</p>
                <h4 className="text-xl font-bold text-white flex items-center gap-2">
                   <Clock size={16} className="text-emerald-400" /> {user.yearsOfExperience || 0} <span className="text-xs text-slate-500 uppercase font-black">Years of Impact</span>
                </h4>
             </div>
          </div>

          {/* Column 2: Pedagogical Skills */}
          <div className="space-y-6">
             <div className="flex items-center justify-between mb-2">
               <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                  <Award size={16} className="text-blue-400" /> Pedagogical Skills
               </h3>
               <span className="text-[10px] font-black text-slate-500 bg-slate-950/50 px-2 py-1 rounded-lg">
                  {user.professionalSkills?.length || 0} Specialties
               </span>
             </div>
             <div className="bg-slate-950/30 p-6 rounded-[2.5rem] border border-white/[0.1] min-h-[160px]">
               <div className="flex flex-wrap gap-2.5">
                  {user.professionalSkills && user.professionalSkills.length > 0 ? user.professionalSkills.map((skill: string, idx: number) => (
                    <motion.span 
                      key={idx} 
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="px-4 py-2 bg-blue-500/5 text-blue-400 text-xs font-black rounded-xl border border-blue-500/20"
                    >
                      {skill}
                    </motion.span>
                  )) : (
                    <div className="w-full py-8 text-center text-slate-600 italic text-xs px-4">
                       Educator hasn't listed specific pedagogical skills yet.
                    </div>
                  )}
               </div>
             </div>
          </div>

          {/* Column 3: Intellectual Interests */}
          <div className="space-y-6">
             <div className="flex items-center justify-between mb-2">
               <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                  <BookOpen size={16} className="text-emerald-400" /> Research Interests
               </h3>
               <span className="text-[10px] font-black text-slate-500 bg-slate-950/50 px-2 py-1 rounded-lg">
                 Intellectual Pursuits
               </span>
             </div>
             <div className="bg-slate-950/30 p-6 rounded-[2.5rem] border border-white/[0.1] min-h-[160px]">
               <div className="flex flex-wrap gap-2.5">
                  {user.skillsOfInterest && user.skillsOfInterest.length > 0 ? user.skillsOfInterest.map((interest: string, idx: number) => (
                    <motion.span 
                      key={idx} 
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="px-4 py-2 bg-emerald-500/5 text-emerald-400 text-xs font-black rounded-xl border border-emerald-500/20"
                    >
                      {interest}
                    </motion.span>
                  )) : (
                    <div className="w-full py-8 text-center text-slate-600 italic text-xs px-4">
                       No professional development interests listed.
                    </div>
                  )}
               </div>
             </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="space-y-4 pt-8 border-t border-white/[0.05]">
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Bio & Educational Philosophy</label>
            <div className="p-10 bg-white/[0.02] border border-white/[0.05] rounded-[3rem] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
              <div className="absolute top-6 left-6 text-blue-500/20 font-serif text-8xl">"</div>
              <p className="text-slate-300 leading-relaxed text-xl italic relative z-10 px-12 py-4">
                  {user.aboutMe || "As an educator, I am dedicated to unlocking students' potential through innovative and interactive learning experiences that bridge the gap between theory and environmental action."}
              </p>
              <div className="absolute bottom-6 right-6 text-blue-500/20 font-serif text-8xl rotate-180">"</div>
            </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TeacherProfile;

