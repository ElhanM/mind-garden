'use client';
import { PageLayout } from '@/components/page-layout';
import { CardWithTitle } from '@/components/ui/card-with-title';
import { useState, useEffect } from 'react';
import { useAchievementsQuery } from '../api-client/achievements';
import { useSession } from 'next-auth/react';
import { AchievementIcon, achievementIcons } from '../api-client/achievements/achievementIcons';
import { toast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Achievement } from '@/types/Achievement';

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  const [unlockedAchievements, setUnlockedAchievements] = useState<Set<number>>(new Set());
  const { data: session } = useSession();
  const email = session?.user?.email ?? '';
  // Currently, logged-in user

  const { data, isError, error, isSuccess } = useAchievementsQuery(email);
  // Fetch achievements for the logged-in user from backend

  useEffect(() => {
    if (isSuccess && data?.achievements) {
      // New data is fetched
      setAchievements(data.achievements);
      setLoading(false);

      data.achievements.forEach((achievement: Achievement) => {
        // Loop through each achievement
        // I cannot use 'achievement' directly as it is defined in backend???
        if (achievement.unlocked && !unlockedAchievements.has(achievement.id)) {
          // Check if achievement is unlocked and toast notification is not already shown
          toast({
            title: `${achievement.title} Unlocked!`,
            description: achievement.description,
            variant: 'default', // Use default here???
          });

          // Safely update the set of unlocked achievements
          setUnlockedAchievements((prev) => {
            const newSet = new Set(prev);
            newSet.add(achievement.id);
            return newSet;
          });
        }
      });
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (isError && error instanceof Error) {
      setAchievements([]);
      setLoading(false);
      toast({
        title: 'Error!',
        description: error.message,
        variant: 'destructive',
      });
    }
  }, [isError, error]);

  if (loading) {
    return (
      <PageLayout>
        <CardWithTitle title="Your Achievements">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center gap-4 rounded-lg p-3 transition-colors">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-1/3 mb-2" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        </CardWithTitle>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <CardWithTitle title="Your Achievements">
        <div className="space-y-4">
          {achievements.length === 0 && (
            <div className="text-sm text-red-500">Achievements could not be fetched.</div>
          )}

          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`flex items-center gap-4 rounded-lg p-3 transition-colors ${
                !achievement.unlocked && 'opacity-60'
              }`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
                {achievementIcons[achievement.id as AchievementIcon]}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{achievement.title}</h3>
                <p className="text-sm text-gray-500">{achievement.description}</p>
              </div>
              {achievement.unlocked && achievement.date && (
                <div className="text-xs text-gray-500">
                  {new Date(achievement.date).toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardWithTitle>
    </PageLayout>
  );
}
