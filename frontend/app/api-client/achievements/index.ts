import { useQuery } from '@tanstack/react-query';
import api from '../axios-config';

async function fetchAchievements() {
  const response = await api.get('/api/achievements/');

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
    queryFn: () => fetchAchievements(),
    enabled: !!email,
  });
}
