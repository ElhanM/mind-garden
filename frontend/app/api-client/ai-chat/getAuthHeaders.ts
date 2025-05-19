import { getSession } from 'next-auth/react';

export const getAuthHeaders = async () => {
  const session = await getSession();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (session?.user?.email) {
    headers['user-email'] = session.user.email;
  }

  if (session?.idToken) {
    headers['Authorization'] = `Bearer ${session.idToken}`;
  }

  return headers;
};
