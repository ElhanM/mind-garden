import api from '../axios-config';
import type { CheckInFormData } from '../../../validation/check-in-schema';

// Function to check if user has already checked in today
export const fetchTodayCheckIn = async (userId: number | null) => {
  if (!userId) return null;

  const response = await api.get(`/api/check-ins`, {
    headers: { 'user-id': userId },
  });

  return response.data.results;
};

// Function to submit a new check-in
export const submitCheckIn = async (data: CheckInFormData & { userId: number }) => {
  const response = await api.post(`/api/check-ins`, data);
  return response.data.results;
};
