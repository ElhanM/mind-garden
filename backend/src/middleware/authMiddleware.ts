import { Request, Response, NextFunction } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { throwError } from '../utils/responseHandlers';

const client = new OAuth2Client();

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (process.env.NODE_ENV !== 'production') {
    // Auth middleware skipped in non-production environment
    return next();
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throwError('Missing or invalid token', 401);
  }

  const token = authHeader?.split(' ')[1];
  if (!token) {
    throwError('Missing or invalid token', 401);
  }

  const tokenSegments = token?.split('.') || [];
  if (tokenSegments.length !== 3) {
    throwError('Invalid token format', 401);
  }

  let ticket;
  try {
    ticket = await client.verifyIdToken({
      idToken: token as string,
      audience: process.env.GOOGLE_ID,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throwError(`Error verifying token: ${errorMessage}`, 401);
    return;
  }

  const payload = ticket.getPayload();

  if (!payload?.email) {
    throwError('Invalid token, no email found', 401);
  }

  req.user = {
    email: payload?.email || '',
    name: payload?.name || '',
  };

  next();
};
