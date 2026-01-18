import { Router } from 'express';
import * as consultationController from '../controllers/consultation.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', authenticateToken, consultationController.createConsultation);
router.get('/', authenticateToken, consultationController.getConsultations);
router.get('/:id', authenticateToken, consultationController.getConsultationById);
router.patch('/:id/status', authenticateToken, consultationController.updateConsultationStatus);
router.post('/:id/rate', authenticateToken, consultationController.rateConsultation);

export default router;
