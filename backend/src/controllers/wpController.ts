import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { DailyCheckIn } from '../entities/DailyCheckIn';
import { throwError, sendSuccess } from '../utils/responseHandlers';

export const getWPStatus = async (req: Request, res: Response) => {
  const userId = parseInt(req.headers['user-id'] as string, 10); // Assuming userId is passed in the headers???

  if (!userId) {
    throwError('Missing user ID. Log in!', 400);
  }

  const dailyCheckInRepository = AppDataSource.getRepository(DailyCheckIn);

  try {
    // Retrieve all check-ins for the user
    const checkIns = await dailyCheckInRepository.find({
      where: { userId }, // Use userId from daily_check_ins entity
    });

    // Dynamically calculate WP based on the number of check-ins
    const wp = checkIns.length * 10; // Each check-in contributes +10 WP

    sendSuccess(res, { wp }, 200); // Send the calculated WP to the frontend
  } catch (error) {
    console.error('Error calculating WP:', error);
    throwError('Failed to calculate WP', 500);
  }
};
