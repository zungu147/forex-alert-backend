/**
 * Global Error Handler Middleware
 * Handles all errors thrown in the application
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from '@utils/logger';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export class CustomError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isOperational: boolean = true,
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  err.statusCode = err.statusCode || 500;

  // Log error
  logger.error({
    statusCode: err.statusCode,
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    err.statusCode = 400;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    err.statusCode = 401;
    err.message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    err.statusCode = 401;
    err.message = 'Token expired';
  }

  // Operational error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      statusCode: err.statusCode,
    });
  }

  // Non-operational error: don't leak details
  return res.status(500).json({
    success: false,
    error: 'Something went wrong. Please try again later.',
    statusCode: 500,
  });
};

export default errorHandler;
