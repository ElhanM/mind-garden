import express from 'express';
import { getWPStatus } from '../controllers/wpController';

const router = express.Router();

router.get('/wp-status', getWPStatus);

export default router;
