'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { CardWithTitle } from '@/components/ui/card-with-title';
import { AchievementsList } from '@/components/achievements-list';
import { MoodHistory } from '@/components/mood-history';
import { PageLayout } from '@/components/page-layout';
import { WPBar } from '@/components/ui/wp-bar';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton'; // Use the custom Skeleton component
import api from '@/app/api-client/axios-config'; // Custom axios with email header
import { useCheckInHistory } from '../api-client/check-in';
import { Spinner } from '@/components/ui/spinner';
import { useAchievementsQuery } from '../api-client/achievements';
import type { Achievement } from '@/types/Achievement';
import { useStreak } from '../api-client/check-in';

export default function Home() {
  const { data: session } = useSession();
  const email = session?.user?.email ?? '';
  const {
    data,
    isLoading: isWpLoading,
    error: wpError,
  } = useQuery({
    queryKey: ['wp-status', email],
    queryFn: async () => {
      const response = await api.get('/api/wp/wp-status');
      return response.data.results.wp;
    },
    enabled: !!email,
    refetchOnWindowFocus: true,
  });
  const { data: checkIns, isLoading: isCheckInsLoading } = useCheckInHistory(email);
  const {
    data: achievements,
    isLoading: isAchievementsLoading,
    isError,
    error: achievementsError,
  } = useAchievementsQuery(email);
  const { data: streakData, isLoading: isStreakLoading, error: streakError } = useStreak(email);

  const totalCheckIns = checkIns?.length ?? 0;
  const unlockedAchievements =
    achievements?.achievements?.filter((a: Achievement) => a.unlocked) ?? [];
  const totalAchievements = unlockedAchievements.length;
  const displayedStreak = streakData?.streak ?? 0;

  const isLoading = isWpLoading || isCheckInsLoading || isAchievementsLoading || isStreakLoading;

  const getBonsaiTreeImage = (wp: number) => {
    if (wp <= 90) {
      return '/BonsaiLevel1.gif';
    } else if (wp <= 190) {
      return '/BonsaiLevel2.gif';
    } else if (wp <= 290) {
      return '/BonsaiLevel3.gif';
    } else {
      return '/BonsaiLevel4.gif';
    }
  };

  return (
    <PageLayout>
      <div className="grid gap-10 md:grid-cols-2">
        <section className="flex flex-col items-center justify-center">
          {/* Dynamically render the bonsai tree image */}
          <div className="h-[300px] w-full max-w-md md:h-[400px]">
            {!isLoading && data !== undefined ? (
              <Image
                src={getBonsaiTreeImage(data)}
                alt="Bonsai Tree"
                width={400}
                height={400}
                className="object-contain w-full max-w-md h-[300px] md:h-[400px]"
              />
            ) : (
              <Skeleton className="h-[300px] w-[300px] rounded-lg mx-auto mt-6" />
            )}
          </div>

          {/* Pass the dynamically updated WP to WPBar */}
          {!isLoading && data !== undefined ? (
            <WPBar wp={data} />
          ) : (
            <Skeleton className="h-[106px] w-[448px] rounded-lg mx-auto mt-6" />
          )}
          <div className="mt-10 w-full max-w-md rounded-lg border border-gray-200 bg-white p-4 text-sm shadow-sm">
            <div className="mb-2 font-medium text-amber-800">Tree Levels</div>
            <div className="grid grid-cols-1 gap-1">
              {[
                {
                  level: 'Level 1',
                  range: '0-90 WP',
                  levelColor: 'text-amber-700',
                  rangeColor: 'text-amber-600',
                },
                {
                  level: 'Level 2',
                  range: '100-190 WP',
                  levelColor: 'text-amber-700',
                  rangeColor: 'text-amber-600',
                },
                {
                  level: 'Level 3',
                  range: '200-290 WP',
                  levelColor: 'text-amber-700',
                  rangeColor: 'text-amber-600',
                },
                {
                  level: 'Level 4',
                  range: '300-400 WP',
                  levelColor: 'text-amber-700',
                  rangeColor: 'text-amber-600',
                },
              ].map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span className={item.levelColor}>{item.level}:</span>
                  <span className={item.rangeColor}>{item.range}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="space-y-6">
          <CardWithTitle title="Your Progress">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  label: 'Current Streak',
                  value:
                    isStreakLoading || !displayedStreak ? (
                      <Spinner />
                    ) : streakError ? (
                      'No data'
                    ) : displayedStreak > 0 ? (
                      `${displayedStreak} days`
                    ) : (
                      'No streak'
                    ),
                  bgColor: 'bg-purple-100',
                  textColor: 'text-purple-700',
                },
                {
                  label: 'Check-ins',
                  value:
                    isCheckInsLoading || !totalCheckIns ? (
                      <Spinner />
                    ) : checkIns?.length === undefined ? (
                      'No data'
                    ) : (
                      checkIns.length
                    ),
                  bgColor: 'bg-blue-100',
                  textColor: 'text-blue-700',
                },
                {
                  label: 'Achievements',
                  value:
                    isAchievementsLoading || !totalAchievements ? (
                      <Spinner />
                    ) : achievementsError ? (
                      'No data'
                    ) : (
                      totalAchievements
                    ),
                  bgColor: 'bg-amber-100',
                  textColor: 'text-amber-700',
                },
              ].map((item, index) => (
                <div key={index} className={`rounded-lg ${item.bgColor} p-4 text-center`}>
                  <p className={`text-sm ${item.textColor}`}>{item.label}</p>
                  <p className={`text-3xl font-bold ${item.textColor}`}>{item.value}</p>
                </div>
              ))}
            </div>
          </CardWithTitle>
          <MoodHistory />
          <AchievementsList />
        </section>
      </div>
    </PageLayout>
  );
}
