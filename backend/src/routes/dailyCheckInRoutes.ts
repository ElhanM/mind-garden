import express from 'express';
import {
  createDailyCheckIn,
  getDailyCheckIn,
  getCheckInsHistory,
  getLatestStreak,
  getMoodHistory,
} from '../controllers/dailyCheckInController';

const router = express.Router();

// POST route for creating a daily check-in
router.post('/', createDailyCheckIn);

// GET route for fetching the most recent daily check-in
router.get('/', getDailyCheckIn);

// GET route for fetching the check-in history
router.get('/history', getCheckInsHistory);
router.get('/streak', getLatestStreak);
router.get('/mood', getMoodHistory);

export default router;
