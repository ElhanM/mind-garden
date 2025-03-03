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

  return (
    <PageLayout>
      <div className="grid gap-6 md:grid-cols-2 items-stretch">
        <div className="h-fit bg-white p-6 rounded-lg shadow">
          <CardWithTitle title="Personal Information">
            <div className="mb-6 flex justify-center">
              {isLoading ? (
                <Skeleton className="h-[145px] w-[145px] rounded-full" />
              ) : (
                <Image
                  src={session?.user.image || '/Logo.png'}
                  alt="Profile Picture"
                  width={145}
                  height={145}
                  className="rounded-full"
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
        <div className="space-y-6">
          <CardWithTitle title="Your Streaks">
            <StreaksCalendar />
          </CardWithTitle>
          <CardWithTitle title="Mood History">
            <MoodGraph />
          </CardWithTitle>
        </div>
      </div>
    </PageLayout>
  );
}
