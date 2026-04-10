import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      setSubmitted(true);
      toast.success('Reset link generated!');
      console.log('DEV RESET LINK:', data.resetUrl);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to request reset');
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
          <h2 className="text-3xl font-black text-white italic tracking-tight mb-2">Recover <span className="text-emerald-400">Access</span></h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Identify your explorer profile</p>
        </div>

        {!submitted ? (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className={labelClasses}>Gmail Identification</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={inputClasses}
                  placeholder="yourname@gmail.com"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-4 rounded-2xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-2 italic text-lg"
            >
              {loading ? 'Processing...' : <><ArrowRight size={20} /> Request Reset Link</>}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-6">
            <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
               <p className="text-sm text-slate-300 leading-relaxed font-medium">
                 If that account exists, a reset link has been sent. <br/>
                 <span className="text-emerald-400 font-bold block mt-2 text-[10px] uppercase tracking-widest italic">Check Server Console for DEV link</span>
               </p>
            </div>
            <Link 
              to="/login" 
              className="inline-flex items-center gap-2 text-xs font-black text-emerald-400 uppercase tracking-widest hover:text-emerald-300 transition-colors"
            >
              Return to Portal
            </Link>
          </div>
        )}

        <p className="text-center mt-10 text-slate-500 text-[10px] font-black uppercase tracking-widest">
          Remembered your key? <Link to="/login" className="text-emerald-400 hover:underline">Sign In</Link>
        </p>

        <div className="mt-8 pt-8 border-t border-white/[0.05] flex items-center justify-center gap-2 text-[8px] text-slate-600 font-black uppercase tracking-[0.2em]">
          <Sparkles size={12} className="text-emerald-500" /> Secure Recovery System
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
