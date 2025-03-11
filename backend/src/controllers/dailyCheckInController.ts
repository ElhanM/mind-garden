// backend/src/controllers/dailyCheckInController.ts
import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { DailyCheckIn } from '../entities/DailyCheckIn';
import { throwError } from '../utils/responseHandlers';
import { sendSuccess } from '../utils/responseHandlers';
import { getUserByEmail } from '../utils/idHandler';
import { DateTime, IANAZone } from 'luxon';

export const createDailyCheckIn = async (req: Request, res: Response) => {
  const { mood, stressLevel, journalEntry } = req.body;
  const userEmail = req.headers['user-email'] as string;
  const userTimeZone = req.headers['user-timezone'] as string;
  const isValidTimeZone = IANAZone.isValidZone(userTimeZone);
  const finalTimeZone = isValidTimeZone ? userTimeZone : 'UTC';

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

  const latestCheckIn = await dailyCheckInRepository.findOne({
    where: { userId },
    order: { createdAt: 'DESC' }, // Get the most recent check-in
  });

  const userLocalToday = DateTime.now().setZone(finalTimeZone).startOf('day');

  if (latestCheckIn) {
    const latestCheckInDate = DateTime.fromJSDate(latestCheckIn.createdAt)
      .setZone(finalTimeZone)
      .startOf('day');

    if (latestCheckInDate === userLocalToday) {
      throwError('User already has a check-in for today', 400);
    }
  }
  const createdAtUTC = DateTime.now().toUTC();

  // create new check-in with special creadetAt, converted to UTC (universal time)
  const newDailyCheckIn = dailyCheckInRepository.create({
    userId,
    mood,
    stressLevel,
    journalEntry: journalEntry || null,
    createdAt: createdAtUTC.toJSDate(), //saved as utc, universally
  });

  const result = await dailyCheckInRepository.save(newDailyCheckIn);
  sendSuccess(res, result, 201);
};

export const getDailyCheckIn = async (req: Request, res: Response) => {
  try {
    const userEmail = req.headers['user-email'] as string;
    const userTimeZone = req.headers['user-timezone'] as string;
    const isValidTimeZone = IANAZone.isValidZone(userTimeZone);
    const finalTimeZone = isValidTimeZone ? userTimeZone : 'UTC';

    if (!userEmail) {
      throwError('Missing email. Log in!', 400);
    }

    const user = await getUserByEmail(userEmail);
    const userId = user?.id;

    const dailyCheckInRepository = AppDataSource.getRepository(DailyCheckIn);

    // get local date in their tz, without time
    const userLocalToday = DateTime.now().setZone(finalTimeZone).startOf('day');

    const todayCheckIn = await dailyCheckInRepository.findOne({
      where: { userId },
      order: { createdAt: 'DESC' }, ///get the latest check-in
    });

    if (todayCheckIn) {
      // Convert `createdAt` to the user's timezone and compare, same as in createDailyCheckIn
      const latestCheckInDate = DateTime.fromJSDate(todayCheckIn.createdAt)
        .setZone(finalTimeZone)
        .startOf('day');

      if (!latestCheckInDate.equals(userLocalToday)) {
        sendSuccess(res, null, 200); // No check-in for today
        return; //added to prevent multiple headers sent error
      }
    }

    sendSuccess(res, todayCheckIn, 200);
  } catch (error) {
    throwError('Error getting daily check-in', 500);
  }
};
