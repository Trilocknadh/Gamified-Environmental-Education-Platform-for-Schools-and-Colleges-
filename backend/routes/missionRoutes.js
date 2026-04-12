import express from 'express';
import { getMissions, createMission, updateMission, deleteMission } from '../controllers/missionController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getMissions)
  .post(protect, createMission);

router.route('/:id')
  .put(protect, updateMission)
  .delete(protect, admin, deleteMission);

export default router;
