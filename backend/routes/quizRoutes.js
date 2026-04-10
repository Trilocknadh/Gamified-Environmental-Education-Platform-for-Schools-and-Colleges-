import express from 'express';
import { getQuizzes, createQuiz, submitQuiz, getAllQuizResults } from '../controllers/quizController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getQuizzes)
  .post(protect, createQuiz);

router.post('/submit', protect, submitQuiz);
router.get('/results', protect, getAllQuizResults);

export default router;
