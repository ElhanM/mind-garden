'use client';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { WPBar } from '@/components/ui/wp-bar';
import { PageLayout } from '@/components/page-layout';
import { CardWithTitle } from '@/components/ui/card-with-title';
import { MoodHistory } from '@/components/mood-history';
import { AchievementsList } from '@/components/achievements-list';

import { useCheckInHistory, useStreak } from '../api-client/check-in';
import { useAchievementsQuery } from '../api-client/achievements';
import errorCatch from '../api-client/error-message';
import { useWPStore } from '@/store/store';
import type { Achievement } from '@/types/Achievement';

export default function Home() {
  const { data: session } = useSession();
  const email = session?.user?.email ?? '';

  const wp = useWPStore((s) => s.wp);

  const { data: checkIns, isLoading: isCheckInsLoading } = useCheckInHistory(email);

  const {
    data: achievements,
    isLoading: isAchievementsLoading,
    isError: isAchievementsError,
    error: achievementsError,
  } = useAchievementsQuery(email);

  const {
    data: streakData,
    isLoading: isStreakLoading,
    error: streakError,
    isSuccess: streakSuccess,
  } = useStreak(email);

  const [streakDisplay, setStreakDisplay] = useState<React.ReactNode>(<Spinner />);

  useEffect(() => {
    if (isStreakLoading) {
      setStreakDisplay(<Spinner />);
    } else if (streakError) {
      setStreakDisplay('No data');
    } else if (streakSuccess) {
      setStreakDisplay(`${streakData?.streak ?? 0} days`);
    }
  }, [isStreakLoading, streakError, streakSuccess, streakData]);

  const totalCheckIns = checkIns?.length ?? 0;
  const unlockedAchievements =
    achievements?.achievements?.filter((a: Achievement) => a.unlocked) ?? [];
  const totalAchievements = unlockedAchievements.length;

  const isLoading = isCheckInsLoading || isAchievementsLoading || isStreakLoading;
  const isError = isAchievementsError || !!streakError;

  const getBonsaiTreeImage = (wp: number) => {
    if (wp <= 90) return '/BonsaiLevel1.gif';
    if (wp <= 190) return '/BonsaiLevel2.gif';
    if (wp <= 290) return '/BonsaiLevel3.gif';
    return '/BonsaiLevel4.gif';
  };

  return (
    <PageLayout>
      {isError ? (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-500">Error</h1>
            <p className="text-gray-700">
              {isAchievementsError && achievementsError
                ? errorCatch(achievementsError)
                : streakError
                  ? errorCatch(streakError)
                  : 'An unknown error occurred.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="md:grid md:gap-10 md:grid-cols-2">
          <section className="flex flex-col items-center justify-center">
            <div className="h-[300px] w-full max-w-md mb-4">
              {!isLoading && wp !== undefined ? (
                <Image
                  src={getBonsaiTreeImage(wp)}
                  alt="Bonsai Tree"
                  width={400}
                  height={400}
                  className="object-contain w-full h-full"
                />
              ) : (
                <Skeleton className="h-[300px] w-full rounded-lg" />
              )}
            </div>

            <div className="h-[106px] w-full max-w-md mb-4">
              {!isLoading && wp !== undefined ? (
                <WPBar wp={wp} />
              ) : (
                <Skeleton className="h-[106px] w-full rounded-lg" />
              )}
            </div>

            <div className="mt-10 w-full max-w-md rounded-lg border border-gray-200 bg-white p-4 text-sm shadow-sm">
              <div className="mb-2 font-medium text-amber-800">Tree Levels</div>
              <div className="grid grid-cols-1 gap-1">
                {[
                  { level: 'Level 1', range: '0-90 WP' },
                  { level: 'Level 2', range: '100-190 WP' },
                  { level: 'Level 3', range: '200-290 WP' },
                  { level: 'Level 4', range: '300-400 WP' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-amber-700">{item.level}:</span>
                    <span className="text-amber-600">{item.range}</span>
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
                    value: streakDisplay,
                    bgColor: 'bg-purple-100',
                    textColor: 'text-purple-700',
                  },
                  {
                    label: 'Check-ins',
                    value: isCheckInsLoading ? <Spinner /> : totalCheckIns,
                    bgColor: 'bg-blue-100',
                    textColor: 'text-blue-700',
                  },
                  {
                    label: 'Achievements',
                    value: isAchievementsLoading ? <Spinner /> : totalAchievements,
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
      )}
    </PageLayout>
  );
}
