import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { DailyCheckIn } from '../entities/DailyCheckIn';
import { throwError, sendSuccess } from '../utils/responseHandlers';
import { calculateWP } from './wpHelperCalculation'; // Import the helper function
import { format } from 'date-fns';

export const getWPStatus = async (req: Request, res: Response) => {
  const userEmail = req.headers['user-email'] as string;
  if (!userEmail) {
    throwError('Missing user email. Log in!', 400);
  }

  const dailyCheckInRepository = AppDataSource.getRepository(DailyCheckIn);

  const checkIns = await dailyCheckInRepository.find({
    where: { user: { email: userEmail } },
    order: { createdAt: 'ASC' },
  });

  const checkInDates = checkIns.map((checkIn) => format(new Date(checkIn.createdAt), 'yyyy-MM-dd'));

  const startDate = checkIns.length > 0 ? new Date(checkIns[0].createdAt) : new Date();
  const endDate = new Date(); // Always use today

  const wp = calculateWP(checkInDates, startDate, endDate);

  sendSuccess(res, { wp }, 200);
};
