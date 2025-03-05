import { Router } from 'express';
import { getUserByEmail } from '../controllers/userControllers';

const router = Router();

router.get('/me', getUserByEmail); // to get id from session mail

export default router;
