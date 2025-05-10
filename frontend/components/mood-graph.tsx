'use client';

import { fetchCheckInsHistory } from '@/app/api-client/check-in';
import { formatDate } from '@/lib/utils';
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
  type TooltipProps,
} from 'recharts';
import { Skeleton } from './ui/skeleton';

// Define the data type
interface MoodData {
  date: string;
  mood: number;
}

interface CheckIn {
  id: number;
  userId: number;
  mood: string;
  stressLevel: number;
  journalEntry: string | null;
  createdAt: Date;
  checkInDate: Date;
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
    queryKey: ['checkIns', email],
    queryFn: () => (email ? fetchCheckInsHistory() : Promise.resolve([])),
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
    checkIns?.map((checkIn: CheckIn) => ({
      date: formatDate(checkIn.createdAt), // Using createdAt for accuracy
      mood: moodMapping[checkIn.mood],
    })) || [];

  if (isLoading) {
    return (
      <div className="w-full h-[300px] flex flex-col">
        {/* X-axis labels skeleton */}
        <div className="mt-auto mb-2 flex justify-between px-8">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={`x-${i}`} className="h-4 w-16" />
            ))}
        </div>

        {/* Chart area skeleton */}
        <div className="relative flex-1 w-full">
          {/* Y-axis labels skeleton */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between py-2">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={`y-${i}`} className="h-4 w-8" />
              ))}
          </div>

          {/* Grid lines skeleton */}
          <div className="absolute left-12 right-0 top-0 h-full flex flex-col justify-between py-2">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={`grid-${i}`} className="h-[1px] w-full opacity-30" />
              ))}
          </div>

          {/* Line chart skeleton */}
          <div className="absolute left-12 right-4 top-1/2 transform -translate-y-1/2">
            <Skeleton className="h-[3px] w-full" />
          </div>

          {/* Data points skeleton */}
          <div className="absolute left-12 right-4 top-0 h-full flex justify-between items-center">
            {Array(7)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={`point-${i}`} className="h-3 w-3 rounded-full" />
              ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full mx-auto">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
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
    </div>
  );
}
