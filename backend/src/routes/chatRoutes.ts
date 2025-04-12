import express from 'express';
import { streamChatMessage, deleteChats, getChatHistory } from '../controllers/chatControllers';

const router = express.Router();

router.post('/', streamChatMessage);
router.delete('/', deleteChats);
router.get('/history/', getChatHistory);
router.get('/history/delete', getChatHistory);

export default router;
