import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const validatePassword = (pass: string) => {
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
      await api.put(`/auth/reset-password/${token}`, { password: formData.password });
      toast.success('Password reset successful!');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-emerald-500 transition-all text-sm";
  const labelClasses = "text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-1.5 block";

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 relative overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-10 w-full max-w-md relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-blue-500" />
        
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/20 shadow-xl shadow-emerald-500/5">
             <ShieldCheck className="text-emerald-400 w-8 h-8" />
          </div>
          <h2 className="text-3xl font-black text-white italic tracking-tight mb-2">Set New <span className="text-emerald-400">Password</span></h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Upgrade your security key</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className={labelClasses}>New Secret Key</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="password" 
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className={inputClasses}
                  placeholder="At least 8 robust characters"
                />
              </div>
            </div>

            <div>
              <label className={labelClasses}>Confirm Secret Key</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" size={18} />
                <input 
                  type="password" 
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  className={inputClasses}
                  placeholder="Repeat new key"
                />
              </div>
            </div>
            
            {/* password requirement indicators */}
            <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 px-1">
              {[
                { label: '8+ Characters', met: formData.password.length >= 8 },
                { label: 'Uppercase', met: /[A-Z]/.test(formData.password) },
                { label: 'Number', met: /\d/.test(formData.password) },
                { label: 'Special Char (@$!%*?&)', met: /[@$!%*?&]/.test(formData.password) },
              ].map((req, i) => (
                <div key={i} className={`flex items-center gap-1.5 transition-all duration-300 ${req.met ? 'text-emerald-500' : 'text-slate-600'}`}>
                  <div className={`w-1 h-1 rounded-full ${req.met ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-700'}`} />
                  <span className="text-[9px] font-black uppercase tracking-wider">{req.label}</span>
                </div>
              ))}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-4 rounded-2xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-2 italic text-lg"
          >
            {loading ? 'Securing...' : <><ArrowRight size={20} /> Update My Password</>}
          </button>
        </form>

        <p className="text-center mt-10 text-slate-500 text-[10px] font-black uppercase tracking-widest">
          Remembered your key? <Link to="/login" className="text-emerald-400 hover:underline">Sign In</Link>
        </p>

        <div className="mt-8 pt-8 border-t border-white/[0.05] flex items-center justify-center gap-2 text-[8px] text-slate-600 font-black uppercase tracking-[0.2em]">
          <Sparkles size={12} className="text-emerald-500" /> AES-256 Recovery System
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
