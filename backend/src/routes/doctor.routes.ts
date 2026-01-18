import { Router } from 'express';
import * as doctorController from '../controllers/doctor.controller.js';
import { authenticateToken, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', doctorController.getAllDoctors);
router.get('/:id', doctorController.getDoctorById);
router.patch(
  '/profile',
  authenticateToken,
  requireRole('DOCTOR'),
  doctorController.updateDoctorProfile
);
router.patch(
  '/availability',
  authenticateToken,
  requireRole('DOCTOR'),
  doctorController.updateAvailability
);

export default router;
