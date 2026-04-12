import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowRight, Sparkles, Leaf, Atom, Zap } from 'lucide-react';
import api from '../api/axios';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '', role: 'Student', adminPin: '' });
  const setAuth = useAuthStore(state => state.setAuth);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', formData);
      setAuth(response.data, response.data.token);
      toast.success('Welcome back, ' + response.data.name + '!');
      
      if (response.data.role === 'Admin') {
        navigate('/admin');
      } else if (response.data.role === 'Teacher') {
        navigate('/teacher');
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMsg = error.response?.data?.message || 
                       error.response?.data?.errors?.[0]?.msg || 
                       'Login failed. Please check your credentials.';
      toast.error(errorMsg);
    }
  };

  const inputClasses = "w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-emerald-500 transition-all text-sm";
  const labelClasses = "text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-1.5 block";

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Dynamic Background Elements for Login */}
      <div className="absolute inset-0 pointer-events-none z-[-1]">
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[15%] left-[10%] text-emerald-500/10"
        >
          <Leaf size={100} />
        </motion.div>
        <motion.div 
          animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[15%] right-[10%] text-blue-500/10"
        >
          <Atom size={120} />
        </motion.div>
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[100px]"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-10 w-full max-w-md relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-blue-500" />
        
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/20 shadow-xl shadow-emerald-500/5">
             <LogIn className="text-emerald-400 w-8 h-8" />
          </div>
          <h2 className="text-3xl font-black text-white italic tracking-tight mb-2">Welcome <span className="text-glow text-emerald-400">Back</span></h2>
          <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">Authorized Access Only</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className={labelClasses}>Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className={inputClasses}
                  placeholder="yourname@gmail.com"
                />
              </div>
            </div>

            <div>
              <label className={labelClasses}>Logging in as</label>
              <div className="relative">
                <Leaf className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <select 
                  name="role"
                  value={formData.role}
                  onChange={(e: any) => setFormData({ ...formData, role: e.target.value })}
                  className={`${inputClasses} appearance-none`}
                >
                  <option value="Student">Student</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>

            {(formData.role === 'Admin' || formData.role === 'Teacher') && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-1"
              >
                <label className={labelClasses}>{formData.role} Security PIN</label>
                <div className="relative">
                  <Zap className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500" size={18} />
                  <input 
                    type="password" 
                    name="adminPin"
                    maxLength={6}
                    value={formData.adminPin}
                    onChange={(e) => setFormData({ ...formData, adminPin: e.target.value.replace(/\D/g, '') })}
                    required
                    className={`${inputClasses} border-amber-500/30 focus:border-amber-500`}
                    placeholder={`Enter 6-digit ${formData.role} PIN`}
                  />
                </div>
              </motion.div>
            )}

            <div>
              <label className={labelClasses}>Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className={inputClasses}
                  placeholder="Enter password"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between px-1">
            <label className="flex items-center gap-2 text-[10px] text-slate-500 font-black uppercase tracking-widest cursor-pointer group">
              <input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-0 transition-all" />
              <span className="group-hover:text-slate-300">Remember Me</span>
            </label>
            <Link to="/forgot-password" name="forgot-password" className="text-[10px] font-black text-emerald-400 uppercase tracking-widest hover:text-emerald-300 transition-colors">Forgot Password?</Link>
          </div>

          <button 
            type="submit" 
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-4 rounded-2xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-2 italic text-lg"
          >
            Access Portal <ArrowRight size={20} />
          </button>
        </form>

        <p className="text-center mt-10 text-slate-500 text-[10px] font-black uppercase tracking-widest">
          No Access? <Link to="/register" className="text-emerald-400 hover:underline">Enroll Now</Link>
        </p>

        <div className="mt-8 pt-8 border-t border-white/[0.05] flex items-center justify-center gap-2 text-[8px] text-slate-600 font-black uppercase tracking-[0.2em]">
          <Sparkles size={12} className="text-emerald-500" /> End-to-End Encryption Active
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
