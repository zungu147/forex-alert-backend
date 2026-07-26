/**
 * Express Application Setup
 * Entry point for the Forex Alert Backend Server
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { initializeFirebase } from '@config/firebase';
import { logger } from '@utils/logger';
import errorHandler from '@middlewares/errorHandler';
import alertRoutes from '@controllers/alertController';
import deviceRoutes from '@controllers/deviceController';
import watchlistRoutes from '@controllers/watchlistController';
import subscriptionRoutes from '@controllers/subscriptionController';

// Load environment variables
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// ============ MIDDLEWARE ============

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true,
  optionsSuccessStatus: 200,
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// ============ ROUTES ============

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// API v1 routes
app.use('/api/v1/alerts', alertRoutes);
app.use('/api/v1/devices', deviceRoutes);
app.use('/api/v1/watchlist', watchlistRoutes);
app.use('/api/v1/subscription', subscriptionRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
    path: req.path,
  });
});

// ============ ERROR HANDLING ============

app.use(errorHandler);

// ============ SERVER INITIALIZATION ============

const startServer = async () => {
  try {
    // Initialize Firebase
    await initializeFirebase();
    logger.info('Firebase initialized successfully');

    // Start Express server
    app.listen(PORT, () => {
      logger.info(`🚀 Forex Alert Backend Server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

startServer();

export default app;
