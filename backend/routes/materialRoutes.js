import express from 'express';
import { getMaterials, createMaterial, updateMaterial, deleteMaterial } from '../controllers/materialController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = express.Router();

const materialUpload = upload.fields([
  { name: 'file', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]);

router.route('/')
  .get(protect, getMaterials)
  .post(protect, authorize('Teacher', 'Admin'), materialUpload, createMaterial);

router.route('/:id')
  .put(protect, authorize('Teacher', 'Admin'), updateMaterial)
  .delete(protect, authorize('Teacher', 'Admin'), deleteMaterial);

export default router;
