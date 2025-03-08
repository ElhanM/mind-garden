import { AxiosError } from 'axios';
const errorCatch = (error: Error) => {
  let errorMessage = 'An unknown error occurred';

  if (error instanceof AxiosError) {
    errorMessage = error.response?.data?.message || 'A server error occurred';
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return errorMessage;
};

export default errorCatch;
