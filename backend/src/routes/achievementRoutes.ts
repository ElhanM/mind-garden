import { Router } from 'express';
import { getAchievements } from '../controllers/achievementsController';

const router = Router();
router.get('/', getAchievements);

export default router;
