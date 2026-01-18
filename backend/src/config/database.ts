import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.utils.js';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

prisma.$connect()
  .then(() => logger.info('Database connected successfully'))
  .catch((error) => logger.error('Database connection failed:', error));

process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;
