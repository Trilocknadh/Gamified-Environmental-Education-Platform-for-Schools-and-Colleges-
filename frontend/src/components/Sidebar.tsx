import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Leaf, 
  MessageSquare, 
  User,
  ChevronRight,
  Rocket,
  Trophy
} from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Academic', path: '/academic', icon: BookOpen },
  { name: 'Environment', path: '/environment', icon: Leaf },
  { name: 'Quiz', path: '/environment/quiz', icon: Rocket },
  { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
  { name: 'Feedback', path: '/feedback', icon: MessageSquare },
];

interface SidebarProps {
  onLinkClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLinkClick }) => {
  return (
    <div className="w-full h-full glass-card border-r border-slate-700/50 flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 mb-8">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          EcoEdu
        </h1>
      </div>

      <nav className="flex-grow px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onLinkClick}
            className={({ isActive }) => cn(
              "flex items-center justify-between p-3 rounded-xl transition-all duration-300 group",
              isActive 
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
            )}
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3">
                  <item.icon size={20} className={cn(
                    "transition-transform group-hover:scale-110",
                    isActive ? "text-emerald-400" : "text-slate-400"
                  )} />
                  <span className="font-medium">{item.name}</span>
                </div>
                {isActive && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"
                  />
                )}
                {!isActive && (
                  <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 transition-transform" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Profile Section Shortlink / Bottom Actions */}
      <div className="p-4 mt-auto border-t border-slate-700/50">
        <NavLink 
          to="/profile" 
          onClick={onLinkClick}
          className={({ isActive }) => cn(
            "flex items-center gap-3 p-3 rounded-xl transition-all duration-300",
            isActive ? "bg-emerald-500/10 text-emerald-400" : "text-slate-400 hover:bg-slate-800/50"
          )}
        >
          <User size={20} />
          <span className="font-medium">Profile</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
