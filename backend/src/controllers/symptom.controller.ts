import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { getCachedOrAnalyze } from '../services/ai.service.js';
import prisma from '../config/database.js';

export const checkSymptoms = async (req: AuthRequest, res: Response) => {
  try {
    const { symptoms, duration, severity, medicalHistory, medications, language } = req.body;

    if (!symptoms || !duration || severity === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const aiResponse = await getCachedOrAnalyze({
      symptoms,
      duration,
      severity: parseInt(severity),
      medicalHistory,
      medications,
      language: language || 'ENGLISH',
    });

    // Save to database if user is authenticated
    if (req.user) {
      await prisma.symptomCheck.create({
        data: {
          userId: req.user.userId,
          symptoms,
          duration,
          severity: parseInt(severity),
          medicalHistory,
          medications,
          aiResponse,
          language: language || 'ENGLISH',
        },
      });
    }

    res.json({ response: aiResponse });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getSymptomHistory = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const history = await prisma.symptomCheck.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    res.json(history);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
