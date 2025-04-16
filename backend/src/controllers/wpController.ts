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
  });

  // Sort check-ins to find first date
  const sortedCheckIns = checkIns.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const checkInDates = checkIns.map((checkIn) => format(new Date(checkIn.createdAt), 'yyyy-MM-dd'));

  const startDate = sortedCheckIns.length > 0 ? new Date(sortedCheckIns[0].createdAt) : new Date();
  const endDate = new Date(); // Always use today

  const wp = calculateWP(checkInDates, startDate, endDate);

  sendSuccess(res, { wp }, 200);
};
