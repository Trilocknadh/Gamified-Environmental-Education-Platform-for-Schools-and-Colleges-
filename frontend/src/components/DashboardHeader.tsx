import { useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import ProfileDropdown from './ProfileDropdown';
import { Menu } from 'lucide-react';

interface DashboardHeaderProps {
  onMenuClick?: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onMenuClick }) => {
  const location = useLocation();
  const { user } = useAuthStore();
  
  const getPageTitle = (path: string) => {
    const parts = path.split('/').filter(Boolean);
    if (parts.length === 0) return 'Dashboard';
    
    // Mapping for cleaner titles
    const mapping: { [key: string]: string } = {
      'academic': 'Academic Hub',
      'environment': 'Eco-System',
      'overview': 'General Overview',
      'subjects': 'Curriculum',
      'eco-materials': 'Eco Library',
      'academic-materials': 'Study Library',
      'missions': 'Mission Log',
      'quiz': 'Knowledge Quest',
      'leaderboard': 'Hall of Fame',
      'feedback': 'Mentor Support',
      'profile': 'Guardian Profile'
    };

    return parts.map(p => mapping[p] || p.charAt(0).toUpperCase() + p.slice(1)).join(' — ');
  };

  return (
    <header className="fixed top-0 right-0 left-0 h-20 px-4 sm:px-8 z-40 flex items-center justify-between border-b border-white/[0.05] bg-slate-900/40 backdrop-blur-3xl">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle */}
        <button 
          onClick={onMenuClick}
          className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <Menu size={20} />
        </button>

        <div>
          <h2 className="text-lg sm:text-xl font-black text-white tracking-tight italic line-clamp-1">
            {getPageTitle(location.pathname)}
          </h2>
          <p className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-0.5">
            Welcome back, <span className="text-emerald-400">{user?.name?.split(' ')[0] || 'Guardian'}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Placeholder for future top-nav actions (search, notifications) */}
        <ProfileDropdown />
      </div>
    </header>
  );
};

export default DashboardHeader;
