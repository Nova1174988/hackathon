import { z } from 'zod';

export const createAnnouncementSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  content: z.string().min(20, 'Content must be at least 20 characters'),
  category: z.enum(['VACCINATION', 'OUTBREAK', 'GENERAL', 'EMERGENCY']),
  language: z.enum(['ENGLISH', 'NEPALI']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  imageUrl: z.string().url().optional(),
  isDraft: z.boolean().optional(),
  publishedAt: z.string().datetime().optional(),
});

export const updateAnnouncementSchema = z.object({
  title: z.string().min(5).optional(),
  content: z.string().min(20).optional(),
  category: z.enum(['VACCINATION', 'OUTBREAK', 'GENERAL', 'EMERGENCY']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  imageUrl: z.string().url().optional(),
  isDraft: z.boolean().optional(),
  publishedAt: z.string().datetime().optional(),
});
