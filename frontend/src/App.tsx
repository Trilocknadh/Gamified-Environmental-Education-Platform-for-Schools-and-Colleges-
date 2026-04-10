import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/student/StudentDashboard';
import EcoActivities from './pages/student/EcoActivities';
import Quiz from './pages/student/Quiz';
import Subjects from './pages/student/Subjects';
import EcoMaterials from './pages/student/EcoMaterials';
import Leaderboard from './pages/student/Leaderboard';
import Profile from './pages/student/Profile';
import Materials from './pages/student/Materials';
import AcademicOverview from './pages/student/AcademicOverview';
import Feedback from './pages/student/Feedback';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Teacher Pages (to be created/refactored)
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import StudentManagement from './pages/teacher/StudentManagement';
import TeacherAcademicControl from './pages/teacher/AcademicControl';
import TeacherEnvironmentControl from './pages/teacher/EnvironmentControl';
import TeacherLeaderboard from './pages/teacher/Leaderboard';
import TeacherFeedbackAnalytics from './pages/teacher/FeedbackAnalytics';
import TeacherFeedbackInbox from './pages/teacher/StudentFeedback';
import TeacherProfile from './pages/teacher/Profile';

import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminPerformance from './pages/admin/Performance';
import AdminReports from './pages/admin/Reports';
import AdminSettings from './pages/admin/Settings';
import AdminProfile from './pages/admin/Profile';

import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import BackgroundDecorations from './components/BackgroundDecorations';
import DashboardLayout from './components/DashboardLayout';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <Toaster position="top-right" toastOptions={{ className: 'glass-card text-emerald-400 border border-slate-700 bg-slate-900/90' }}/>
      
      <Routes>
        {/* Public Routes - Use standard Navbar */}
        <Route element={<><BackgroundDecorations /><Navbar /><main className="pt-16 min-h-screen"><Outlet /></main></>}>
           <Route path="/" element={<Home />} />
           <Route path="/login" element={<Login />} />
           <Route path="/register" element={<Register />} />
           <Route path="/forgot-password" element={<ForgotPassword />} />
           <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Route>

        {/* Protected Dashboard Routes - Use DashboardLayout */}
        <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<StudentDashboard />} />
          
          <Route path="/academic">
            <Route index element={<Navigate to="/academic/overview" replace />} />
            <Route path="overview" element={<AcademicOverview />} />
            <Route path="subjects" element={<Subjects />} />
            <Route path="eco-materials" element={<EcoMaterials />} />
            <Route path="academic-materials" element={<Materials category="academic" />} />
            <Route path="library" element={<Materials />} />
          </Route>

          <Route path="/environment">
             <Route index element={<Navigate to="/environment/missions" replace />} />
             <Route path="quiz" element={<Quiz />} />
             <Route path="quiz/:subject" element={<Quiz />} />
             <Route path="missions" element={<EcoActivities />} />
          </Route>

          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Teacher Dashboard Routes - (Now also uses DashboardLayout for consistent feel) */}
        <Route path="/teacher" element={<ProtectedRoute allowedRoles={['Teacher', 'Admin']}><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/teacher/dashboard" replace />} />
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="students" element={<StudentManagement />} />
          
          <Route path="academic">
            <Route index element={<Navigate to="/teacher/academic/overview" replace />} />
            <Route path="overview" element={<TeacherAcademicControl />} />
          </Route>

          <Route path="environment">
            <Route index element={<Navigate to="/teacher/environment/overview" replace />} />
            <Route path="overview" element={<TeacherEnvironmentControl />} />
          </Route>

          <Route path="leaderboard" element={<TeacherLeaderboard />} />
          <Route path="analytics" element={<TeacherFeedbackAnalytics />} />
          <Route path="feedback" element={<TeacherFeedbackInbox />} />
          <Route path="profile" element={<TeacherProfile />} />
        </Route>

        {/* Admin Dashboard Routes */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['Admin']}><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="performance" element={<AdminPerformance />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
