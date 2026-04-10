import React, { useState } from 'react';
import { X, Save, User, Phone, MapPin, School, BookOpen, Clock } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';

const TeacherProfileModal = ({ onClose }) => {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    schoolName: user?.schoolName || '',
    phoneNumber: user?.phoneNumber || '',
    address: user?.address || '',
    subjectExpertise: user?.subjectExpertise || '',
    yearsOfExperience: user?.yearsOfExperience || 0,
    aboutMe: user?.aboutMe || '',
    professionalSkills: user?.professionalSkills || [],
    skillsOfInterest: user?.skillsOfInterest || []
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put('/auth/profile', formData);
      setUser(data);
      toast.success('Professional profile updated!');
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
      <div className="relative w-full max-w-2xl glass-card border-white/[0.05] shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-white/[0.05] flex items-center justify-between bg-slate-900">
           <div>
              <h2 className="text-2xl font-black text-white tracking-tight italic">Update <span className="text-blue-500">Identity</span></h2>
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Refine your professional credentials</p>
           </div>
           <button onClick={onClose} className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                  <User size={12} /> Full Name
                </label>
                <input 
                  type="text" required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-950/50 border border-white/[0.05] rounded-xl px-4 py-3 text-white focus:border-blue-500/50 outline-none font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                  <School size={12} /> Institute Name
                </label>
                <input 
                  type="text"
                  value={formData.schoolName}
                  onChange={(e) => setFormData({...formData, schoolName: e.target.value})}
                  className="w-full bg-slate-950/50 border border-white/[0.05] rounded-xl px-4 py-3 text-white focus:border-blue-500/50 outline-none font-bold"
                  placeholder="e.g. Green Valley University"
                />
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                  <Phone size={12} /> Phone Number
                </label>
                <input 
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  className="w-full bg-slate-950/50 border border-white/[0.05] rounded-xl px-4 py-3 text-white focus:border-blue-500/50 outline-none font-bold"
                  placeholder="+91 7997914015"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                  <MapPin size={12} /> Mailing Address
                </label>
                <input 
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full bg-slate-950/50 border border-white/[0.05] rounded-xl px-4 py-3 text-white focus:border-blue-500/50 outline-none font-bold"
                  placeholder="City, State, Country"
                />
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                  <BookOpen size={12} /> Subject Expertise
                </label>
                <input 
                  type="text"
                  value={formData.subjectExpertise}
                  onChange={(e) => setFormData({...formData, subjectExpertise: e.target.value})}
                  className="w-full bg-slate-950/50 border border-white/[0.05] rounded-xl px-4 py-3 text-white focus:border-blue-500/50 outline-none font-bold"
                  placeholder="e.g. Physics, Math"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                  <Clock size={12} /> Years of Experience
                </label>
                <input 
                  type="number"
                  value={formData.yearsOfExperience}
                  onChange={(e) => setFormData({...formData, yearsOfExperience: parseInt(e.target.value) || 0})}
                  className="w-full bg-slate-950/50 border border-white/[0.05] rounded-xl px-4 py-3 text-white focus:border-blue-500/50 outline-none font-bold"
                  min="0"
                />
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                <Mail size={12} className="text-blue-500" /> Primary Email (Gmail)
              </label>
              <input 
                type="email" readOnly
                value={user?.email}
                className="w-full bg-slate-950/30 border border-white/[0.03] rounded-xl px-4 py-3 text-slate-500 outline-none font-bold cursor-not-allowed"
              />
           </div>

           <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">About & Professional Philosophy</label>
              <textarea 
                rows={3}
                value={formData.aboutMe}
                onChange={(e) => setFormData({...formData, aboutMe: e.target.value})}
                className="w-full bg-slate-950/50 border border-white/[0.05] rounded-xl px-4 py-3 text-white focus:border-blue-500/50 outline-none font-bold resize-none"
                placeholder="Share your teaching philosophy and educational goals..."
              />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Pedagogical Skills (comma separated)</label>
                <input 
                  type="text"
                  value={formData.professionalSkills.join(', ')}
                  onChange={(e) => setFormData({...formData, professionalSkills: e.target.value.split(',').map(s => s.trim()).filter(s => s !== '')})}
                  className="w-full bg-slate-950/50 border border-white/[0.05] rounded-xl px-4 py-3 text-white focus:border-blue-500/50 outline-none font-bold"
                  placeholder="e.g. STEM, Curriculum Design, Student Mentorship"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Intellectual Interests (comma separated)</label>
                <input 
                  type="text"
                  value={formData.skillsOfInterest.join(', ')}
                  onChange={(e) => setFormData({...formData, skillsOfInterest: e.target.value.split(',').map(s => s.trim()).filter(s => s !== '')})}
                  className="w-full bg-slate-950/50 border border-white/[0.05] rounded-xl px-4 py-3 text-white focus:border-blue-500/50 outline-none font-bold"
                  placeholder="e.g. AI in Education, Sustainability Research"
                />
              </div>
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
                className="px-8 py-3 bg-blue-500 hover:bg-blue-400 text-slate-950 font-black rounded-xl transition-all shadow-xl shadow-blue-500/20 flex items-center gap-3 disabled:opacity-50"
              >
                {loading ? <div className="w-5 h-5 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" /> : <><Save size={18} /> Save Changes</>}
              </button>
           </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherProfileModal;
