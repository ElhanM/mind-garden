import api from '../axios-config';
import type { CheckInFormData } from '../../../validation/check-in-schema';

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

export async function fetchCheckInsHistory(email: string) {
  const response = await api.get(`/api/check-ins/history`, {
    method: 'GET',
  });

  if (response.data.success !== true) {
    throw new Error(response.data.message);
  }

  return response.data.results;
}
