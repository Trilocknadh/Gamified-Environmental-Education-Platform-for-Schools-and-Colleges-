import express from 'express';
import { 
    getStats, 
    getAllUsers, 
    addUser, 
    deleteUser, 
    getPerformanceMetrics, 
    getReports,
    updateAdminSettings
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply protect and admin middleware to all routes in this file
router.use(protect);
router.use(admin);

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.post('/add-user', addUser);
router.delete('/delete-user/:id', deleteUser);
router.get('/performance', getPerformanceMetrics);
router.get('/reports', getReports);
router.put('/settings', updateAdminSettings);

export default router;
