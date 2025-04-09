import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { DailyCheckIn } from '../entities/DailyCheckIn';
import { throwError, sendSuccess } from '../utils/responseHandlers';

export const getWPStatus = async (req: Request, res: Response) => {
  const userId = parseInt(req.headers['user-id'] as string, 10);
  if (!userId) {
    throwError('Missing user ID. Log in!', 400);
  }

  const dailyCheckInRepository = AppDataSource.getRepository(DailyCheckIn);

  const checkIns = await dailyCheckInRepository.find({
    where: { userId },
  });

  const wp = checkIns.length * 10;

  sendSuccess(res, { wp }, 200);
};
