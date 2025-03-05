import express from 'express';
import { createDailyCheckIn, getDailyCheckIn } from '../controllers/dailyCheckInController';

const router = express.Router();

router.post('/', createDailyCheckIn);
router.get('/', getDailyCheckIn);

export default router;
