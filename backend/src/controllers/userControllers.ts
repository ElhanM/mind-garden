import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import { throwError, sendSuccess } from '../utils/responseHandlers';

export const getUserByEmail = async (req: Request, res: Response): Promise<void> => {
  const userEmail = Array.isArray(req.headers['user-email'])
    ? req.headers['user-email'][0]
    : req.headers['user-email']; // force array to string

  if (!userEmail || typeof userEmail !== 'string') {
    throwError('User email is required', 400);
  }

  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOne({ where: { email: userEmail } });

  if (!user) {
    throwError('User not found', 404);
  }

  sendSuccess(res, { userId: user?.id }, 200);
};
