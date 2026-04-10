import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Users, TrendingUp, 
  BarChart3, Settings, LogOut, ShieldAlert,
  User
} from 'lucide-react';
import useAuthStore from '../store/authStore';

interface AdminSidebarProps {
  onLinkClick?: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ onLinkClick }) => {
  const { logout } = useAuthStore();

  const navItems = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/users', icon: Users, label: 'Users Management' },
    { to: '/admin/performance', icon: TrendingUp, label: 'Performance' },
    { to: '/admin/reports', icon: BarChart3, label: 'Reports & Analytics' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0a0f1b] border-r border-slate-800/50 w-full max-w-[280px]">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-indigo-500 rounded-xl shadow-lg shadow-indigo-500/20">
            <ShieldAlert className="text-slate-900" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-100 tracking-tighter">EcoEdu <span className="text-indigo-400">Admin</span></h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Super Controller</p>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onLinkClick}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all
                ${isActive 
                  ? 'bg-indigo-500 text-slate-900 shadow-lg shadow-indigo-500/20' 
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                }
              `}
            >
              <item.icon size={20} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-8 border-t border-slate-900 space-y-2">
        <NavLink 
          to="/admin/profile" 
          onClick={onLinkClick}
          className={({ isActive }) => `
            flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all
            ${isActive 
              ? 'bg-indigo-500 text-slate-900 shadow-lg shadow-indigo-500/20' 
              : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
            }
          `}
        >
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
             window.location.pathname === '/admin/profile' ? 'border-indigo-400 bg-indigo-400/20' : 'border-slate-800 bg-slate-900'
          }`}>
             <User size={16} />
          </div>
          Profile
        </NavLink>

        <button
          onClick={() => {
            logout();
            onLinkClick?.();
          }}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 transition-all w-full"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
