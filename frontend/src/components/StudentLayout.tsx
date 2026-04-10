import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';
import useAuthStore from '../store/authStore';

const StudentLayout = () => {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 flex overflow-hidden">
      {/* Sidebar - Fixed on Left */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col pl-64 transition-all duration-300">
        
        {/* Dynamic Dashboard Header - Fixed Top */}
        <DashboardHeader />

        {/* Dynamic Nested Routes Content */}
        <main className="flex-grow pt-24 px-8 pb-12 overflow-y-auto custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
