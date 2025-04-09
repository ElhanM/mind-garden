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
    return; // exit early without calling next()
  }

  const token = authHeader.split(' ')[1];

  // Validate the token format (basic check for segments)
  const tokenSegments = token.split('.');
  if (tokenSegments.length !== 3) {
    throwError('Invalid token format', 401);
  }
  // Verify the token with Google
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_ID,
  });

  const payload = ticket.getPayload();

  // If no email in the payload, reject the request
  if (!payload?.email) {
    throwError('Invalid token, no email found', 401);
    return; // exit early without calling next()
  }

  // Attach the user email and name to the request object
  req.user = {
    email: payload.email,
    name: payload.name,
  };

  // Continue to the next middleware or route handler
  next();
};
