import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../axios-config';
import type { ChatMessage } from '@/types/Chat';

interface ChatHistoryResponse {
  messages: ChatMessage[];
  total: number;
}

export const useChatHistory = (email: string, limit = 5) => {
  return useInfiniteQuery({
    queryKey: ['chatHistory', email],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await api.get('/api/chat/history', {
        headers: {
          'user-email': email,
        },
        params: {
          offset: pageParam,
          limit,
        },
      });
      console.log('Fetching page with offset:', pageParam);
      console.log('Response:', response.data);

      if (response.data.success !== true) {
        throw new Error(response.data.message);
      }

      return {
        messages: response.data.results.messages,
        total: response.data.results.total,
        nextCursor: pageParam + limit < response.data.results.total ? pageParam + limit : undefined,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: !!email,
  });
};

export const useDeleteChatHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (email: string) => {
      const response = await api.delete('/api/chat/history/delete', {
        data: { email },
      });

      if (response.data.success !== true) {
        throw new Error(response.data.message);
      }

      return {
        success: response.status === 200,
        message: response.data.results.message,
      };
    },
    onSuccess: (_, email) => {
      queryClient.invalidateQueries({ queryKey: ['chatHistory', email] });
    },
  });
};

export const useAddChatMessage = () => {
  const queryClient = useQueryClient();

  return {
    addMessage: (email: string, message: ChatMessage) => {
      queryClient.setQueryData(['chatHistory', email], (oldData: any) => {
        if (!oldData) return { pages: [{ messages: [message], total: 1 }], pageParams: [0] };

        const newFirstPage = {
          ...oldData.pages[0],
          messages: [...oldData.pages[0].messages, message],
          total: oldData.pages[0].total + 1,
        };

        return {
          ...oldData,
          pages: [newFirstPage, ...oldData.pages.slice(1)],
        };
      });
    },
    updateLastMessage: (email: string, content: string) => {
      queryClient.setQueryData(['chatHistory', email], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) return oldData;

        const pages = [...oldData.pages];
        const firstPage = { ...pages[0] };
        const messages = [...firstPage.messages];

        if (messages.length > 0) {
          const lastMessageIndex = messages.length - 1;
          messages[lastMessageIndex] = {
            ...messages[lastMessageIndex],
            content: messages[lastMessageIndex].content + content,
          };
        }

        firstPage.messages = messages;
        pages[0] = firstPage;

        return {
          ...oldData,
          pages,
        };
      });
    },
  };
};
