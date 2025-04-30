'use client';
import { PageLayout } from '@/components/page-layout';
import { CardWithTitle } from '@/components/ui/card-with-title';
import { useState, useEffect } from 'react';
import { useAchievementsQuery } from '../api-client/achievements';
import { useSession } from 'next-auth/react';
import { AchievementIcon, achievementIcons } from '../api-client/achievements/achievementIcons';
import { toast } from '@/hooks/use-toast';

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const email = session?.user.email ?? '';
  const { data, isError, error } = useAchievementsQuery(email);

  useEffect(() => {
    if (data) {
      setAchievements(data.achievements);
      setLoading(false);
    } else if (isError && error instanceof Error) {
      toast({
        title: 'Error!',
        description: error.message,
        variant: 'destructive',
      });
      setAchievements([]);
      setLoading(false);
    }
  }, [data, isError, error]);

  if (loading) {
    return (
      <PageLayout>
        <CardWithTitle title="Your Achievements">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center gap-4 rounded-lg p-3 transition-colors">
                <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>

                <div className="flex-1">
                  <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-3 w-2/3 bg-gray-200 rounded animate-pulse"></div>
                </div>

                <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
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
