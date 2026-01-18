import { Router } from 'express';
import * as symptomController from '../controllers/symptom.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { symptomLimiter } from '../middleware/rateLimit.middleware.js';

const router = Router();

router.post('/check', symptomLimiter, symptomController.checkSymptoms);
router.get('/history', authenticateToken, symptomController.getSymptomHistory);

export default router;
