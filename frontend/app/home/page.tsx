'use client';
import { useSession } from 'next-auth/react';
import Image from 'next/image'; // Import Next.js Image component
import { CardWithTitle } from '@/components/ui/card-with-title';
import { AchievementsList } from '@/components/achievements-list';
import { MoodHistory } from '@/components/mood-history';
import { PageLayout } from '@/components/page-layout';
import { WPBar } from '@/components/ui/wp-bar';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export default function Home() {
  const { data: session } = useSession();
  const userId = session?.user.id ?? '';

  // Fetch WP status using React Query
  const {
    data: wp = 0,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['wp-status', userId], // Query key includes id for user-specific caching
    queryFn: async () => {
      if (!userId) throw new Error('User id is required');
      const response = await axios.get('/api/wp/wp-status', {
        headers: { 'user-id': userId }, // Assuming user id is available in session
      });
      return response.data.wp;
    },
    enabled: !!userId, // Only fetch if id is available
    refetchOnWindowFocus: true, // Automatically refetch when the window regains focus
  });

  // Determine the bonsai tree level based on WP
  const getBonsaiTreeImage = () => {
    if (wp >= 0 && wp <= 90) return '/BonsaiLevel1.gif';
    if (wp >= 100 && wp <= 190) return '/BonsaiLevel2.gif';
    if (wp >= 200 && wp <= 290) return '/BonsaiLevel3.gif';
    if (wp >= 300 && wp <= 400) return '/BonsaiLevel4.gif';
    return '/BonsaiLevel4.gif'; // Default to level 4 if WP is out of range, go beyond 400
  };

  return (
    <PageLayout>
      <div className="grid gap-10 md:grid-cols-2">
        <section className="flex flex-col items-center justify-center">
          {/* Dynamically render the bonsai tree image */}
          <div className="h-[300px] w-full max-w-md md:h-[400px]">
            <Image
              src={getBonsaiTreeImage()}
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
