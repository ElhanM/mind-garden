'use client';
import { CardWithTitle } from '@/components/ui/card-with-title';
import { PageLayout } from '@/components/page-layout';
import Image from 'next/image';
import { StreaksCalendar } from '@/components/streaks-calendar';
import { MoodGraph } from '@/components/mood-graph';
import { useSession } from 'next-auth/react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';

  // Used to get high quality profile image
  const profileImage = session?.user.image
    ? session.user.image.split('=')[0] // Remove size constraints from Google URL
    : '/Logo.png';

  return (
    <PageLayout>
      <div className="grid gap-6 md:grid-cols-2">
        {/* First row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:col-span-2">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow">
            <CardWithTitle title="Personal Information">
              <div className="mb-6 flex justify-center">
                {isLoading ? (
                  <Skeleton className="h-[145px] w-[145px] rounded-full" />
                ) : (
                  <Image
                    src={profileImage || '/placeholder.svg'}
                    alt="Profile Picture"
                    width={145}
                    height={145}
                    quality={100}
                    className="rounded-full"
                    priority
                  />
                )}
              </div>
              <hr />
              <div className="space-y-4 mt-2">
                <div className="grid w-full items-center gap-1.5">
                  <span className="font-bold">User Name:</span>
                  {isLoading ? (
                    <Skeleton className="h-6 w-[200px]" />
                  ) : (
                    <span>{session?.user.name}</span>
                  )}
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <span className="font-bold">E-mail:</span>
                  {isLoading ? (
                    <Skeleton className="h-6 w-[250px]" />
                  ) : (
                    <span>{session?.user.email}</span>
                  )}
                </div>
              </div>
            </CardWithTitle>
          </div>

          {/* Your Streaks */}
          <div className="bg-white rounded-lg shadow">
            <CardWithTitle title="Your Streaks">
              <StreaksCalendar />
            </CardWithTitle>
          </div>
        </div>

        {/* Second row - Empty left column */}
        <div className="hidden md:block">{/* This column is intentionally left empty */}</div>

        {/* Second row - Mood History (right column) */}
        <div className="bg-white rounded-lg shadow">
          <CardWithTitle title="Mood History">
            <MoodGraph />
          </CardWithTitle>
        </div>
      </div>
    </PageLayout>
  );
}
