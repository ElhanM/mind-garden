import OpenAI from 'openai';
import { Response, Request } from 'express';
import { ChatCompletionMessageParam } from 'openai/resources';
import { AppDataSource } from '../data-source';
import { Chat } from '../entities/Chat';
import { User } from '../entities/User';
import type { Role } from '../types/Role';
import { sendSuccess, throwError } from '../utils/responseHandlers';
import { getUserByEmail } from '../utils/idHandler';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_SECRET_KEY,
});

export async function streamChatMessage(req: Request, res: Response) {
  const { email, input } = req.body;

  if (!email || !input) {
    throwError('Email and input are required', 400);
  }

  try {
    const user = await getUserByEmail(email);
    const userId = user?.id;
    if (!userId) throwError('User ID not found', 404);

    const chatRepository = AppDataSource.getRepository(Chat);

    const userMessage = new Chat();
    userMessage.user = { id: userId } as User;
    userMessage.role = 'user';
    userMessage.content = input;
    await chatRepository.save(userMessage);

    const messages = await chatRepository.find({
      where: { user: { id: userId } },
      order: { created_at: 'ASC' },
    });

    const limitedMessages = messages.slice(-5).map((msg) => ({
      role: msg.role as Role,
      content: msg.content as string,
    }));

    const conversation: ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content:
          'You are a psychologist AI specialized in mental health and well-being. Only respond within that scope. Use markdown formatting (e.g., **bold**, *italic*, # headings) where appropriate to enhance readability. If asked otherwise, redirect.',
      },
      ...limitedMessages,
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: conversation,
      stream: true,
    });

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    let fullAssistantResponse = '';

    console.log('Streaming started: ');
    for await (const chunk of completion) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        fullAssistantResponse += content;
        const lines = content.split('\n');
        for (const line of lines) {
          res.write(`data: ${line}\n`);
        }
        res.write('\n');
      }
    }
    const assistantMessage = new Chat();
    assistantMessage.user = { id: userId } as User;
    assistantMessage.role = 'assistant';
    assistantMessage.content = fullAssistantResponse;
    console.log('Assistant response:', fullAssistantResponse);

    await chatRepository.save(assistantMessage);

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('Streaming error:', error);
    res.write('data: [ERROR]\n\n');
    res.end();
  }
}

export async function deleteChats(req: Request, res: Response) {
  const { userId } = req.body;

  const chatRepository = AppDataSource.getRepository(Chat);
  await chatRepository.delete({ user: { id: userId } });
  sendSuccess(res, { message: 'All chats have been deleted.' }, 200);
}
