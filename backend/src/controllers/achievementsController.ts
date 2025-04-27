import { NextFunction, Request, Response } from 'express';
import { fetchCheckInsForUser } from './dailyCheckInController';
import { sendSuccess, throwError } from '../utils/responseHandlers';
import { Achievement } from '../types/Achievement';

function getStreakDate(
  records: Array<{ checkInDate: Date; createdAt: Date }>,
  requiredStreak: number
): string | null {
  if (records.length < requiredStreak) return null;

  const sortedRecords = [...records].sort(
    (a, b) => new Date(a.checkInDate).getTime() - new Date(b.checkInDate).getTime()
  );

  let streak = 1;

  for (let i = 1; i < sortedRecords.length; i++) {
    const prevDate = new Date(sortedRecords[i - 1].checkInDate);
    const currDate = new Date(sortedRecords[i].checkInDate);

    const diffDays = (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays === 1) {
      streak++;
      if (streak === requiredStreak) {
        return sortedRecords[i].createdAt.toISOString();
      }
    } else if (diffDays > 1) {
      streak = 1;
    }
  }
  return null;
}

export const getAchievements = async (req: Request, res: Response): Promise<void> => {
  const email = req.headers['user-email'] as string;
  if (!email) {
    throwError('Missing email. Log in!', 400);
  }

  const checkInsResponse = await fetchCheckInsForUser(email);
  const checkIns = checkInsResponse as Array<{
    checkInDate: Date;
    createdAt: Date;
    mood: string;
    journalEntry: string;
  }>;

  const achievement1: Achievement = {
    id: 1,
    title: 'First Steps',
    description: 'Complete your first check-in',
    unlocked: checkIns.length >= 1,
    date: checkIns.length >= 1 ? new Date(checkIns[0].createdAt).toISOString() : null,
  };

  const unlockWeekWarrior = getStreakDate(checkIns, 7);
  const achievement2: Achievement = {
    id: 2,
    title: 'Week Warrior',
    description: 'Complete 7 consecutive daily check-ins',
    unlocked: unlockWeekWarrior !== null,
    date: unlockWeekWarrior,
  };

  const achievement3: Achievement = {
    id: 3,
    title: 'Mindfulness Master',
    description: 'Complete 30 daily check-ins',
    unlocked: checkIns.length >= 30,
    date: checkIns.length >= 30 ? new Date(checkIns[29].createdAt).toISOString() : null,
  };

  const journalEntries: Array<{ journalEntry: string; createdAt: Date }> = checkIns.map(
    (checkIn) => {
      return { journalEntry: checkIn.journalEntry, createdAt: checkIn.createdAt };
    }
  );
  const achievement4: Achievement = {
    id: 4,
    title: 'Reflection Guru',
    description: 'Write 10 journal entries',
    unlocked: journalEntries.length >= 10,
    date: journalEntries.length >= 10 ? new Date(journalEntries[9].createdAt).toISOString() : null,
  };

  const positiveCheckIns: Array<{ checkInDate: Date; createdAt: Date }> = checkIns
    .filter((checkIn) => ['great', 'good'].includes(checkIn.mood.toLowerCase()))
    .map((checkIn) => {
      return { checkInDate: checkIn.checkInDate, createdAt: checkIn.createdAt };
    });
  const unlockMood = getStreakDate(positiveCheckIns, 5);
  const achievement5: Achievement = {
    id: 5,
    title: 'Self-Care Champion',
    description: 'Report 5 consecutive days of positive mood',
    unlocked: unlockMood !== null,
    date: unlockMood,
  };

  const achievements = [achievement1, achievement2, achievement3, achievement4, achievement5];

  sendSuccess(res, { achievements }, 200);
};
