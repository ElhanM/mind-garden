import { z } from 'zod';

export const checkInSchema = z.object({
  mood: z.enum(['great', 'good', 'okay', 'down', 'bad'], {
    required_error: 'Please select your mood',
  }),
  stressLevel: z
    .number()
    .min(1, 'Stress level must be at least 1')
    .max(5, 'Stress level must be at most 5'),
  journalEntry: z.string().optional(),
});

export type CheckInFormData = z.infer<typeof checkInSchema>;
