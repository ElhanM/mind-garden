import api from './axios-config';
import axios from 'axios';
import type { CheckInFormData } from './check-in-schema';

// Function to check if user has already checked in today
export const fetchTodayCheckIn = async (userId: number | null) => {
  if (!userId) return null;

  try {
    const response = await api.get(`/api/check-ins`, {
      headers: { 'user-id': userId },
    });
    return response.data.results;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

// Function to submit a new check-in
export const submitCheckIn = async (data: CheckInFormData & { userId: number }) => {
  try {
    const response = await api.post(`/api/check-ins`, data);
    return response.data.results;
  } catch (error) {
    throw error;
  }
};
