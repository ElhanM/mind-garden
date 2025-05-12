import express from 'express';
import {
  createDailyCheckIn,
  getDailyCheckIn,
  getCheckInsHistory,
  getLatestStreak,
  getMoodHistory,
} from '../controllers/dailyCheckInController';
import { authMiddleware } from '../middleware/authMiddleware'; // Authentication middleware
import { rateLimiter } from '../utils/rateLimiter'; // Rate limiter

const router = express.Router();

// Apply both authMiddleware and rateLimiter to all routes in this router
router.use(authMiddleware, rateLimiter);

// POST route for creating a daily check-in
router.post('/', createDailyCheckIn);

// GET route for fetching the most recent daily check-in
router.get('/', getDailyCheckIn);

// GET route for fetching the check-in history
router.get('/history', getCheckInsHistory);
router.get('/streak', getLatestStreak);
router.get('/mood', getMoodHistory);

export default router;
