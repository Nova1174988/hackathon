import { Router } from 'express';
import * as announcementController from '../controllers/announcement.controller.js';
import { authenticateToken, requireRole } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createAnnouncementSchema, updateAnnouncementSchema } from '../schemas/announcement.schema.js';

const router = Router();

router.get('/', announcementController.getAllAnnouncements);
router.get('/:id', announcementController.getAnnouncementById);
router.post(
  '/',
  authenticateToken,
  requireRole('ADMIN'),
  validate(createAnnouncementSchema),
  announcementController.createAnnouncement
);
router.patch(
  '/:id',
  authenticateToken,
  requireRole('ADMIN'),
  validate(updateAnnouncementSchema),
  announcementController.updateAnnouncement
);
router.delete(
  '/:id',
  authenticateToken,
  requireRole('ADMIN'),
  announcementController.deleteAnnouncement
);
router.post('/:id/share', announcementController.incrementShares);

export default router;
