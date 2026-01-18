import { z } from 'zod';

export const createDoctorSchema = z.object({
  userId: z.string().uuid(),
  specialization: z.string().min(2),
  licenseNumber: z.string().min(5),
  experienceYears: z.number().int().min(0),
  bio: z.string().optional(),
  consultationFee: z.number().positive(),
  languagesSpoken: z.array(z.string()),
  photoUrl: z.string().url().optional(),
});

export const updateDoctorSchema = z.object({
  specialization: z.string().min(2).optional(),
  bio: z.string().optional(),
  consultationFee: z.number().positive().optional(),
  languagesSpoken: z.array(z.string()).optional(),
  photoUrl: z.string().url().optional(),
  availabilityStatus: z.enum(['AVAILABLE', 'BUSY', 'OFFLINE']).optional(),
});
