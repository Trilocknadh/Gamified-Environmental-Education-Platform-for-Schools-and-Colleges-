import express from 'express';
import { createSubmission, getMySubmissions, updateSubmissionStatus, getAllSubmissions } from '../controllers/submissionController.js';
import { protect, admin, authorize } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, upload.single('image'), createSubmission)
  .get(protect, authorize('Teacher', 'Admin'), getAllSubmissions);

router.get('/my-submissions', protect, getMySubmissions);

router.put('/:id', protect, authorize('Teacher', 'Admin'), updateSubmissionStatus);

export default router;
