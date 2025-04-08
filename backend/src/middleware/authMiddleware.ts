import { Request, Response, NextFunction } from 'express';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client();

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('Auth middleware skipped in non-production environment');
    return next();
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Missing or invalid token' });
    return; // exit early without calling next()
  }

  const token = authHeader.split(' ')[1];

  // Validate the token format (basic check for segments)
  const tokenSegments = token.split('.');
  if (tokenSegments.length !== 3) {
    res.status(401).json({ message: 'Invalid token format' });
  }

  try {
    // Verify the token with Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_ID,
    });

    const payload = ticket.getPayload();

    // If no email in the payload, reject the request
    if (!payload?.email) {
      res.status(401).json({ message: 'Invalid token, no email found' });
      return; // exit early without calling next()
    }

    // Attach the user email and name to the request object
    req.user = {
      email: payload.email,
      name: payload.name,
    };

    // Continue to the next middleware or route handler
    next();
  } catch (err) {
    console.error('Auth error:', err);
    res.status(401).json({ message: 'Authentication failed' });
  }
};
