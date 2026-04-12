import express from 'express';
import { getAllStudents, awardBadge, getProfile, updateProfile, uploadAvatar, getDashboardStats } from '../controllers/userController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', protect, authorize('Teacher', 'Admin'), getAllStudents);
router.get('/students', protect, authorize('Teacher', 'Admin'), getAllStudents);
router.post('/:id/badge', protect, authorize('Teacher', 'Admin'), awardBadge);

router.route('/profile')
  .get(protect, getProfile)
  .put(protect, updateProfile);

router.get('/dashboard-stats', protect, getDashboardStats);

router.put('/profile/avatar', protect, upload.single('avatar'), uploadAvatar);

export default router;
