import { getAuthHeaders } from './getAuthHeaders';
import { signOut } from 'next-auth/react';

export const generateAIResponse = async (
  email: string,
  input: string,
  onToken?: (token: string) => void,
  streamDelay = 0
) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ email, input }),
  });

  if (!response.body) throw new Error('No response body');

  if (response.status === 401) {
    console.warn('Token expired or unauthorized. Logging out...');
    await signOut({ callbackUrl: '/' });
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let result = '';
  let buffer = '';

  const processToken = async (token: string) => {
    const processedToken = token === '' ? '\n' : token;

    result += processedToken;
    if (onToken) {
      onToken(processedToken);
      if (streamDelay > 0) {
        await new Promise((resolve) => setTimeout(resolve, streamDelay));
      }
    }
  };

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);

      buffer += chunk;

      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;
        if (line.startsWith('data:')) {
          let content;
          if (line.startsWith('data: ')) {
            content = line.substring(6);
          } else {
            content = line.substring(5);
          }

          if (content === '[DONE]') {
            return result;
          }
          if (content === '[ERROR]') throw new Error('Stream Error from server');

          await processToken(content);
        }
      }
    }
  } catch (error) {
    console.error('Error in stream processing:', error);
    throw error;
  }

  return result;
};
