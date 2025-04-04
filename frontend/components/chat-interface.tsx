'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send } from 'lucide-react';
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

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current;
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
    if (messages.length > 0) {
      console.log('Latest message content:', messages[messages.length - 1].content);
    }
  }, [messages]);

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

    const assistantMessageIndex = messages.length;
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

    try {
      setIsStreaming(false);

      await generateAIResponse(email, input, (token) => {
        // As soon as we get the first token, we're streaming
        if (!isStreaming) {
          setIsStreaming(true);
          setIsLoading(false); // Hide the loading indicator
        }
        // update assistant
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
      // znam da su try catchovi kurati al promjenice se
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
  return (
    <>
      <div className="prose">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {`# My Awesome Document

## Introduction

This is an introduction to my awesome document. Here are some things we will cover:

- Topic 1
- Topic 2
- Topic 3

## Details

### Topic 1

Here are some details about Topic 1.

1. First point
2. Second point
3. Third point

### Topic 2

**This is important** information about Topic 2.

- [ ] Task 1
- [x] Task 2 (completed)

## Conclusion

Thank you for reading!`}
        </ReactMarkdown>
      </div>
      <PageContainer className="h-[calc(100vh-8rem)] py-4">
        <>
          <div className="flex h-full flex-col rounded-lg border border-gray-300 bg-white shadow-md">
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
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
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
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
