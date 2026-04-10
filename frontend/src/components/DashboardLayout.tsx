import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import RoleSidebar from './RoleSidebar';
import DashboardHeader from './DashboardHeader';
import useAuthStore from '../store/authStore';

const DashboardLayout = () => {
  const { user } = useAuthStore();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const toggleMobileSidebar = () => setMobileSidebarOpen(!mobileSidebarOpen);
  const closeMobileSidebar = () => setMobileSidebarOpen(false);

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-50 flex overflow-hidden relative">
      {/* Navigation is now handled by the universal hamburger menu and drawer */}

      {/* Mobile Sidebar Overlay + Panel */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            {/* Dark Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileSidebar}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />

            {/* Sliding Sidebar Panel */}
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-screen w-[280px] z-[70]"
            >
              <div className="relative h-full">
                <RoleSidebar onLinkClick={closeMobileSidebar} />
                
                {/* Close Button Inside Sidebar for Mobile */}
                <button 
                  onClick={closeMobileSidebar}
                  className="absolute top-6 right-[-50px] w-10 h-10 bg-slate-900 border border-slate-700 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col transition-all duration-300">
        
        {/* Dynamic Dashboard Header */}
        <DashboardHeader onMenuClick={toggleMobileSidebar} />

        {/* Dynamic Nested Routes Content */}
        <main className="flex-grow pt-24 px-4 sm:px-8 lg:px-10 pb-12 overflow-y-auto custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
