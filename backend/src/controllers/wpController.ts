import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { DailyCheckIn } from '../entities/DailyCheckIn';
import { throwError, sendSuccess } from '../utils/responseHandlers';
import { getUserByEmail } from '../utils/idHandler';

export const createWPCheckIn = async (req: Request, res: Response) => {
  const userEmail = req.headers['user-email'] as string;

  if (!userEmail) {
    throwError('Missing required fields', 400);
  }

  // Get user ID
  const user = await getUserByEmail(userEmail);
  const userId = user?.id;

  const dailyCheckInRepository = AppDataSource.getRepository(DailyCheckIn);

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().slice(0, 10);

  // POPRAVITI MEHANIZAM RACUNANJA, ZNACI NIJE SVAKIH 24H, NEGO OD 00:00 DO 23:59!!!

  // Check if the user has already checked in today
  const todayCheckIn = await dailyCheckInRepository.findOne({
    where: { userId, checkInDate: new Date(today) },
  });

  if (todayCheckIn) {
    throwError('You have already checked in today', 400);
  }

  // Create and store new check-in with minimal details
  const newDailyCheckIn = dailyCheckInRepository.create({
    userId,
    checkInDate: today,
  });

  await dailyCheckInRepository.save(newDailyCheckIn);

  sendSuccess(res, { message: 'Daily check-in successful, 10 WP awarded' }, 201);
};

export const getWPStatus = async (req: Request, res: Response) => {
  const userEmail = req.headers['user-email'] as string;
  if (!userEmail) {
    throwError('Missing email. Log in!', 400);
  }

  const user = await getUserByEmail(userEmail);
  const userId = user?.id;

  const dailyCheckInRepository = AppDataSource.getRepository(DailyCheckIn);

  // Retrieve all check-ins for the user
  const checkIns = await dailyCheckInRepository.find({
    where: { userId },
    order: { checkInDate: 'ASC' },
  });

  // Calculate WP based on the number of consecutive daily check-ins
  let wp = 0;
  let lastCheckInDate: Date | null = null;

  for (const checkIn of checkIns) {
    const checkInDate = new Date(checkIn.checkInDate);
    if (lastCheckInDate) {
      const diffInDays = (checkInDate.getTime() - lastCheckInDate.getTime()) / (1000 * 3600 * 24);
      if (diffInDays > 1) {
        // Missed a day, WP will be downgrade by 10
        wp = Math.max(0, wp - 10);
      }
    }
    wp += 10;
    lastCheckInDate = checkInDate;
  }

  sendSuccess(res, { wp }, 200);
};
