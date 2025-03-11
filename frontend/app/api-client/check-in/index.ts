import api from '../axios-config';
import type { CheckInFormData } from '../../../validation/check-in-schema';

// Function to check if user has already checked in today
export const fetchTodayCheckIn = async (email: string | null) => {
  if (!email) return null;

  const response = await api.get(`/api/check-ins`, {
    headers: { 'user-email': email }, // Correcting the header
  });

  if (response.data.success !== true) {
    throw new Error(response.data.message);
  }

  return response.data.results;
};

export const submitCheckIn = async (data: CheckInFormData, email: string) => {
  const response = await api.post(
    `/api/check-ins`,
    { ...data },
    {
      headers: { 'user-email': email }, // Email is now in headers
    }
  );

  if (response.data.success !== true) {
    throw new Error(response.data.message);
  }

  return response.data.results;
};
