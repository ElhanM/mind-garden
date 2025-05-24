import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAchievementsQuery } from '@/app/api-client/achievements';
import { Skeleton } from './ui/skeleton';
import { AchievementIcon, achievementIcons } from '@/app/api-client/achievements/achievementIcons';
import type { Achievement } from '@/types/Achievement';

export function AchievementsList() {
  const { data: session } = useSession();
  const email = session?.user?.email ?? '';
  const { data: achievementsData, isLoading, isError, isFetched } = useAchievementsQuery(email);

  // Prioritize loading state to prevent error flash
  if (isLoading || !isFetched) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-purple-700">Recent Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4">
            <Skeleton className="h-[68px] w-full" />
            <Skeleton className="h-[40px] w-1/3" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show error state only after fetch is complete
  if (isError || !achievementsData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-purple-700">Recent Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Unable to load achievements.</p>
        </CardContent>
      </Card>
    );
  }

  const unlockedAchievements = achievementsData.achievements
    .filter((achievement: Achievement) => achievement.unlocked)
    .sort((a: Achievement, b: Achievement) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0; // Fallback to 0 if null
      const dateB = b.date ? new Date(b.date).getTime() : 0; // Fallback to 0 if null
      return dateB - dateA;
    })
    .slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-purple-700">Recent Achievements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {unlockedAchievements.map((achievement: Achievement) => (
            <div
              key={achievement.id}
              className="flex items-center gap-4 rounded-lg p-3 transition-colors bg-purple-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
                {achievementIcons[achievement.id as AchievementIcon]}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{achievement.title}</h3>
                <p className="text-sm text-gray-500">{achievement.description}</p>
              </div>
              {achievement.date && (
                <div className="text-xs text-gray-500">
                  {new Date(achievement.date).toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
          <div className="text-center">
            <Link href="/achievements">
              <Button variant="link" className="text-purple-600 hover:text-purple-700">
                View All Achievements
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
