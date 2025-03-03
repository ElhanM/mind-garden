'use client';

import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function SessionGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Allow access to root page regardless of authentication
    if (pathname === '/') return;

    // If the user is not authenticated and the page is not loading, redirect to root
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [pathname, router, status]);

  return <>{children}</>;
}
