import { eachDayOfInterval, format } from 'date-fns';

// Helper function to calculate WP
export const calculateWP = (checkInDates: string[], startDate: Date, endDate: Date): number => {
  const allDates = eachDayOfInterval({ start: startDate, end: endDate }); // Generate all dates in the range
  let wp = 0;

  allDates.forEach((date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    if (checkInDates.includes(formattedDate)) {
      wp += 10; // Real check-in
    } else {
      wp -= 10; // Missed day
    }

    // Ensure WP does not go below 0 during the calculation
    wp = Math.max(wp, 0);
  });

  return wp;
};
