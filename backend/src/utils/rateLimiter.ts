import rateLimit from 'express-rate-limit';

// Apply rate limiting: max 100 requests per 1 minute per IP
export const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // Max 100 requests per IP per window
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Use standard RateLimit headers
  legacyHeaders: false, // Disable deprecated headers
});
