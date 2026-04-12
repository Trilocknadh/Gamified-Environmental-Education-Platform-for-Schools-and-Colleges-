import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Zap, 
  Award, 
  Clock,
  Settings, 
  ChevronRight, 
  Heart, 
  X, 
  Check,
  Leaf,
  School,
  LogOut,
  Book,
  Briefcase,
  User as UserIcon,
  GraduationCap,
  Sparkles,
  Camera
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser, logout } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activities, setActivities] = useState<any[]>([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: user?.name || '',
    schoolName: user?.schoolName || '',
    collegeName: user?.collegeName || '',
    avatar: user?.avatar || '',
    interests: user?.interests || [],
    email: user?.email || '',
    aboutMe: user?.aboutMe || '',
    industry: user?.industry || 'Information Technology',
    professionalSkills: user?.professionalSkills || [],
    skillsOfInterest: user?.skillsOfInterest || []
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        schoolName: user.schoolName || '',
        collegeName: user.collegeName || '',
        avatar: user.avatar || '',
        interests: user.interests || [],
        email: user.email,
        aboutMe: user.aboutMe || '',
        industry: user.industry || 'Information Technology',
        professionalSkills: user.professionalSkills || [],
        skillsOfInterest: user.skillsOfInterest || []
      });
      fetchActivityLogs();
    }
  }, [user]);

  const fetchActivityLogs = async () => {
    setActivityLoading(true);
    try {
      const [submissionsRes] = await Promise.all([
        api.get('/submissions/my-submissions'),
      ]);
      
      const mixedLogs = [
        ...submissionsRes.data.map((s: any) => ({ ...s, type: 'mission', date: s.createdAt })),
        { type: 'quiz', title: 'Climate Change MCQs', score: '80%', date: new Date().toISOString(), earnedXP: 40 }
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setActivities(mixedLogs.slice(0, 5));
    } catch (error) {
      console.error('Error fetching activity logs:', error);
    } finally {
      setActivityLoading(false);
    }
  };

  if (!user) return null;

  const suggestedInterests = [
    'Solar Energy', 'Waste Reduction', 'Climate Action', 
    'Marine Biology', 'Reforestation', 'Sustainable Living',
    'Eco-Tech', 'Organic Farming'
  ];

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const { data } = await api.put('/auth/profile', formData);
      updateUser(data);
      setIsEditing(false);
      toast.success('Legacy updated successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest) 
        ? prev.interests.filter((i: string) => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 pt-24">
      {/* Hidden Ref for Future Upload implementation */}
      {/* Hidden File Input for Avatar Upload */}
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

          const toastId = toast.loading('Uploading your new look...');
          try {
            const { data } = await api.put('/users/profile/avatar', formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
            });
            updateUser({ ...user, avatar: data.avatar });
            toast.success('Avatar updated! Looking sharp.', { id: toastId });
          } catch (error: any) {
            toast.error(error.response?.data?.message || 'Upload failed', { id: toastId });
          }
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sidebar: Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-10 flex flex-col items-center text-center relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 via-blue-500 to-emerald-500" />
            
            <div className="relative mb-6">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-32 h-32 rounded-[2.5rem] bg-slate-900 border-2 border-emerald-500/30 p-1 group-hover:scale-105 transition-transform duration-500 cursor-pointer overflow-hidden relative"
              >
                {user.avatar ? (
                  <img 
                    src={user.avatar.startsWith('http') ? user.avatar : `https://gamified-environmental-education-w0n5.onrender.com${user.avatar}`} 
                    alt="Avatar" 
                    className="w-full h-full rounded-[2.2rem] object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-[2.2rem] bg-emerald-500/10 flex items-center justify-center text-emerald-500 text-3xl font-black italic">
                    {user.name.charAt(0)}
                  </div>
                )}
                <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                  <Camera size={24} className="text-white" />
                </div>
              </div>
              <button 
                onClick={() => setIsEditing(true)}
                className="absolute -bottom-2 -right-2 bg-emerald-500 text-slate-900 p-2.5 rounded-2xl border-4 border-slate-900 hover:scale-110 transition-transform shadow-xl"
              >
                <Settings size={18} />
              </button>
            </div>

            <h2 className="text-3xl font-black text-white tracking-tight italic mb-1">{user.name}</h2>
            <div className="flex items-center gap-2 text-emerald-400 font-black text-[10px] uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 mb-6">
               Level {user.level} Eco Warrior
            </div>

            <div className="w-full grid grid-cols-2 gap-3 mb-8">
               <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-3xl">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Impact</p>
                  <h4 className="text-xl font-black text-white italic">{user.xp} XP</h4>
               </div>
               <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-3xl">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Streak</p>
                  <h4 className="text-xl font-black text-orange-400 italic">{user.streak || 0} 🔥</h4>
               </div>
            </div>

            <div className="w-full bg-slate-950/50 border border-slate-800/50 p-4 rounded-3xl mb-8 flex items-center justify-center gap-3">
               <Mail size={16} className="text-emerald-500" />
               <span className="text-xs font-bold text-slate-400">{user.email}</span>
            </div>

            <button 
              onClick={() => setIsEditing(true)}
              className="w-full h-14 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2 mb-3"
            >
              <Settings size={20} /> Update Profile
            </button>

            <button 
              onClick={() => logout()}
              className="w-full h-14 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white font-bold rounded-2xl border border-red-500/20 transition-all flex items-center justify-center gap-2 group"
            >
              <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" /> Sign Out
            </button>
          </motion.div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Badge Showcase */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-10"
          >
            <div className="flex items-center justify-between mb-10">
               <h3 className="text-2xl font-black text-white italic flex items-center gap-3">
                  <Award className="text-yellow-400" /> Legacy Collection
               </h3>
               <span className="text-[10px] font-black text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/20 uppercase tracking-widest">
                  {user.badges?.length || 0} Badges Earned
               </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
               {(user.badges || []).length > 0 ? (user.badges || []).map((badge: string, i: number) => (
                 <motion.div 
                  key={i}
                  whileHover={{ y: -5, scale: 1.05 }}
                  className="aspect-square rounded-[2rem] bg-slate-900/50 border border-white/5 flex flex-col items-center justify-center p-4 relative group"
                 >
                    <div className="absolute inset-0 bg-yellow-400/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem]" />
                    <div className="w-14 h-14 rounded-2xl bg-yellow-400/10 flex items-center justify-center mb-3">
                       <Award className="text-yellow-500 w-8 h-8" />
                    </div>
                    <span className="text-[9px] font-black text-slate-400 uppercase text-center group-hover:text-yellow-400 transition-colors">{badge}</span>
                 </motion.div>
               )) : (
                 <div className="col-span-full py-12 text-center bg-slate-900/30 rounded-[2rem] border border-dashed border-slate-800">
                    <p className="text-slate-500 font-bold italic">Your trophy room is empty. Start your journey!</p>
                 </div>
               )}
            </div>
          </motion.div>
 
          {/* Activity Logs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-10"
          >
             <div className="flex items-center justify-between mb-10">
               <h3 className="text-2xl font-black text-white italic flex items-center gap-3">
                  <Clock className="text-blue-400" /> Activity Log
               </h3>
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Recent 5 Sessions</span>
             </div>
             
             <div className="space-y-4">
                {activityLoading ? (
                   [1,2,3].map(i => <div key={i} className="h-16 w-full animate-pulse bg-slate-800/50 rounded-2xl" />)
                ) : activities.length > 0 ? activities.map((log, i) => (
                  <div key={i} className="flex items-center gap-4 p-5 rounded-[2rem] bg-slate-900/30 border border-slate-800/50 group hover:border-blue-500/30 transition-all">
                     <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${log.type === 'mission' ? 'text-emerald-400 bg-emerald-500/10' : 'text-blue-400 bg-blue-500/10'} group-hover:scale-110 transition-transform`}>
                        {log.type === 'mission' ? <Leaf size={20} /> : <Book size={20} />}
                     </div>
                     <div className="flex-grow">
                        <div className="flex justify-between items-start">
                           <h4 className="font-bold text-slate-100">{log.missionId?.title || log.title}</h4>
                           <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{new Date(log.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1.5">
                           <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-tighter ${log.type === 'mission' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>
                              {log.type === 'mission' ? `Mission: ${log.status}` : `Quiz: ${log.score}`}
                           </span>
                           <span className="text-[9px] font-black text-slate-500 flex items-center gap-1"><Zap size={8} /> +{log.earnedXP || log.missionId?.points || 0} XP</span>
                        </div>
                     </div>
                     <ChevronRight size={16} className="text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                )) : (
                  <p className="text-center py-10 text-slate-600 font-medium italic">No activity recorded yet.</p>
                )}
             </div>
          </motion.div>
        </div>
      </div>

       {/* Educational Info - Full width bottom section */}
       <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-10 mt-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Column 1: Core Bio */}
          <div className="space-y-8">
            <div>
               <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <UserIcon size={16} className="text-purple-400" /> About me
               </h3>
               <p className="text-slate-300 text-sm leading-relaxed bg-slate-900/50 p-6 rounded-3xl border border-white/[0.05] italic">
                  {user.aboutMe || "Tell us about yourself, such as what you do, what are your aspirations etc."}
               </p>
            </div>
            <div className="grid grid-cols-1 gap-4">
               <div>
                  <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                     <GraduationCap size={16} className="text-blue-400" /> College Name
                  </h3>
                  <p className="text-slate-100 font-bold bg-slate-950/50 p-4 rounded-2xl border border-white/[0.02] flex items-center gap-3">
                     <School size={14} className="text-blue-500/50" /> {user.collegeName || user.schoolName || 'Not specified'}
                  </p>
               </div>
               <div>
                  <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                     <Briefcase size={16} className="text-emerald-400" /> Function/ Industry Network
                  </h3>
                  <p className="text-slate-100 font-bold bg-slate-950/50 p-4 rounded-2xl border border-white/[0.02]">
                     {user.industry || 'Information Technology'}
                  </p>
               </div>
            </div>
          </div>

          {/* Column 2: Professional Skills */}
          <div className="space-y-6">
             <div className="flex items-center justify-between mb-2">
               <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                  <Sparkles size={16} className="text-yellow-400" /> Professional Skills
               </h3>
               <span className="text-[10px] font-black text-slate-500 bg-slate-950/50 px-2 py-1 rounded-lg">
                  {user.professionalSkills?.length || 0} Skills
               </span>
             </div>
             <div className="bg-slate-950/30 p-6 rounded-[2.5rem] border border-white/[0.03] min-h-[160px]">
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
                       We see you haven't added any Skills yet. Please add your Skills to personalize your experience.
                    </div>
                  )}
               </div>
             </div>
          </div>

          {/* Column 3: Skills of Interest */}
          <div className="space-y-6">
             <div className="flex items-center justify-between mb-2">
               <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                  <Heart size={16} className="text-red-400" /> Skills of Interest
               </h3>
               <span className="text-[10px] font-black text-slate-500 bg-slate-950/50 px-2 py-1 rounded-lg">
                  At least 2 recommended
               </span>
             </div>
             <div className="bg-slate-950/30 p-6 rounded-[2.5rem] border border-white/[0.03] min-h-[160px]">
               <div className="flex flex-wrap gap-2.5">
                  {user.skillsOfInterest && user.skillsOfInterest.length > 0 ? user.skillsOfInterest.map((interest: string, idx: number) => (
                    <motion.span 
                      key={idx} 
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="px-4 py-2 bg-red-500/5 text-emerald-400 text-xs font-black rounded-xl border border-emerald-500/20"
                    >
                      {interest}
                    </motion.span>
                  )) : (
                    <div className="w-full py-8 text-center text-slate-600 italic text-xs px-4">
                       We see you haven't added any interests yet. Please add at-least 2 of your current interest to personalize your experience.
                    </div>
                  )}
               </div>
             </div>
          </div>
        </div>
      </motion.div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-[3rem] shadow-2xl p-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-10">
                <div>
                   <h2 className="text-3xl font-black text-white italic">Update Legacy</h2>
                   <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mt-1">Personalize your student identity</p>
                </div>
                <button onClick={() => setIsEditing(false)} className="p-2 text-slate-500 hover:text-white transition-colors"><X/></button>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Real Name</label>
                    <input 
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 focus:outline-none focus:border-emerald-500 transition-all text-white placeholder:text-slate-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">College Name</label>
                    <input 
                      type="text"
                      value={formData.collegeName}
                      onChange={(e) => setFormData({...formData, collegeName: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 focus:outline-none focus:border-emerald-500 transition-all text-white placeholder:text-slate-800"
                      placeholder="College name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Industry Network</label>
                    <input 
                      type="text"
                      value={formData.industry}
                      onChange={(e) => setFormData({...formData, industry: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 focus:outline-none focus:border-emerald-500 transition-all text-white placeholder:text-slate-800"
                      placeholder="e.g. Information Technology"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">About Me</label>
                  <textarea 
                    value={formData.aboutMe}
                    onChange={(e) => setFormData({...formData, aboutMe: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 focus:outline-none focus:border-emerald-500 transition-all text-white placeholder:text-slate-800 min-h-[100px]"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Professional Skills (comma separated)</label>
                    <input 
                      type="text"
                      value={formData.professionalSkills.join(', ')}
                      onChange={(e) => setFormData({...formData, professionalSkills: e.target.value.split(',').map(s => s.trim()).filter(s => s !== '')})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 focus:outline-none focus:border-emerald-500 transition-all text-white placeholder:text-slate-800"
                      placeholder="e.g. React, Node.js, Python"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Skills of Interest (comma separated)</label>
                    <input 
                      type="text"
                      value={formData.skillsOfInterest.join(', ')}
                      onChange={(e) => setFormData({...formData, skillsOfInterest: e.target.value.split(',').map(s => s.trim()).filter(s => s !== '')})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 focus:outline-none focus:border-emerald-500 transition-all text-white placeholder:text-slate-800"
                      placeholder="e.g. AI, Climate Science"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Environmental Passions</label>
                  <div className="flex flex-wrap gap-2">
                    {suggestedInterests.map((interest, i) => (
                      <button
                        key={i}
                        onClick={() => toggleInterest(interest)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                          formData.interests.includes(interest)
                            ? 'bg-emerald-500 text-slate-950 border-emerald-500 shadow-lg'
                            : 'bg-slate-950 text-slate-600 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-6 flex gap-4">
                  <button 
                    onClick={handleUpdateProfile}
                    disabled={loading}
                    className="flex-1 h-14 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2"
                  >
                    {loading ? 'Committing...' : <><Check size={20} /> Save Changes</>}
                  </button>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="px-8 h-14 bg-slate-800 text-slate-200 font-bold rounded-2xl hover:bg-slate-700 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
