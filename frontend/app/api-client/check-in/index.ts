import api from '../axios-config';
import type { CheckInFormData } from '../../../validation/check-in-schema';
import { useQuery } from '@tanstack/react-query';

export const fetchTodayCheckIn = async (email: string | null) => {
  if (!email) return null;

  const response = await api.get(`/api/check-ins`);

  if (response.data.success !== true) {
    throw new Error(response.data.message);
  }

  return response.data.results;
};

export const submitCheckIn = async (data: CheckInFormData, email: string) => {
  const response = await api.post(`/api/check-ins`, { ...data });

  if (response.data.success !== true) {
    throw new Error(response.data.message);
  }

  return response.data.results;
};

export async function fetchCheckInsHistory() {
  const response = await api.get(`/api/check-ins/history`, {
    method: 'GET',
  });

  if (response.data.success !== true) {
    throw new Error(response.data.message);
  }

  return response.data.results;
}

export const fetchStreak = async () => {
  const response = await api.get(`/api/check-ins/streak`);

  if (response.data.success !== true) {
    throw new Error(response.data.message || 'Failed to fetch streak');
  }

  return response.data.results;
};

export function useCheckInHistory(email: string) {
  return useQuery({
    queryKey: ['checkIns', email],
    queryFn: () => {
      if (!email) return Promise.resolve([]);
      return fetchCheckInsHistory();
    },
    enabled: !!email,
  });
}

export function useStreak(email: string) {
  return useQuery({
    queryKey: ['streak', email],
    queryFn: () => {
      if (!email) return Promise.resolve(null);
      return fetchStreak();
    },
    enabled: !!email,
  });
}
