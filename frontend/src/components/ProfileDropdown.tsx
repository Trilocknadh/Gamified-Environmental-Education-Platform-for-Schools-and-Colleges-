import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, LogOut, ChevronDown, Lock } from 'lucide-react';
import useAuthStore from '../store/authStore';
import ChangePasswordModal from './ChangePasswordModal';

const ProfileDropdown = () => {
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1.5 pr-3 rounded-full bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800/60 transition-all group"
      >
        <div className="w-10 h-10 rounded-full border-2 border-emerald-500/30 overflow-hidden group-hover:border-emerald-500 transition-colors bg-slate-800 flex items-center justify-center">
          {user.avatar ? (
            <img 
              src={user.avatar.startsWith('http') ? user.avatar : `http://localhost:5000${user.avatar}`} 
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-emerald-500 font-black text-xs italic">{user.name.charAt(0)}</span>
          )}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-bold text-slate-200 leading-none">{user.name}</p>
          <p className="text-[10px] font-medium text-emerald-400 uppercase tracking-widest mt-1">Level {user.level || 1} Explorer</p>
        </div>

        <ChevronDown size={16} className={cn("text-slate-400 transition-transform duration-300", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-3 w-56 glass-card border border-slate-700/50 shadow-2xl rounded-2xl overflow-hidden z-[60]"
          >
            <div className="p-4 border-b border-slate-700/50 bg-emerald-500/5">
              <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">Signed in as</p>
              <p className="text-sm font-medium text-slate-200 truncate">{user.email}</p>
            </div>
            
            <div className="p-2">
              <Link 
                to="/profile" 
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 w-full p-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-emerald-400 transition-all group"
              >
                <User size={18} className="group-hover:scale-110 transition-transform" />
                <span className="font-medium text-sm">View Profile</span>
              </Link>
              <button 
                onClick={() => {
                  setIsOpen(false);
                  setShowPasswordModal(true);
                }}
                className="flex items-center gap-3 w-full p-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-blue-400 transition-all group text-left"
              >
                <Lock size={18} className="group-hover:scale-110 transition-transform" />
                <span className="font-medium text-sm">change password</span>
              </button>
            </div>

            <div className="p-2 border-t border-slate-700/50">
              <button 
                onClick={logout}
                className="flex items-center gap-3 w-full p-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all group"
              >
                <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
                <span className="font-medium text-sm">Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPasswordModal && (
          <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export default ProfileDropdown;
