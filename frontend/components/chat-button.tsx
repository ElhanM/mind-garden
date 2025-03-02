'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send } from 'lucide-react';

export function ChatButton() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'system',
      content:
        "Welcome to MindGarden! I'm your mental wellness assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setIsLoading(true);

    // In a real app, this would call an AI API
    setTimeout(() => {
      // Simulate AI response
      let response;
      if (input.toLowerCase().includes('anxious') || input.toLowerCase().includes('anxiety')) {
        response = {
          role: 'assistant',
          content:
            'I understand feeling anxious can be challenging. Have you tried any breathing exercises? Taking 5 deep breaths can help calm your nervous system. Would you like me to guide you through a quick breathing exercise?',
        };
      } else if (input.toLowerCase().includes('sad') || input.toLowerCase().includes('down')) {
        response = {
          role: 'assistant',
          content:
            "I'm sorry to hear you're feeling down. Remember that it's okay to have these feelings. Would it help to talk about what's causing this feeling, or would you prefer some suggestions for mood-lifting activities?",
        };
      } else if (
        input.toLowerCase().includes('stress') ||
        input.toLowerCase().includes('stressed')
      ) {
        response = {
          role: 'assistant',
          content:
            "Stress can be overwhelming. One technique that might help is to identify what's in your control and what isn't. For the things you can control, consider making a simple action plan. Would you like to explore some stress management techniques?",
        };
      } else {
        response = {
          role: 'assistant',
          content:
            "Thank you for sharing. Remember that taking care of your mental health is a journey, and you're making progress by checking in with yourself. Is there anything specific you'd like guidance on today?",
        };
      }

      setMessages((prev) => [...prev, response]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="rounded-full bg-purple-600 p-3 hover:bg-purple-700">
          <MessageSquare className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>MindGarden Assistant</SheetTitle>
          <SheetDescription>Chat with your AI mental wellness companion</SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-1 pr-4">
          <div className="mt-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg bg-gray-100 px-4 py-2 text-gray-800">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                      style={{ animationDelay: '0.2s' }}
                    ></div>
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                      style={{ animationDelay: '0.4s' }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="mt-4 flex gap-2">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
