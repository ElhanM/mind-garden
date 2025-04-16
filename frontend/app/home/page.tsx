'use client';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { CardWithTitle } from '@/components/ui/card-with-title';
import { AchievementsList } from '@/components/achievements-list';
import { MoodHistory } from '@/components/mood-history';
import { PageLayout } from '@/components/page-layout';
import { WPBar } from '@/components/ui/wp-bar';
import { useQuery } from '@tanstack/react-query';
import api from '@/app/api-client/axios-config'; //  custom axios with email header

export default function Home() {
  const { data: session } = useSession();

  const {
    data: wp = 0,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['wp-status', session?.user?.email], // email is still useful for cache key
    queryFn: async () => {
      const response = await api.get('/api/wp/wp-status'); // no need to add headers
      return response.data.wp;
    },
    enabled: !!session?.user?.email,
    refetchOnWindowFocus: true,
  });

  // Determine the bonsai tree level based on WP
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
            <Image
              src={getBonsaiTreeImage(wp)}
              alt="Bonsai Tree"
              width={400}
              height={400}
              className="object-contain"
            />
          </div>
          {/* Pass the dynamically updated WP to WPBar */}
          <WPBar wp={wp} />
          <div className="mt-10 w-full max-w-md rounded-lg border border-gray-200 bg-amber-50 p-4 text-sm shadow-sm">
            <div className="mb-2 font-medium text-amber-800">Tree Levels</div>
            <div className="grid grid-cols-1 gap-1">
              <div className="flex justify-between">
                <span className="text-amber-700">Level 1:</span>
                <span className="text-amber-600">0-90 WP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-700">Level 2:</span>
                <span className="text-amber-600">100-190 WP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-700">Level 3:</span>
                <span className="text-amber-600">200-290 WP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-700">Level 4:</span>
                <span className="text-amber-600">300-400 WP</span>
              </div>
            </div>
          </div>
        </section>
        <section className="space-y-6">
          <CardWithTitle title="Your Progress">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  label: 'Current Streak',
                  value: '7 days',
                  bgColor: 'bg-purple-100',
                  textColor: 'text-purple-700',
                },
                {
                  label: 'Check-ins',
                  value: '32',
                  bgColor: 'bg-blue-100',
                  textColor: 'text-blue-700',
                },
                {
                  label: 'Achievements',
                  value: '8',
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
