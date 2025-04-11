import express from 'express';
import {
  createDailyCheckIn,
  getDailyCheckIn,
  getCheckInsHistory,
} from '../controllers/dailyCheckInController';

const router = express.Router();

router.post('/', createDailyCheckIn);
router.get('/', getDailyCheckIn);
router.get('/history', getCheckInsHistory);

export default router;
