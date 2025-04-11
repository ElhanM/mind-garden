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

  // processing token, ako je null biva \n
  const processToken = async (token: string) => {
    const processedToken = token === '' ? '\n' : token;

    console.log('Processed token: ', processedToken);

    result += processedToken;
    if (onToken) {
      onToken(processedToken);
      if (streamDelay > 0) {
        //moze se igrat sa streamdelayom
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

      const lines = buffer.split('\n'); //this line fixed the bad markdown distancing, a delimiter of \n
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmedLine = line.trim(); // Trim spaces or empty messages
        if (!trimmedLine) continue;
        if (line.startsWith('data:')) {
          let content;
          //this cuts the data: prefix that chunks come in
          if (line.startsWith('data: ')) {
            content = line.substring(6); //'data: '
          } else {
            content = line.substring(5); // 'data:'
          }

          if (content === '[DONE]') {
            return result; //return without don
          }
          if (content === '[ERROR]') throw new Error('Stream Error from server');
          console.log('Content', content);

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
