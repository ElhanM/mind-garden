import api from '../axios-config';
import { useQuery } from '@tanstack/react-query';

export const getMoodHistory = async () => {
  const response = await api.get(`/api/check-ins/mood`);

  if (response.data.success !== true) {
    throw new Error(response.data.message);
  }

  return response.data.results;
};

export function useMoodHistory(email: string) {
  return useQuery({
    queryKey: ['moodHistory', email],
    queryFn: () => {
      if (!email) return Promise.resolve([]);
      return getMoodHistory();
    },
    enabled: !!email,
  });
}
