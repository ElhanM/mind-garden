import { useQuery } from '@tanstack/react-query';
import api from '../axios-config';

async function fetchAchievements(email: string) {
  const response = await api.get(`${process.env.NEXT_PUBLIC_API_URL}/api/achievements/`, {
    headers: {
      'user-email': email,
    },
  });

  if (response.data.success !== true) {
    throw new Error(response.data.message || 'Failed to fetch achievements');
  }

  if (!response.data.results || !Array.isArray(response.data.results.achievements)) {
    throw new Error(response.data.message || 'Invalid response format');
  }

  return response.data.results;
}

export function useAchievementsQuery(email: string) {
  return useQuery({
    queryKey: ['achievements', email],
    queryFn: () => fetchAchievements(email),
    enabled: !!email,
  });
}
