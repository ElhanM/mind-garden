import { ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { Award, Trophy, Star, Zap, Heart, Bot } from 'lucide-react';

//ovjde treba staviti journal entries!!
import { fetchUserJournalEntries } from '@/';

import { fetchCheckInsHistory } from '@/app/api-client/check-in';

//kada se napravi u mood-history da fetcha sa api ovdje ce onda isto fetchat
import { MoodHistory } from '@/components/mood-history';

//trenutno ne mogu naci chat history al to bi se ovdje trebalo implementovat
import { fetchUserBotChats } from '@/';

interface MoodReport {
  date: string;
  mood: 'great' | 'good' | 'okay' | 'down' | 'bad';
  stressLvel: number;
}

export function userAchievements() {
  const { data: session } = useSession();
  const email = session?.user.email;

  const { data: checkIns = [] } = useQuery({
    queryKey: ['checkIns', email],
    queryFn: () => fetchCheckInsHistory(email!),
    enabled: !!email,
  });

  const { data: journalEntries = [] } = useQuery({
    queryKey: ['jorunalEntries', email],
    queryFn: () => fetchUserJournalEntries(email),
    enabled: !!email,
  });

  const { data: moodReports = [] } = useQuery<MoodReport>({
    queryKey: ['moodReports', email],
    queryFn: () => MoodHistory(email),
    enabled: !!email,
  });

  const { data: botChats = [] } = useQuery({
    queryKey: ['botChats', email],
    queryFn: () => fetchUserBotChats(email),
    enabled: !!email,
  });

  const achievements = [
    {
      id: 1,
      title: 'First Steps',
      description: 'Complete your first check-in',
      icon: <Award className="h-6 w-6 text-green-500" />,
      unlocked: checkIns && checkIns.length > 0,
      date: checkIns && checkIns.length > 0 ? checkIns[0].createdAt : null,
    },
    {
      id: 2,
      title: 'Week Warrior',
      description: 'Complete 7 consecutive daily check-ins',
      icon: <Trophy className="h-6 w-6 text-amber-500" />,
      unlocked: checkIns && checkIns.length >= 7,
      date: new Date().toISOString(),
    },
    {
      id: 3,
      title: 'Mindfulness Master',
      description: 'Complete 30 daily check-ins',
      icon: <Star className="h-6 w-6 text-purple-500" />,
      unlocked: checkIns && checkIns.length >= 30,
      date: new Date().toISOString(),
    },
    {
      id: 4,
      title: 'Reflection Guru',
      description: 'Write 10 journal entries',
      icon: <Zap className="h-6 w-6 text-blue-500" />,
      unlocked: journalEntries && journalEntries.length >= 10,
      date: new Date().toISOString(),
    },
    {
      id: 5,
      title: 'Self-Care Champion',
      description: 'Report 5 consecutive days of positive mood',
      icon: <Heart className="h-6 w-6 text-red-500" />,
      unlocked:
        moodReports.filter((m: MoodReport) => m.mood === 'good' || m.mood === 'great').length >= 5,
      date: new Date().toISOString(),
    },
    {
      id: 6,
      title: 'Communication Expert',
      description: 'Communicate with our mental wellness assistant for 10 days in a row',
      icon: <Bot className="h-6 w-6 text-indigo-500" />,
      unlocked: botChats && botChats.length >= 10,
      date: new Date().toISOString(),
    },
  ];

  return { achievements };
}
