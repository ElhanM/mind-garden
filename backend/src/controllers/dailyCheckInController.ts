// backend/src/controllers/dailyCheckInController.ts
import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { DailyCheckIn } from '../entities/DailyCheckIn';
import { throwError } from '../utils/responseHandlers';
import { sendSuccess } from '../utils/responseHandlers';
import { Between } from 'typeorm';

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

export const getDailyCheckIn = async (req: Request, res: Response) => {
  const userId = Number(req.headers['user-id']); // Get userId from headers

  // Check if the userId is provided
  if (!userId) {
    res.status(400).json({ error: 'User ID is required' });
    return;
  }

  try {
    const dailyCheckInRepository = AppDataSource.getRepository(DailyCheckIn);

    // Set today's date to midnight (00:00:00) to only consider the date, not the time
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to midnight to match the date

    // We are not converting to string here, because checkInDate is a Date in the DB
    // Find the check-in for today, matching the date part only (no time)
    const todayCheckIn = await dailyCheckInRepository.findOne({
      where: {
        userId,
        checkInDate: today, // Directly use the Date object (without time)
      },
    });

    // If no check-in found for today, return 404
    if (!todayCheckIn) {
      res.status(404).json({ error: 'No check-in found for today' });
      return;
    }

    // If check-in found, return it in the response
    sendSuccess(res, todayCheckIn, 200);
    return;
  } catch (error) {
    console.error('Error fetching daily check-in:', error);

    // Catch any errors and return a 500 error
    res.status(500).json({ error: 'Internal Server Error' });
    return;
  }
};
