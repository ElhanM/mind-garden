import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { DailyCheckIn } from '../entities/DailyCheckIn';
import { throwError, sendSuccess } from '../utils/responseHandlers';
import { calculateWP } from './wpHelperCalculation'; // Import the helper function
import { format } from 'date-fns';

export const getWPStatus = async (req: Request, res: Response) => {
  const userId = parseInt(req.headers['user-id'] as string, 10);
  if (!userId) {
    throwError('Missing user ID. Log in!', 400);
  }

  const dailyCheckInRepository = AppDataSource.getRepository(DailyCheckIn);

  const checkIns = await dailyCheckInRepository.find({
    where: { userId },
    order: { createdAt: 'ASC' },
  });

  const checkInDates = checkIns.map((checkIn) => format(new Date(checkIn.createdAt), 'yyyy-MM-dd'));

  const startDate = checkIns.length > 0 ? new Date(checkIns[0].createdAt) : new Date();
  const endDate = new Date(); // Always use today

  const wp = calculateWP(checkInDates, startDate, endDate);

  sendSuccess(res, { wp }, 200);
};
