import { describe, expect, it } from '@jest/globals';

import { format } from 'date-fns';
import { calculateWP } from '../../controllers/wpController';

describe('calculateWP', () => {
  it('should correctly calculate WP for a mix of check-ins and missed days', () => {
    const checkInDates = ['2024-03-10', '2024-03-12'];
    const startDate = new Date('2024-03-10T00:00:00.000Z');
    const endDate = new Date('2024-03-13T00:00:00.000Z'); // 4 days: 10, 11, 12, 13

    // March 10: +10 (WP=10)
    // March 11: -10 (WP=0)
    // March 12: +10 (WP=10)
    // March 13: -10 (WP=0)
    const result = calculateWP(checkInDates, startDate, endDate);
    expect(result).toBe(0);
  });

  it('should ensure WP does not go below 0', () => {
    const checkInDates: string[] = []; // No check-ins
    const startDate = new Date('2024-03-10T00:00:00.000Z');
    const endDate = new Date('2024-03-12T00:00:00.000Z'); // 3 days: 10, 11, 12

    // March 10: -10 (WP=0, capped)
    // March 11: -10 (WP=0, capped)
    // March 12: -10 (WP=0, capped)
    const result = calculateWP(checkInDates, startDate, endDate);
    expect(result).toBe(0);
  });

  it('should correctly calculate WP when starting with some check-ins', () => {
    const checkInDates = ['2024-03-10', '2024-03-11'];
    const startDate = new Date('2024-03-10T00:00:00.000Z');
    const endDate = new Date('2024-03-12T00:00:00.000Z'); // 3 days: 10, 11, 12

    // March 10: +10 (WP=10)
    // March 11: +10 (WP=20)
    // March 12: -10 (WP=10)
    const result = calculateWP(checkInDates, startDate, endDate);
    expect(result).toBe(10);
  });

  it('should skip decrementing for today if the user has not checked in yet', () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const formattedYesterday = format(yesterday, 'yyyy-MM-dd');
    const checkInDates = [formattedYesterday]; // Checked in yesterday, not today

    const startDate = yesterday;
    const endDate = today; // Range includes yesterday and today

    // Yesterday: checked in, WP = 10
    // Today: isToday(today) is true, today is not in checkInDates. Loop for today should return, not decrement.
    // Expected WP = 10
    const result = calculateWP(checkInDates, startDate, endDate);
    expect(result).toBe(10);
  });

  it('should return 0 if there are no check-ins and the period is one day (today)', () => {
    const today = new Date();
    const checkInDates: string[] = [];
    const startDate = today;
    const endDate = today;

    // Today: isToday(today) is true, today is not in checkInDates. Loop for today should return.
    // Initial WP is 0. Expected WP = 0.
    const result = calculateWP(checkInDates, startDate, endDate);
    expect(result).toBe(0);
  });

  it('should give 10 WP if checked in today and period is only today', () => {
    const today = new Date();
    const formattedToday = format(today, 'yyyy-MM-dd');
    const checkInDates = [formattedToday];
    const startDate = today;
    const endDate = today;

    // Today: isToday(today) is true, today IS in checkInDates. WP += 10.
    // Expected WP = 10.
    const result = calculateWP(checkInDates, startDate, endDate);
    expect(result).toBe(10);
  });
});
