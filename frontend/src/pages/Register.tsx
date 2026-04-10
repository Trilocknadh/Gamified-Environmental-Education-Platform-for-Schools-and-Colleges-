import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Calendar, School, ArrowRight, Shield } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    schoolName: '',
    role: 'Student',
    adminPin: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const validatePassword = (pass: string) => {
     // Matches backend: 8+ chars, 1 Uppercase, 1 Number, 1 Special Char (@$!%*?&)
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(pass);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword(formData.password)) {
      return toast.error('Password must be 8+ chars and include 1 Uppercase, 1 Number, and 1 Special Char (@$!%*?&)');
    }

    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', formData);
      setAuth(data.user, data.token);
      toast.success('Welcome to EcoEdu!');
      navigate(data.user.role === 'Student' ? '/dashboard' : '/teacher/dashboard');
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 
                       error.response?.data?.errors?.[0]?.msg || 
                       'Registration failed';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-emerald-500 transition-all text-sm";
  const labelClasses = "text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-1.5 block";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-20">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card w-full max-w-md p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-blue-500" />
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-white italic tracking-tight mb-2">Create <span className="text-emerald-400 text-glow">Account</span></h2>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">Start your sustainability mission</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            {/* 1. Hero Persona */}
            <div>
              <label className={labelClasses}>Hero Persona</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  className={inputClasses}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            {/* 2. Gmail */}
            <div>
              <label className={labelClasses}>Gmail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="email"
                  placeholder="yourname@gmail.com"
                  required
                  className={inputClasses}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* 3. Date of birth */}
            <div>
              <label className={labelClasses}>Date of birth</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="date"
                  required
                  className={inputClasses}
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                />
              </div>
            </div>

            {/* 4. Role Selection */}
            <div>
                <label className={labelClasses}>Role Selection</label>
                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <select 
                      className={`${inputClasses} appearance-none`}
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    >
                      <option value="Student">Student</option>
                      <option value="Teacher">Teacher</option>
                      <option value="Admin">Admin</option>
                    </select>
                 </div>
              </div>

              {/* Admin Security PIN - Conditional */}
              {formData.role === 'Admin' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-1"
                >
                  <label className={labelClasses}>Admin Security PIN (6 Digits)</label>
                  <div className="relative">
                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500" size={18} />
                    <input
                      type="password"
                      maxLength={6}
                      placeholder="Enter 6-digit PIN"
                      required
                      className={`${inputClasses} border-amber-500/30 focus:border-amber-500`}
                      value={formData.adminPin}
                      onChange={(e) => setFormData({ ...formData, adminPin: e.target.value.replace(/\D/g, '') })}
                    />
                  </div>
                  <p className="text-[9px] text-amber-500/70 font-bold uppercase tracking-widest ml-1">Required for Admin verification</p>
                </motion.div>
              )}

             {/* 5. Learning Hub */}
             <div>
                <label className={labelClasses}>School or Institution</label>
                <div className="relative">
                   <School className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                   <input
                    type="text"
                    placeholder="Enter school..."
                    className={inputClasses}
                    value={formData.schoolName}
                    onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                   />
                </div>
             </div>

            {/* 6. Set password */}
            <div>
              <label className={labelClasses}>Set password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="password"
                  placeholder="Create password"
                  required
                  className={inputClasses}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              
              {/* password requirement indicators */}
              <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 px-1">
                {[
                  { label: '8+ Characters', met: formData.password.length >= 8 },
                  { label: 'Uppercase', met: /[A-Z]/.test(formData.password) },
                  { label: 'Number', met: /\d/.test(formData.password) },
                  { label: 'Special Char', met: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(formData.password) },
                ].map((req, i) => (
                  <div key={i} className={`flex items-center gap-1.5 transition-all duration-300 ${req.met ? 'text-emerald-500' : 'text-slate-600'}`}>
                    <div className={`w-1 h-1 rounded-full ${req.met ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-700'}`} />
                    <span className="text-[9px] font-black uppercase tracking-wider">{req.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 7. Confirm password */}
            <div>
              <label className={labelClasses}>Confirm password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" size={18} />
                <input
                  type="password"
                  placeholder="Repeat password"
                  required
                  className={inputClasses}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-4 rounded-2xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 group mt-4 italic text-lg active:scale-95"
          >
            {loading ? 'Initializing...' : <><ArrowRight className="group-hover:translate-x-1 transition-transform" /> Begin Exploration</>}
          </button>

          <p className="text-center text-slate-500 text-xs font-semibold">
            Already a member? <Link to="/login" className="text-emerald-400 hover:underline">Activate Legacy</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;
