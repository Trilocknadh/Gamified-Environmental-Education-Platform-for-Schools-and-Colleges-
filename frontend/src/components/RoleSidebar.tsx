import React from 'react';
import useAuthStore from '../store/authStore';
import Sidebar from './Sidebar';
import TeacherSidebar from './TeacherSidebar';
import AdminSidebar from './AdminSidebar';

interface RoleSidebarProps {
  onLinkClick?: () => void;
}

const RoleSidebar: React.FC<RoleSidebarProps> = ({ onLinkClick }) => {
  const { user } = useAuthStore();

  if (user?.role === 'Admin') {
    return <AdminSidebar onLinkClick={onLinkClick} />;
  }

  if (user?.role === 'Teacher') {
    return <TeacherSidebar onLinkClick={onLinkClick} />;
  }

  return <Sidebar onLinkClick={onLinkClick} />;
};

export default RoleSidebar;
