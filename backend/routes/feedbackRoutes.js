import express from 'express';
import { submitFeedback, getFeedback, updateFeedbackStatus } from '../controllers/feedbackController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, submitFeedback)
  .get(protect, authorize('Teacher', 'Admin'), getFeedback);

router.patch('/:id', protect, authorize('Teacher', 'Admin'), updateFeedbackStatus);


export default router;
