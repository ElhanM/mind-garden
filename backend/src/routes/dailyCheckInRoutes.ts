import express from 'express';
import { createDailyCheckIn, getDailyCheckIn } from '../controllers/dailyCheckInController';

const router = express.Router(); // Create the router instance

router.post('/', createDailyCheckIn);
console.log('getDailyCheckin function:', getDailyCheckIn);
router.get('/', getDailyCheckIn);
// router.get('/', getDailyCheckIn);
// router.get('/', getDailyCheckIn);

export default router;
