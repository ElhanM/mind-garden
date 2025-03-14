import { Response } from 'express';
import { AppError } from '../middleware/errorMiddleware';

export const sendSuccess = (res: Response, results: unknown, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    results,
  });
};

// Instead of sending error responses, throw custom errors
export const throwError = (message: string, statusCode = 400) => {
  throw new AppError(message, statusCode);
};
