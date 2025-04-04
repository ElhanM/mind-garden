export const generateAIResponse = async (
  email: string,
  input: string,
  onToken?: (token: string) => void,
  streamDelay = 0 // Optional delay in ms between tokens for better UX
) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, input }),
  });

  if (!response.body) throw new Error('No response body');

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let result = '';
  let buffer = '';

  // Helper function to process a token with optional delay
  const processToken = async (token: string) => {
    // Handle empty tokens as line breaks
    const processedToken = token === '' ? '\n' : token;

    result += processedToken;
    if (onToken) {
      onToken(processedToken);
      // Add optional delay for better UX if specified
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
      // console.log('Decoded chunk:', chunk); // Log the raw chunk received

      buffer += chunk;

      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      // console.log('Remaining buffer:', buffer); // Log the remaining buffer

      for (const line of lines) {
        // console.log('Processing line:', line); // Log each line being processed

        if (line.startsWith('data:')) {
          // Extract content after "data:", handling both formats (with or without space)
          let content;
          if (line.startsWith('data: ')) {
            content = line.substring(6); // Skip "data: "
          } else {
            content = line.substring(5); // Skip "data:"
          }

          if (content === '[DONE]') {
            return result; // Return without appending [DONE]
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
