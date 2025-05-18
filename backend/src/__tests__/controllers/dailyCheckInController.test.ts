import { describe, expect, it, beforeEach, jest, afterEach } from '@jest/globals';
import { calculateStreak } from '../../controllers/dailyCheckInController';
import { DailyCheckIn } from '../../entities/DailyCheckIn';

const createCheckInMock = (date: Date): DailyCheckIn => ({
  id: 321,
  userId: 123,
  mood: 'okay',
  stressLevel: 3,
  journalEntry: 'Testing',
  checkInDate: date,
  createdAt: new Date(),
  user: null,
});

describe('calculateStreak', () => {
  const originalSystemTime = global.Date;

  beforeEach(() => {
    const mockToday = new Date('2024-07-15T12:00:00.000Z'); // Noon UTC on July 15, 2024
    jest.useFakeTimers();
    jest.setSystemTime(mockToday);
  });

  afterEach(() => {
    jest.useRealTimers();
    global.Date = originalSystemTime;
  });

  it('should return 0 for an empty list of check-ins', () => {
    const checkIns: DailyCheckIn[] = [];
    expect(calculateStreak(checkIns)).toBe(0);
  });

  it('should return 0 if there is no check-in today', () => {
    const today = new Date(jest.now());
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const checkIns: DailyCheckIn[] = [createCheckInMock(yesterday)];
    expect(calculateStreak(checkIns)).toBe(0);
  });

  it('should return 1 for a single check-in today', () => {
    const today = new Date(jest.now());
    const checkIns: DailyCheckIn[] = [createCheckInMock(today)];
    expect(calculateStreak(checkIns)).toBe(1);
  });

  it('should return 3 for a 3-day streak ending today', () => {
    const today = new Date(jest.now());
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const dayBeforeYesterday = new Date(today);
    dayBeforeYesterday.setDate(today.getDate() - 2);

    const checkIns: DailyCheckIn[] = [
      createCheckInMock(today),
      createCheckInMock(yesterday),
      createCheckInMock(dayBeforeYesterday),
    ];
    // Test with different input order as Set makes it order-agnostic internally
    expect(calculateStreak([...checkIns].reverse())).toBe(3);
    expect(calculateStreak(checkIns)).toBe(3);
  });

  it('should return 1 if streak is broken (e.g., check-in today and two days ago, but not yesterday)', () => {
    const today = new Date(jest.now());
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(today.getDate() - 2);

    const checkIns: DailyCheckIn[] = [createCheckInMock(today), createCheckInMock(twoDaysAgo)];
    expect(calculateStreak(checkIns)).toBe(1);
  });

  it('should handle multiple check-ins on the same day as one day in the streak', () => {
    const today = new Date(jest.now());
    const todayMorning = new Date(today);
    todayMorning.setHours(8, 0, 0, 0);
    const todayEvening = new Date(today);
    todayEvening.setHours(20, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const checkIns: DailyCheckIn[] = [
      createCheckInMock(todayMorning),
      createCheckInMock(todayEvening),
      createCheckInMock(yesterday),
    ];
    expect(calculateStreak(checkIns)).toBe(2);
  });

  it('should correctly calculate streak across month/year boundaries', () => {
    // Set "today" to Jan 2, 2024 for this specific test
    const specificToday = new Date('2024-01-02T12:00:00.000Z');
    jest.setSystemTime(specificToday);

    const checkIns: DailyCheckIn[] = [
      createCheckInMock(new Date('2024-01-02T08:00:00.000Z')), // Jan 2 (Today)
      createCheckInMock(new Date('2024-01-01T09:00:00.000Z')), // Jan 1 (Yesterday)
      createCheckInMock(new Date('2023-12-31T10:00:00.000Z')), // Dec 31 (Day before yesterday)
    ];
    expect(calculateStreak(checkIns)).toBe(3);
  });

  it('should return 0 if the latest check-in is not today, even with a past streak', () => {
    const today = new Date(jest.now());
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(today.getDate() - 2);

    const checkIns: DailyCheckIn[] = [createCheckInMock(yesterday), createCheckInMock(twoDaysAgo)];
    expect(calculateStreak(checkIns)).toBe(0);
  });
});
