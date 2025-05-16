// app/providers.tsx
'use client';

import { ReactNode, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useWPStore } from '@/store/store';
import api from '@/app/api-client/axios-config';
import { LevelTransitionModal } from '@/components/level-transition-modal';
import { useSession } from 'next-auth/react';

export function WPProvider({ children }: { children: ReactNode }) {
  const setWP = useWPStore((s) => s.setWP);
  const setLevel = useWPStore((s) => s.setLevel);
  const { data: session } = useSession();
  const email = session?.user?.email ?? '';

  function GlobalModals() {
    const modalOpen = useWPStore((s) => s.modalOpen);
    const closeModal = useWPStore((s) => s.closeModal);
    const transitionType = useWPStore((s) => s.transitionType);

    return (
      <LevelTransitionModal
        isOpen={modalOpen}
        onClose={closeModal}
        transitionType={transitionType}
      />
    );
  }

  const {
    data: wp,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['wp-status', email],
    queryFn: async () => {
      const res = await api.get('/api/wp/wp-status');

      return (res.data.results.wp + 90) as number;
    },
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (wp !== undefined) {
      setWP(wp);

      const level = wp <= 90 ? 1 : wp <= 190 ? 2 : wp <= 290 ? 3 : 4;
      setLevel(level); // Zustand handles transitions and modals now
    }
  }, [wp, setWP, setLevel]);

  return (
    <>
      {children}
      <GlobalModals />
    </>
  );
}
