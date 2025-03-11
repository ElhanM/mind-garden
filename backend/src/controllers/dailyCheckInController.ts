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

  // Get user ID
  const user = await getUserByEmail(userEmail);
  const userId = user?.id;

  const dailyCheckInRepository = AppDataSource.getRepository(DailyCheckIn);

  // Create and store new check-in with auto UTC timestamp
  const newDailyCheckIn = dailyCheckInRepository.create({
    userId,
    mood,
    stressLevel,
    journalEntry: journalEntry || null,
  });

  const result = await dailyCheckInRepository.save(newDailyCheckIn);
  console.log('New Daily Check-In:', result.checkInDate, ', ', result.createdAt);

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

  // Get the latest check-in
  const todayCheckIn = await dailyCheckInRepository.findOne({
    where: { userId },
    order: { createdAt: 'DESC' },
  });

  // Send the UTC timestamp directly
  sendSuccess(res, todayCheckIn, 200);
};
