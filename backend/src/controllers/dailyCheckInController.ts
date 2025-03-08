// backend/src/controllers/dailyCheckInController.ts
import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { DailyCheckIn } from '../entities/DailyCheckIn';
import { throwError } from '../utils/responseHandlers';
import { sendSuccess } from '../utils/responseHandlers';
import { getUserByEmail } from '../utils/idHandler';

export const createDailyCheckIn = async (req: Request, res: Response) => {
  const { mood, stressLevel, journalEntry } = req.body;
  const userEmail = req.headers['user-email'] as string;

  if (!userEmail || !mood || !stressLevel) {
    throwError('Missing required fields', 400);
  }

  // Validate mood
  const validMoods = ['great', 'good', 'okay', 'down', 'bad'];
  if (!validMoods.includes(mood)) {
    throwError('Invalid mood value', 400);
  }

  // Validate stress level
  if (stressLevel < 1 || stressLevel > 5) {
    throwError('Stress level must be between 1 and 5', 400);
  }

  //addition: user id is now retrieved here on backend to remove the useEffect on front-end that we really didnt need
  const user = await getUserByEmail(userEmail);
  const userId = user?.id;

  const dailyCheckInRepository = AppDataSource.getRepository(DailyCheckIn);

  // Check if user already has a check-in for today
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existingCheckIn = await dailyCheckInRepository.findOne({
    where: {
      userId,
      checkInDate: today,
    },
  });

  if (existingCheckIn) {
    throwError('User already has a check-in for today', 400);
  }

  // Create new check-in
  const newDailyCheckIn = dailyCheckInRepository.create({
    userId,
    mood,
    stressLevel,
    journalEntry: journalEntry || null,
  });

  const result = await dailyCheckInRepository.save(newDailyCheckIn);
  sendSuccess(res, result, 201);
};

export const getDailyCheckIn = async (req: Request, res: Response) => {
  const userEmail = req.headers['user-email'] as string;

  if (!userEmail) {
    throwError('Missing email. Log in!', 400);
  }

  const user = await getUserByEmail(userEmail);
  const userId = user?.id;

  const dailyCheckInRepository = AppDataSource.getRepository(DailyCheckIn);

  const today = new Date();
  today.setHours(0, 0, 0, 0); // set to midnight (this will make the comparison between checkInDate and current date possible)

  const todayCheckIn = await dailyCheckInRepository.findOne({
    // see if they checked in today
    where: {
      userId,
      checkInDate: today,
    },
  });

  sendSuccess(res, todayCheckIn, 200);
};
