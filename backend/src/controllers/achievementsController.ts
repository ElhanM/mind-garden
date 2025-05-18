import { Request, Response } from 'express';
import { fetchCheckInsForUser } from './dailyCheckInController';
import { sendSuccess, throwError } from '../utils/responseHandlers';
import { Achievement } from '../types/Achievement';

export function getStreakDate(
  records: Array<{ checkInDate: Date; createdAt: Date }>,
  requiredStreak: number
): string | null {
  if (records.length < requiredStreak) return null;

  const sortedRecords = [...records].sort(
    (a, b) => new Date(a.checkInDate).getTime() - new Date(b.checkInDate).getTime()
  );

  let streak = 1;
  let earliestStreakDate: string | null = null;

  for (let i = 1; i < sortedRecords.length; i++) {
    const prevDate = new Date(sortedRecords[i - 1].checkInDate);
    const currDate = new Date(sortedRecords[i].checkInDate);

    const diffDays = (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays === 1) {
      streak++;
      if (streak >= requiredStreak) {
        const currentStreakEndDate = sortedRecords[i].createdAt.toISOString();
        if (!earliestStreakDate || currentStreakEndDate < earliestStreakDate) {
          earliestStreakDate = currentStreakEndDate;
        }
      }
    } else if (diffDays > 1) {
      streak = 1;
    }
  }

  return earliestStreakDate;
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

  const firstSteps: Achievement = {
    id: 1,
    title: 'First Steps',
    description: 'Complete your first check-in',
    unlocked: checkIns.length >= 1,
    date: checkIns.length >= 1 ? new Date(checkIns[0].createdAt).toISOString() : null,
  };

  const unlockWeekWarrior = getStreakDate(checkIns, 7);
  const weekWarrior: Achievement = {
    id: 2,
    title: 'Week Warrior',
    description: 'Complete 7 consecutive daily check-ins',
    unlocked: unlockWeekWarrior !== null,
    date: unlockWeekWarrior,
  };

  const mindfullnessMaster: Achievement = {
    id: 3,
    title: 'Mindfulness Master',
    description: 'Complete 30 daily check-ins',
    unlocked: checkIns.length >= 30,
    date: checkIns.length >= 30 ? new Date(checkIns[29].createdAt).toISOString() : null,
  };

  const journalEntries: Array<{ journalEntry: string; createdAt: Date }> = checkIns
    .filter((checkIn) => checkIn.journalEntry) // Only count non-empty journal entries
    .map((checkIn) => ({
      journalEntry: checkIn.journalEntry,
      createdAt: checkIn.createdAt,
    }));
  const reflectionGuru: Achievement = {
    id: 4,
    title: 'Reflection Guru',
    description: 'Write 10 journal entries',
    unlocked: journalEntries.length >= 10,
    date: journalEntries.length >= 10 ? new Date(journalEntries[9].createdAt).toISOString() : null,
  };

  const positiveCheckIns: Array<{ checkInDate: Date; createdAt: Date }> = checkIns
    .filter((checkIn) => ['great', 'good'].includes(checkIn.mood.toLowerCase()))
    .map((checkIn) => ({
      checkInDate: checkIn.checkInDate,
      createdAt: checkIn.createdAt,
    }));
  const unlockMood = getStreakDate(positiveCheckIns, 5);
  const selfCareChampion: Achievement = {
    id: 5,
    title: 'Self-Care Champion',
    description: 'Report 5 consecutive days of positive mood',
    unlocked: unlockMood !== null,
    date: unlockMood,
  };

  const achievements = [
    firstSteps,
    weekWarrior,
    mindfullnessMaster,
    reflectionGuru,
    selfCareChampion,
  ];

  sendSuccess(res, { achievements }, 200);
};
