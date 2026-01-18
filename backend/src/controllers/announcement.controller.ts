import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware.js';
import prisma from '../config/database.js';

export const getAllAnnouncements = async (req: Request, res: Response) => {
  try {
    const { category, language, search, page = '1', limit = '20' } = req.query;
    
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    const where: any = {
      isDraft: false,
      publishedAt: { lte: new Date() },
    };

    if (category) {
      where.category = category;
    }

    if (language) {
      where.language = language;
    }

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { content: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [announcements, total] = await Promise.all([
      prisma.announcement.findMany({
        where,
        orderBy: [
          { priority: 'desc' },
          { publishedAt: 'desc' },
        ],
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
      }),
      prisma.announcement.count({ where }),
    ]);

    res.json({
      announcements,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAnnouncementById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const announcement = await prisma.announcement.findUnique({
      where: { id },
    });

    if (!announcement) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    // Increment views
    await prisma.announcement.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    res.json(announcement);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createAnnouncement = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const announcement = await prisma.announcement.create({
      data: {
        ...req.body,
        publishedAt: req.body.isDraft ? null : new Date(),
      },
    });

    res.status(201).json(announcement);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateAnnouncement = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { id } = req.params;

    const updated = await prisma.announcement.update({
      where: { id },
      data: req.body,
    });

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAnnouncement = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { id } = req.params;

    await prisma.announcement.delete({
      where: { id },
    });

    res.json({ message: 'Announcement deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const incrementShares = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.announcement.update({
      where: { id },
      data: { shares: { increment: 1 } },
    });

    res.json({ message: 'Share count updated' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
