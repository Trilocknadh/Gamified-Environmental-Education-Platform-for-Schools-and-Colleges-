import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Lock, ShieldCheck, KeyRound } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

interface ChangePasswordModalProps {
  onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await api.put('/auth/profile', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      toast.success('Password changed successfully!');
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      {/* Backdrop with extreme blur and dark overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-950/95 backdrop-blur-2xl" 
        onClick={onClose} 
      />

      {/* Perfectly Centered Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-md bg-[#0f172a] rounded-[2.5rem] border border-white/10 shadow-[0_32px_64px_-12px_rgba(0,0,0,1)] overflow-hidden z-[100000] flex flex-col"
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />
        
        {/* Header content */}
        <div className="p-8 border-b border-white/[0.05] bg-slate-900/50">
           <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-black text-white tracking-tight italic flex items-center gap-3">
                <div className="p-2.5 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                  <Lock className="text-blue-500" size={24} />
                </div>
                <span>Security <span className="text-blue-500">Update</span></span>
              </h2>
              <button 
                onClick={onClose} 
                className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
              >
                <X size={20} />
              </button>
           </div>
           <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] ml-1">Secure your access credentials</p>
        </div>

        {/* Form Body */}
        <div className="p-8 bg-slate-900/20 max-h-[70vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
             <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <KeyRound size={12} className="text-blue-500" />
                    Current Password
                  </label>
                  <input 
                    type="password" required
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                    className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-white focus:border-blue-500/50 outline-none font-bold transition-all placeholder:text-slate-800"
                    placeholder="Enter current password"
                  />
                </div>

                <div className="h-[1px] w-full bg-white/5" />

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">New Password</label>
                  <input 
                    type="password" required
                    value={formData.newPassword}
                    onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                    className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-white focus:border-emerald-500/50 outline-none font-bold transition-all placeholder:text-slate-800"
                    placeholder="Min. 6 characters"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Confirm New Password</label>
                  <input 
                    type="password" required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-white focus:border-emerald-500/50 outline-none font-bold transition-all placeholder:text-slate-800"
                    placeholder="Repeat new password"
                  />
                </div>
             </div>

             <div className="pt-4 flex flex-col gap-3">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 disabled:opacity-50 group font-bold"
                >
                  {loading ? (
                     <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                     <><ShieldCheck size={20} className="group-hover:scale-110 transition-transform" /> Update Password</>
                  )}
                </button>
                <button 
                  type="button" 
                  onClick={onClose}
                  className="w-full h-14 bg-white/5 hover:bg-white/10 text-slate-400 font-bold rounded-2xl transition-all border border-white/5"
                >
                  Discard Changes
                </button>
             </div>
          </form>
        </div>
      </motion.div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ChangePasswordModal;
