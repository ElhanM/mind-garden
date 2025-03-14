import { ReactNode } from 'react';
import { Award, Trophy, Star, Zap, Heart, Bot } from 'lucide-react';

export interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: ReactNode;
  unlocked: boolean;
  date: string | null;
}

export const achievements: Achievement[] = [
  {
    id: 1,
    title: 'First Steps',
    description: 'Complete your first check-in',
    icon: <Award className="h-6 w-6 text-green-500" />,
    unlocked: true,
    date: '2023-10-01',
  },
  {
    id: 2,
    title: 'Week Warrior',
    description: 'Complete 7 consecutive daily check-ins',
    icon: <Trophy className="h-6 w-6 text-amber-500" />,
    unlocked: true,
    date: '2023-10-07',
  },
  {
    id: 3,
    title: 'Mindfulness Master',
    description: 'Complete 30 daily check-ins',
    icon: <Star className="h-6 w-6 text-purple-500" />,
    unlocked: true,
    date: '2023-10-30',
  },
  {
    id: 4,
    title: 'Reflection Guru',
    description: 'Write 10 journal entries',
    icon: <Zap className="h-6 w-6 text-blue-500" />,
    unlocked: false,
    date: null,
  },
  {
    id: 5,
    title: 'Self-Care Champion',
    description: 'Report 5 consecutive days of positive mood',
    icon: <Heart className="h-6 w-6 text-red-500" />,
    unlocked: false,
    date: null,
  },
  {
    id: 6,
    title: 'Communication Expert',
    description: 'Communicate with our mental wellness assistant for 10 days in a row',
    icon: <Bot className="h-6 w-6 text-indigo-500" />,
    unlocked: false,
    date: null,
  },
];
