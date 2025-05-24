import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sun, Cloud, CloudSun, CloudRain, CloudLightning, X } from 'lucide-react';
import { useMoodHistory } from '@/app/api-client/mood';
import { Spinner } from '@/components/ui/spinner';
import { Skeleton } from './ui/skeleton';

export function MoodHistory() {
  const { data: session } = useSession();
  const email = session?.user?.email ?? '';
  const { data: moodHistory, isLoading, isError, isFetched } = useMoodHistory(email);

  const getMoodIcon = (mood: string | null) => {
    switch (mood) {
      case 'great':
        return <Sun className="h-6 w-6 text-amber-500" />;
      case 'good':
        return <CloudSun className="h-6 w-6 text-yellow-600" />;
      case 'okay':
        return <Cloud className="h-6 w-6 text-gray-700" />;
      case 'down':
        return <CloudRain className="h-6 w-6 text-blue-700" />;
      case 'bad':
        return <CloudLightning className="h-6 w-6 text-purple-800" />;
      default:
        return <X className="h-6 w-6 text-gray-300" />;
    }
  };

  const getStressColor = (stressLevel: number | null) => {
    switch (stressLevel) {
      case 1:
        return 'bg-green-200/60';
      case 2:
        return 'bg-green-100/40';
      case 3:
        return 'bg-yellow-100';
      case 4:
        return 'bg-orange-100';
      case 5:
        return 'bg-red-200';
      default:
        return 'bg-gray-100/40'; // Default for null/no stress level
    }
  };

  // Show loading spinner during initial fetch or when data is not yet available
  if (isLoading || !isFetched) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-purple-700">Your Mood History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-around">
            <Skeleton className="size-[40px]" />
            <Skeleton className="size-[40px]" />
            <Skeleton className="size-[40px]" />
            <Skeleton className="size-[40px]" />
            <Skeleton className="size-[40px]" />
            <Skeleton className="size-[40px]" />
            <Skeleton className="size-[40px]" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show error state only after fetch is complete and there's an error or no data
  if (isError || !moodHistory) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-purple-700">Your Mood History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Unable to load mood history.</p>
        </CardContent>
      </Card>
    );
  }

  // Render mood history once data is available
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-purple-700">Your Mood History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between overflow-auto gap-2">
          {moodHistory.map(
            (
              day: { date: string; mood: string | null; stressLevel: number | null },
              index: number
            ) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={`mb-2 flex h-14 w-14 items-center justify-center rounded-full ${getStressColor(day.stressLevel)} shadow-md`}
                >
                  {getMoodIcon(day.mood)}
                </div>
                <span className="text-xs text-gray-500 mb-1">
                  {new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' })}
                </span>
              </div>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
}
