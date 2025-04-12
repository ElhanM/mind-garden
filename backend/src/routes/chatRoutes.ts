import express from 'express';
import { streamChatMessage, deleteChats } from '../controllers/chatControllers';

const router = express.Router();

router.post('/', streamChatMessage);
router.delete('/', deleteChats);

export default router;
