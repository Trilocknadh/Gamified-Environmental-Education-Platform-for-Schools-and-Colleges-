import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  BookOpen, 
  Trophy, 
  Settings, 
  User, 
  LogOut, 
  Menu, 
  X,
  Zap,
  Leaf,
  Library
} from 'lucide-react';
import useAuthStore from '../store/authStore';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const commonLinks = [
    { name: 'Library', path: '/library', icon: BookOpen },
    { name: 'Missions', path: '/missions', icon: Leaf },
    { name: 'Subjects', path: '/subjects', icon: Zap },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
  ];

  const authenticatedOnlyLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Teacher Panel', path: '/teacher', icon: Settings },
  ];

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isHomePage = location.pathname === '/';
  
  let navLinks: any[] = [];
  if (!isAuthPage) {
    if (user) {
      if (user.role === 'Teacher' || user.role === 'Admin') {
        // Teacher/Admin specific links
        navLinks = [
          { name: 'Teacher Panel', path: '/teacher', icon: LayoutDashboard },
          { name: 'Profile', path: '/profile', icon: User },
        ];
      } else {
        // Student Order: Dashboard, Library, Missions, Subjects, Leaderboard, Profile
        navLinks = [
          authenticatedOnlyLinks[0], // Dashboard
          ...commonLinks,           // Library, Missions, Subjects, Leaderboard
          authenticatedOnlyLinks[1], // Profile
        ];
      }
    } else if (!isHomePage) {
      // Show common links on all other public pages except Home
      navLinks = commonLinks;
    }
  }

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'py-3 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 shadow-2xl' : 'py-5 bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)] group-hover:scale-110 transition-transform">
            <Leaf className="text-slate-950 w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-glow bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
            EcoEdu
          </span>
        </Link>

        {/* Desktop Nav */}
        {navLinks.length > 0 && (
          <div className="hidden lg:flex items-center gap-1 bg-slate-800/40 p-1.5 rounded-2xl border border-slate-700/30 backdrop-blur-md">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => `
                  flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300
                  ${isActive 
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20' 
                    : 'text-slate-400 hover:text-emerald-400 hover:bg-slate-700/50'}
                `}
              >
                <link.icon size={18} />
                <span className="text-sm">{link.name}</span>
              </NavLink>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="hidden lg:flex items-center gap-4">
          {user ? (
            <>
              <div className="flex flex-col items-end mr-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Active Eco Warrior</span>
                <span className="text-sm font-medium text-slate-300">{user.name}</span>
              </div>
              <button 
                onClick={logout}
                className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-400 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10 transition-all group"
                title="Logout"
              >
                <LogOut size={20} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link 
                to="/login" 
                className="px-5 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all font-medium border border-transparent hover:border-slate-700/50"
              >
                Log In
              </Link>
              <Link 
                to="/register" 
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="lg:hidden p-2 text-slate-300" onClick={toggleMenu}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-slate-900 border-b border-slate-800 overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col gap-4">
              {navLinks.length > 0 && (
                <>
                  {navLinks.map((link) => (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) => `
                        flex items-center gap-4 px-5 py-4 rounded-2xl transition-all
                        ${isActive 
                          ? 'bg-emerald-500 text-slate-950 font-bold' 
                          : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'}
                      `}
                    >
                      <link.icon size={22} />
                      <span className="text-lg">{link.name}</span>
                    </NavLink>
                  ))}
                  <hr className="border-slate-800 my-2" />
                </>
              )}
              {user ? (
                <button 
                  onClick={logout}
                  className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-red-500/10 text-red-400 font-bold border border-red-500/20"
                >
                  <LogOut size={22} />
                  <span className="text-lg">Logout Session</span>
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <Link 
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex justify-center items-center py-4 rounded-2xl bg-slate-800 text-slate-300 font-bold"
                  >
                    Log In
                  </Link>
                  <Link 
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="flex justify-center items-center py-4 rounded-2xl bg-emerald-500 text-slate-950 font-bold"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
