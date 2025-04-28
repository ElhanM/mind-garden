'use client';
import { PageLayout } from '@/components/page-layout';
import { CardWithTitle } from '@/components/ui/card-with-title';
import { useState, useEffect } from 'react';
import { fetchAchievements } from '../api-client/achievements';
import { useSession } from 'next-auth/react';
import { AchievementIcon, achievementIcons } from '../api-client/achievements/achievementIcons';

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const email = session?.user.email ?? '';

  useEffect(() => {
    async function loadAchievements(email: string) {
      try {
        const results = await fetchAchievements(email);
        console.log('Fetched achievements:', results);

        setAchievements(results.achievements);
      } catch (error) {
        console.error('Error loading achievements:', error);
      } finally {
        setLoading(false);
      }
    }

    loadAchievements(email);
  }, []);

  if (loading) {
    return (
      <PageLayout>
        <CardWithTitle title="Your Achievements">
          <div className="space-y-4">
            {/* Default to 5 skeleton loaders */}
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center gap-4 rounded-lg p-3 transition-colors">
                {/* Skeleton for the icon */}
                <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>

                {/* Skeleton for title and description */}
                <div className="flex-1">
                  <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-3 w-2/3 bg-gray-200 rounded animate-pulse"></div>
                </div>

                {/* Skeleton for the date */}
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
