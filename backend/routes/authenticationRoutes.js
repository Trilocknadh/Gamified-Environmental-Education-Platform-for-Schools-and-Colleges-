import express from 'express';
import { 
  registerUser, 
  loginUser, 
  updateUserProfile, 
  uploadAvatar,
  forgotPassword,
  resetPassword
} from '../controllers/authenticationController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import { body } from 'express-validator';

const router = express.Router();

router.post(
  '/register',
  [
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Please include a valid @gmail.com email')
      .isEmail()
      .custom((value) => {
        if (!value.endsWith('@gmail.com')) {
          throw new Error('Only @gmail.com addresses are allowed');
        }
        return true;
      }),
    body('password', 'Password must be at least 8 characters long, contain 1 uppercase letter, 1 number, and 1 special character')
      .isLength({ min: 8 })
      .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/),
    body('dateOfBirth', 'Date of birth is required').not().isEmpty()
  ],
  registerUser
);

router.post('/login', loginUser);
router.put('/profile', protect, updateUserProfile);
router.put('/profile/avatar', protect, upload.single('avatar'), uploadAvatar);

// Password recovery
router.post('/forgot-password', forgotPassword);
router.put(
  '/reset-password/:resetToken',
  [
    body('password', 'Password must be 8+ chars, 1 uppercase, 1 number, 1 special char')
      .isLength({ min: 8 })
      .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/),
  ],
  resetPassword
);

export { router as authenticationRoutes };
export default router;
