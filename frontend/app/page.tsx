'use client';

import { Button } from '@/components/ui/button';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Root() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isLoading = status === 'loading';

  const handleAction = () => {
    if (session) {
      router.push('/home');
    } else {
      signIn('google', { callbackUrl: '/home' });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-purple-50 to-blue-50 p-4">
      <div className="w-full max-w-md rounded-lg border bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-3xl font-bold text-purple-700">
          Welcome to MindGarden
        </h1>
        <p className="mb-8 text-center text-gray-600">
          Nurture your mental wellness journey with daily reflections and mindfulness practices.
        </p>
        <div className="flex flex-col gap-4">
          <Button onClick={handleAction} className="w-full" disabled={isLoading}>
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
}
