import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import TeacherSidebar from './TeacherSidebar';
import DashboardHeader from './DashboardHeader';
import useAuthStore from '../store/authStore';

const TeacherLayout = () => {
  const { user } = useAuthStore();

  // Redirect if not logged in or not a teacher/admin
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'Teacher' && user.role !== 'Admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-50 flex overflow-hidden">
      {/* Teacher Sidebar */}
      <TeacherSidebar />

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col pl-64 transition-all duration-300">
        
        {/* Shared Dashboard Header (automatically adapts titles) */}
        <DashboardHeader />

        {/* Dynamic Nested Routes Content */}
        <main className="flex-grow pt-24 px-10 pb-12 overflow-y-auto custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default TeacherLayout;
