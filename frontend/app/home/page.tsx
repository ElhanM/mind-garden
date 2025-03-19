'use client';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Image from 'next/image'; // Import Next.js Image component
import { CardWithTitle } from '@/components/ui/card-with-title';
import { AchievementsList } from '@/components/achievements-list';
import { MoodHistory } from '@/components/mood-history';
import { PageLayout } from '@/components/page-layout';
import { WPBar } from '@/components/ui/wp-bar';
import { fetchWPStatus } from '@/app/api-client/check-in';

export default function Home() {
  const { data: session } = useSession();
  const email = session?.user.email ?? '';
  const [wp, setWP] = useState(0);

  // Fetch WP status when the component mounts or when the email changes
  useEffect(() => {
    async function getWP() {
      if (email) {
        try {
          const response = await fetchWPStatus(email);
          setWP(response.wp); // Update the WP state
        } catch (error) {
          console.error('Failed to fetch WP status:', error);
        }
      }
    }
    getWP();
  }, [email]);

  // Function to refresh WP dynamically
  const refreshWP = async () => {
    if (email) {
      try {
        const response = await fetchWPStatus(email);
        setWP(response.wp); // Update the WP state
      } catch (error) {
        console.error('Failed to refresh WP status:', error);
      }
    }
  };

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
          {/* Pass the dynamically updated WP and refresh function to WPBar */}
          <WPBar wp={wp} refreshWP={refreshWP} />
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

// OVAJ REFRESH ZEZA, NIKAKO DA FETCH-A DATA KAKO TREBA
// TREBA SE SKLONITI BUTTON OVAJ I DINAMICKI SKONTAT KAKO DA SE REFRESH-A
