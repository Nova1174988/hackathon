import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware.js';
import prisma from '../config/database.js';

export const createConsultation = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { doctorId, scheduledTime, patientNotes } = req.body;

    const consultation = await prisma.consultation.create({
      data: {
        patientId: req.user.userId,
        doctorId,
        scheduledTime: new Date(scheduledTime),
        patientNotes,
        status: 'PENDING',
      },
      include: {
        doctor: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    res.status(201).json(consultation);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getConsultations = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { status, page = '1', limit = '20' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    const where: any = {};

    if (req.user.role === 'PATIENT') {
      where.patientId = req.user.userId;
    } else if (req.user.role === 'DOCTOR') {
      const doctor = await prisma.doctor.findUnique({
        where: { userId: req.user.userId },
      });
      if (doctor) {
        where.doctorId = doctor.id;
      }
    }

    if (status) {
      where.status = status;
    }

    const consultations = await prisma.consultation.findMany({
      where,
      include: {
        doctor: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { scheduledTime: 'desc' },
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
    });

    res.json(consultations);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getConsultationById = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { id } = req.params;

    const consultation = await prisma.consultation.findUnique({
      where: { id },
      include: {
        doctor: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        messages: {
          include: {
            sender: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: { timestamp: 'asc' },
        },
      },
    });

    if (!consultation) {
      return res.status(404).json({ error: 'Consultation not found' });
    }

    res.json(consultation);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateConsultationStatus = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { id } = req.params;
    const { status, doctorNotes, prescription } = req.body;

    const updated = await prisma.consultation.update({
      where: { id },
      data: {
        status,
        doctorNotes,
        prescription,
        ...(status === 'ACTIVE' ? { startedAt: new Date() } : {}),
        ...(status === 'COMPLETED' ? { endedAt: new Date() } : {}),
      },
    });

    // Update doctor's total consultations if completed
    if (status === 'COMPLETED') {
      await prisma.doctor.update({
        where: { id: updated.doctorId },
        data: {
          totalConsultations: { increment: 1 },
        },
      });
    }

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const rateConsultation = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { id } = req.params;
    const { rating, review } = req.body;

    const consultation = await prisma.consultation.findUnique({
      where: { id },
    });

    if (!consultation) {
      return res.status(404).json({ error: 'Consultation not found' });
    }

    if (consultation.patientId !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updated = await prisma.consultation.update({
      where: { id },
      data: { rating, review },
    });

    // Update doctor's average rating
    const allRatings = await prisma.consultation.findMany({
      where: {
        doctorId: consultation.doctorId,
        rating: { not: null },
      },
      select: { rating: true },
    });

    const avgRating = allRatings.reduce((sum, c) => sum + (c.rating || 0), 0) / allRatings.length;

    await prisma.doctor.update({
      where: { id: consultation.doctorId },
      data: { rating: avgRating },
    });

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
