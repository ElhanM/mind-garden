import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { DailyCheckIn } from '../entities/DailyCheckIn';
import { throwError, sendSuccess } from '../utils/responseHandlers';
import { eachDayOfInterval, format, isToday } from 'date-fns';

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

// Helper function to calculate WP
export const calculateWP = (checkInDates: string[], startDate: Date, endDate: Date): number => {
  const allDates = eachDayOfInterval({ start: startDate, end: endDate }); // Generate all dates in the range
  let wp = 0;

  allDates.forEach((date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');

    // Skip decrementing for today if the user hasn't checked in yet
    if (isToday(date) && !checkInDates.includes(formattedDate)) {
      return;
    }

    if (checkInDates.includes(formattedDate)) {
      wp += 10; // Real check-in
    } else {
      wp -= 10; // Missed day
    }

    // Ensure WP does not go below 0 during the calculation
    wp = Math.max(wp, 0);
  });

  return wp;
};
