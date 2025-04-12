import api from '../axios-config';

export const fetchChatHistory = async (email: string) => {
  const response = await api.get('/api/chat/history', {
    headers: {
      'user-email': email,
    },
  });

  if (response.data.success !== true) {
    throw new Error(response.data.message);
  }

  return response.data.results.messages;
};

export const deleteChatHistory = async (email: string) => {
  const response = await api.delete('/api/chat/delete', {
    data: { email },
  });

  if (response.data.success !== true) {
    throw new Error(response.data.message);
  }

  return response.data;
};
