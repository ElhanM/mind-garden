import axios from 'axios';
import { getSession } from 'next-auth/react';

// env guard
if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error(
    'NEXT_PUBLIC_API_URL is not defined. Please set it in your environment variables.'
  );
}

// Create an Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Ensure base URL is set
});

// Attach request interceptor to include user email
api.interceptors.request.use(
  async (config) => {
    const session = await getSession(); // Get session for user info
    if (session?.user?.email) {
      config.headers = config.headers || {};
      config.headers['user-email'] = session.user.email;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
