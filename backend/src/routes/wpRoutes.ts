import express from 'express';
import { createWPCheckIn, getWPStatus } from '../controllers/wpController';

const router = express.Router();

router.post('/wp-check-in', createWPCheckIn);
router.get('/wp-status', getWPStatus);

export default router;
