import { Router } from 'express';
import { createDailyCheckIn } from '../controllers/dailyCheckInController';

const router = Router();

router.post('/', createDailyCheckIn);

export default router;
