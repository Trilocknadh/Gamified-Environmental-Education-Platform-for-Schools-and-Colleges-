import express from 'express';
import { 
  getTeacherStats, 
  getAllTeachers, 
  getTeacherDashboardStats,
  getAllStudents,
  getTeacherAnalytics
} from '../controllers/teacherController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

const teacherOnly = [protect, authorize('Teacher', 'Admin')];

router.get('/stats', ...teacherOnly, getTeacherStats);
router.get('/dashboard-stats', ...teacherOnly, getTeacherDashboardStats);
router.get('/students', ...teacherOnly, getAllStudents);
router.get('/analytics', ...teacherOnly, getTeacherAnalytics);

router.get('/all', protect, authorize('Admin'), getAllTeachers);

export default router;
