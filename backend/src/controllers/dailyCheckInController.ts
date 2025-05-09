import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { DailyCheckIn } from '../entities/DailyCheckIn';
import { throwError } from '../utils/responseHandlers';
import { sendSuccess } from '../utils/responseHandlers';
import { getUserByEmail } from '../utils/idHandler';
import { Between } from 'typeorm';
import { subDays, startOfDay } from 'date-fns'; // for clean date math

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

  sendSuccess(res, todayCheckIn, 200);
};

export const getCheckInsHistory = async (req: Request, res: Response) => {
  const userEmail = req.headers['user-email'] as string;
  if (!userEmail) {
    throwError('Missing email. Log in!', 400);
  }

  const user = await getUserByEmail(userEmail);
  const userId = user?.id;

  if (!userId) {
    throwError('User not found', 404);
  }

  const dailyCheckInRepository = AppDataSource.getRepository(DailyCheckIn);

  // Get all check-ins for the user, ordered from newest to oldest
  const checkIns = await dailyCheckInRepository.find({
    where: { userId },
    order: { createdAt: 'ASC' },
  });

  sendSuccess(res, checkIns, 200);
};

export const fetchCheckInsForUser = async (email: string) => {
  if (!email) {
    throwError('Missing email. Log in!', 400);
  }

  const user = await getUserByEmail(email);
  const userId = user?.id;

  if (!userId) {
    throwError('User not found', 404);
  }

  const dailyCheckInRepository = AppDataSource.getRepository(DailyCheckIn);

  const checkIns = await dailyCheckInRepository.find({
    where: { userId },
    order: { createdAt: 'ASC' },
  });

  return checkIns;
};

export const getLatestStreak = async (req: Request, res: Response) => {
  const userEmail = req.headers['user-email'] as string;
  if (!userEmail) {
    throwError('Missing email. Log in!', 400);
  }

  const user = await getUserByEmail(userEmail);
  const userId = user?.id;

  if (!userId) {
    throwError('User not found', 404);
  }

  const dailyCheckInRepository = AppDataSource.getRepository(DailyCheckIn);

  const checkIns = await dailyCheckInRepository.find({
    where: { userId },
    order: { checkInDate: 'DESC' },
  });
  String;

  const streak = calculateStreak(checkIns);

  sendSuccess(res, { streak }, 200);
};
const calculateStreak = (checkIns: DailyCheckIn[]) => {
  const checkInDateStrings = new Set(
    checkIns.map((ci) => new Date(ci.checkInDate).toLocaleDateString())
  );
  const todayStr = new Date().toLocaleDateString();

  if (!checkInDateStrings.has(todayStr)) {
    return 0;
  }

  let streak = 1;
  let currentDate = new Date();
  while (true) {
    currentDate.setDate(currentDate.getDate() - 1);
    const prevDateStr = currentDate.toLocaleDateString();
    if (checkInDateStrings.has(prevDateStr)) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

export const getMoodHistory = async (req: Request, res: Response) => {
  const userEmail = req.headers['user-email'] as string;
  if (!userEmail) {
    throwError('Missing email. Log in!', 400);
  }

  const user = await getUserByEmail(userEmail);
  const userId = user?.id;
  if (!userId) {
    throwError('User not found', 404);
  }

  const dailyCheckInRepository = AppDataSource.getRepository(DailyCheckIn);

  const today = new Date();
  const sevenDaysAgo = startOfDay(subDays(today, 6));

  const checkIns = await dailyCheckInRepository.find({
    where: {
      userId,
      checkInDate: Between(sevenDaysAgo, today),
    },
    order: { checkInDate: 'DESC' },
  });

  const moodByDate: Record<string, { mood: string | null; stressLevel: number | null }> = {};
  checkIns.forEach((entry) => {
    const date = new Date(entry.checkInDate);
    const dateStr = date.toISOString().split('T')[0];

    moodByDate[dateStr] = {
      mood: entry.mood || null,
      stressLevel: entry.stressLevel || null,
    };
  });

  const moodHistory = Array.from({ length: 7 }).map((_, i) => {
    const date = subDays(today, 6 - i);
    const dateStr = date.toISOString().split('T')[0];
    const moodData = moodByDate[dateStr] || { mood: null, stressLevel: null };

    return {
      date: dateStr,
      mood: moodData.mood,
      stressLevel: moodData.stressLevel,
    };
  });

  sendSuccess(res, moodHistory, 200);
};
