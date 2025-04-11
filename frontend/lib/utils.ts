import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: Date | string): string => {
  const parsedDate = date instanceof Date ? date : new Date(date);

  // Ensure the date is valid
  if (isNaN(parsedDate.getTime())) {
    throw new Error('Invalid date provided');
  }

  return parsedDate.toLocaleDateString('en-US', {
    month: 'short', // "Mar"
    day: 'numeric', // "14"
  });
};
