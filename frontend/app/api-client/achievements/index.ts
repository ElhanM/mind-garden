import api from '../axios-config';
export async function fetchAchievements(email: string) {
  if (!email) {
    throw new Error('Missing email. Log in!');
  }
  const response = await api.get(`${process.env.NEXT_PUBLIC_API_URL}/api/achievements/`, {
    headers: {
      'user-email': email,
    },
  });
  if (response.data.success !== true) {
    throw new Error(response.data.message);
  }
  return response.data.results;
}
