import express from 'express';
import {
  createDailyCheckIn,
  getDailyCheckIn,
  getCheckInsHistory,
  getLatestStreak,
  getMoodHistory,
} from '../controllers/dailyCheckInController';

const router = express.Router();

router.post('/', createDailyCheckIn);
router.get('/', getDailyCheckIn);
router.get('/history', getCheckInsHistory);
router.get('/streak', getLatestStreak);
router.get('/mood', getMoodHistory);

export default router;
