import express from 'express';
import { getLeaderboard, getMyRank, resetLeaderboard } from '../controllers/leaderboardController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getLeaderboard);
router.get('/my-rank', protect, getMyRank);
router.post('/reset', protect, authorize('Teacher', 'Admin'), resetLeaderboard);

export default router;
