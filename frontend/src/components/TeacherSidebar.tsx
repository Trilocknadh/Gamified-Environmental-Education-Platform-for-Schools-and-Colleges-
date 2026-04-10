import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  MonitorPlay, 
  Globe, 
  BarChart3, 
  MessageSquare,
  User,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: 'Dashboard', path: '/teacher/dashboard', icon: LayoutDashboard },
  { name: 'Students', path: '/teacher/students', icon: Users },
  { name: 'Academic Control', path: '/teacher/academic', icon: MonitorPlay },
  { name: 'Environment Control', path: '/teacher/environment', icon: Globe },
  { name: 'Analytics', path: '/teacher/analytics', icon: BarChart3 },
  { name: 'Student Feedback', path: '/teacher/feedback', icon: MessageSquare },
];

interface TeacherSidebarProps {
  onLinkClick?: () => void;
}

const TeacherSidebar: React.FC<TeacherSidebarProps> = ({ onLinkClick }) => {
  return (
    <div className="w-full h-full border-r border-white/[0.05] bg-[#0a0f1d] flex flex-col z-50">
      {/* Teacher Branding */}
      <div className="p-8 mb-4">
        <h1 className="text-2xl font-black text-white tracking-tighter italic">
          ECO<span className="text-blue-500">EDU</span>
          <span className="block text-[10px] uppercase tracking-[0.3em] text-blue-400 not-italic mt-1 font-black">Teacher Portal</span>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-grow px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onLinkClick}
            className={({ isActive }) => cn(
              "flex items-center justify-between p-3.5 rounded-2xl transition-all duration-300 group",
              isActive 
                ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" 
                : "text-slate-500 hover:bg-slate-800/50 hover:text-slate-200"
            )}
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-xl transition-all duration-300",
                    isActive ? "bg-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.3)]" : "bg-slate-800/50 group-hover:bg-slate-800"
                  )}>
                    <item.icon size={20} className={cn(
                      "transition-transform group-hover:scale-110",
                      isActive ? "text-blue-400" : "text-slate-500"
                    )} />
                  </div>
                  <span className="font-bold text-sm">{item.name}</span>
                </div>
                {isActive && (
                  <motion.div 
                    layoutId="active-indicator-teacher"
                    className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.6)]"
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

      {/* Profile Section */}
      <div className="p-6 mt-auto border-t border-white/[0.05]">
        <NavLink 
          to="/teacher/profile" 
          onClick={onLinkClick}
          className={({ isActive }) => cn(
            "flex items-center gap-3 p-3.5 rounded-2xl transition-all duration-300 group",
            isActive ? "bg-blue-500/10 text-blue-400" : "text-slate-500 hover:bg-slate-800/50"
          )}
        >
          <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center overflow-hidden group-hover:border-blue-500/50 transition-all">
             <User size={20} />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm text-slate-200">Teacher Profile</span>
            <span className="text-[10px] text-slate-500 uppercase font-black">Manage Identity</span>
          </div>
        </NavLink>
      </div>
    </div>
  );
};

export default TeacherSidebar;
