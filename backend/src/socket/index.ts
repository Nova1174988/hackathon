import { Server as HTTPServer } from 'http';
import { Server, Socket } from 'socket.io';
import { verifyAccessToken } from '../utils/jwt.utils.js';
import prisma from '../config/database.js';
import { logger } from '../utils/logger.utils.js';

interface AuthSocket extends Socket {
  userId?: string;
}

export const initializeSocket = (httpServer: HTTPServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
      credentials: true,
    },
  });

  // Authentication middleware
  io.use((socket: AuthSocket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication required'));
    }

    try {
      const decoded = verifyAccessToken(token);
      socket.userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket: AuthSocket) => {
    logger.info(`User connected: ${socket.userId}`);

    // Join consultation room
    socket.on('join-consultation', async (consultationId: string) => {
      try {
        const consultation = await prisma.consultation.findUnique({
          where: { id: consultationId },
          include: {
            doctor: true,
            patient: true,
          },
        });

        if (!consultation) {
          socket.emit('error', { message: 'Consultation not found' });
          return;
        }

        // Verify user is part of the consultation
        if (
          consultation.patientId !== socket.userId &&
          consultation.doctor.userId !== socket.userId
        ) {
          socket.emit('error', { message: 'Unauthorized' });
          return;
        }

        socket.join(consultationId);
        logger.info(`User ${socket.userId} joined consultation ${consultationId}`);
        socket.emit('joined-consultation', { consultationId });
      } catch (error: any) {
        logger.error('Join consultation error:', error);
        socket.emit('error', { message: error.message });
      }
    });

    // Send message
    socket.on('send-message', async (data: {
      consultationId: string;
      messageText: string;
      isFile?: boolean;
      fileUrl?: string;
    }) => {
      try {
        if (!socket.userId) {
          socket.emit('error', { message: 'Unauthorized' });
          return;
        }

        const message = await prisma.message.create({
          data: {
            consultationId: data.consultationId,
            senderId: socket.userId,
            messageText: data.messageText,
            isFile: data.isFile || false,
            fileUrl: data.fileUrl,
          },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });

        // Broadcast to all users in the consultation room
        io.to(data.consultationId).emit('new-message', message);
      } catch (error: any) {
        logger.error('Send message error:', error);
        socket.emit('error', { message: error.message });
      }
    });

    // Typing indicator
    socket.on('typing', (data: { consultationId: string; isTyping: boolean }) => {
      socket.to(data.consultationId).emit('user-typing', {
        userId: socket.userId,
        isTyping: data.isTyping,
      });
    });

    // Mark messages as read
    socket.on('mark-read', async (data: { consultationId: string }) => {
      try {
        await prisma.message.updateMany({
          where: {
            consultationId: data.consultationId,
            senderId: { not: socket.userId },
            isRead: false,
          },
          data: {
            isRead: true,
          },
        });

        socket.to(data.consultationId).emit('messages-read', {
          userId: socket.userId,
        });
      } catch (error: any) {
        logger.error('Mark read error:', error);
      }
    });

    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${socket.userId}`);
    });
  });

  return io;
};
