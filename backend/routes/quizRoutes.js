import express from 'express';
import { getQuizzes, createQuiz, submitQuiz, getAllQuizResults, updateQuiz, deleteQuiz } from '../controllers/quizController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getQuizzes)
  .post(protect, createQuiz);

router.route('/:id')
  .put(protect, updateQuiz)
  .delete(protect, deleteQuiz);

router.post('/submit', protect, submitQuiz);
router.get('/results', protect, getAllQuizResults);

export default router;
