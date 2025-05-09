'use client';

import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export function GetStartedButton() {
  const router = useRouter();
  const { status } = useSession();
  const isLoading = status === 'loading';

  const handleAction = () => {
    if (status === 'authenticated') {
      router.push('/home');
    } else {
      signIn('google', { callbackUrl: '/home' });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Button
        onClick={handleAction}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white py-6"
        disabled={isLoading}
      >
        Get Started
      </Button>
      <p className="text-center text-xs text-gray-500 mt-2">
        Begin your journey to a more mindful and balanced life today
      </p>
    </div>
  );
}
