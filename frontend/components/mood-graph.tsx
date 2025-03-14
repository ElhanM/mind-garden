'use client';

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

const data: MoodData[] = [
  { date: '10/1', mood: 3 },
  { date: '10/2', mood: 4 },
  { date: '10/3', mood: 3 },
  { date: '10/4', mood: 5 },
  { date: '10/5', mood: 4 },
  { date: '10/6', mood: 3 },
  { date: '10/7', mood: 4 },
];

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
