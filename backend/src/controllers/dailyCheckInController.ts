// backend/src/controllers/dailyCheckInController.ts
import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { DailyCheckIn } from '../entities/DailyCheckIn';
import { throwError } from '../utils/responseHandlers';
import { sendSuccess } from '../utils/responseHandlers';

export const createDailyCheckIn = async (req: Request, res: Response) => {
  const { userId, mood, stressLevel, journalEntry } = req.body;

  if (!userId || !mood || !stressLevel) {
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
