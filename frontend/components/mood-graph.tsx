'use client';

import { fetchCheckInsHistory } from '@/app/api-client/check-in';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';

// Define the data type
interface MoodData {
  date: string;
  mood: number;
}

// Use proper Recharts tooltip prop types
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length > 0) {
    return (
      <div className="rounded-lg border bg-white p-2 shadow-sm">
        <p className="text-sm font-semibold text-gray-700">{`Date: ${label}`}</p>
        <p className="text-sm text-purple-600">{`Mood: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

export function MoodGraph() {
  const { data: session } = useSession();
  const email = session?.user?.email;

  const { data: checkIns, isLoading } = useQuery({
    queryKey: ['checkIns'],
    queryFn: () => (email ? fetchCheckInsHistory(email) : Promise.resolve([])),
    enabled: !!email,
  });

  const moodMapping: { [key: string]: number } = {
    great: 5,
    good: 4,
    okay: 3,
    down: 2,
    bad: 1,
  };

  const data: MoodData[] =
    checkIns
      ?.map((checkIn: CheckIn) => ({
        date: new Date(checkIn.createdAt).toLocaleDateString('en-US', {
          month: 'numeric',
          day: 'numeric',
        }),
        mood: moodMapping[checkIn.mood],
      }))
      .reverse() || [];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis dataKey="date" stroke="#6b7280" />
        <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} stroke="#6b7280" />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="mood"
          stroke="#8b5cf6"
          strokeWidth={2}
          dot={{ fill: '#8b5cf6', strokeWidth: 2 }}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
