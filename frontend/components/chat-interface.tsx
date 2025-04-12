'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, ArrowDown } from 'lucide-react';
import { PageContainer } from './page-container';
import { generateAIResponse } from '@/app/api-client/ai-chat';
import type { ChatMessage } from '@/types/Chat';
import { useSession } from 'next-auth/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function ChatInterface() {
  const { data: session } = useSession();
  const email = session?.user.email ?? '';
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'system',
      content:
        "Welcome to MindGarden! I'm your mental wellness assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, autoScroll]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    if (!email) {
      console.error('User is not authenticated. Please log in.');
      return;
    }

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

    try {
      setIsStreaming(false);

      await generateAIResponse(email, input, (token) => {
        if (!isStreaming) {
          setIsStreaming(true);
          setIsLoading(true);
        }
        setMessages((prev) => {
          const updated = [...prev];
          const lastIndex = updated.length - 1;
          updated[lastIndex] = {
            ...updated[lastIndex],
            content: updated[lastIndex].content + token,
          };
          return updated;
        });
      });
    } catch (error) {
      console.error('Streaming failed:', error);
      setMessages((prev) => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        if (updated[lastIndex].role === 'assistant' && updated[lastIndex].content === '') {
          updated[lastIndex] = {
            ...updated[lastIndex],
            content: 'Sorry, there was an error processing your request.',
          };
        }
        return updated;
      });
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      setAutoScroll(true);
      setShowScrollButton(false);
    }
  }, []);

  const handleScroll = useCallback(() => {
    if (scrollAreaRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
      const isAtBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 10;

      setAutoScroll(isAtBottom);
      setShowScrollButton(!isAtBottom);
    }
  }, []);

  return (
    <>
      <PageContainer className="h-[calc(100vh-8rem)] py-4">
        <>
          <div className="flex h-full flex-col rounded-lg border border-gray-300 bg-white shadow-md">
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef} onScroll={handleScroll}>
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`prose max-w-[80%] rounded-lg px-4 py-2 ${
                        message.role === 'user'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            {showScrollButton && (
              <Button
                className="absolute bottom-20 right-6 rounded-full p-2 shadow-md"
                onClick={scrollToBottom}
                size="sm"
                variant="secondary"
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
            )}
            <div className="border-t border-gray-300 p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex gap-2"
              >
                <Input
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={isLoading || !input.trim() || !email}>
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send</span>
                </Button>
              </form>
            </div>
          </div>
        </>
      </PageContainer>
    </>
  );
}
