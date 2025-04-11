import { NextFunction, Request, Response } from 'express';
import { getCheckInsHistory } from './dailyCheckInController';
import { sendSuccess, throwError } from '../utils/responseHandlers';

function getStreakDate(
  records: Array<{ checkInDate: Date; createdAt: Date }>,
  requiredStreak: number
): string | null {
  if (records.length < requiredStreak) return null;
  let streak = 1;

  for (let i = 1; i < records.length; i++) {
    const prev = new Date(records[i - 1].checkInDate);
    const curr = new Date(records[i].checkInDate);
    const diffDays = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays === 1) {
      streak++;
      if (streak === requiredStreak) {
        return records[i].createdAt.toISOString();
      }
    } else {
      streak = 1;
    }
  }
  return null;
}

export const getAchievements = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const useremail = req.headers['user-email'] as string;
    if (!useremail) {
      throwError('Missing email. Log in!', 400);
    }

    const checkInsResponse = await getCheckInsHistory(req, res);
    const checkIns = checkInsResponse as unknown as Array<{
      checkInDate: Date;
      createdAt: Date;
      mood: string;
      journalEntry: string;
    }>;

    const achievement1 = {
      id: 1,
      title: 'First Steps',
      description: 'Complete your first check-in',
      icon: 'Award',
      unlocked: checkIns.length >= 1,
      date: checkIns.length >= 1 ? new Date(checkIns[0].createdAt).toISOString() : null,
    };
    const unlockWeekWarrior = getStreakDate(checkIns, 7);
    const achievement2 = {
      id: 2,
      title: 'Week Warrior',
      description: 'Complete 7 consecutive daily check-ins',
      icon: 'Trophy',
      unlocked: unlockWeekWarrior !== null,
      date: unlockWeekWarrior,
    };
    const achievement3 = {
      id: 3,
      title: 'Mindfulness Master',
      description: 'Complete 30 daily check-ins',
      icon: 'Star',
      unlocked: checkIns.length >= 30,
      date: checkIns.length >= 30 ? new Date(checkIns[29].createdAt).toISOString() : null,
    };
    const journalEntries = checkIns.filter(
      (record: any) => record.journalEntry && record.journalEntry.trim() !== ''
    );
    const achievement4 = {
      id: 4,
      title: 'Reflection Guru',
      description: 'Write 10 journal entries',
      icon: 'Zap',
      unlocked: journalEntries.length >= 10,
      date:
        journalEntries.length >= 10 ? new Date(journalEntries[9].createdAt).toISOString() : null,
    };
    const positiveMood = checkIns.filter((record: any) =>
      ['great', 'good'].includes(record.mood.toLowerCase())
    );
    const unlockMood = getStreakDate(positiveMood, 5);
    const achievement5 = {
      id: 5,
      title: 'Self-Care Champion',
      description: 'Report 5 consecutive days of positive mood',
      icon: 'Heart',
      unlocked: unlockMood !== null,
      date: unlockMood,
    };

    const achievemnts = [achievement1, achievement2, achievement3, achievement4, achievement5];

    sendSuccess(res, { achievemnts }, 200);
  } catch (error) {
    console.error('Error fetching achievements:', error);
    throwError('Something went wrong', 500);
  }
};
