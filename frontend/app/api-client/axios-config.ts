import axios from 'axios';
import { getSession } from 'next-auth/react';

if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error(
    'NEXT_PUBLIC_API_URL is not defined. Please set it in your environment variables.'
  );
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use(
  async (config) => {
    const session = await getSession();

    if (session?.idToken) {
      // Use idToken instead of accessToken
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${session.idToken}`; // Add the idToken here
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
