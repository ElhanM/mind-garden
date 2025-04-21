import express from 'express';
import { streamChatMessage, deleteChats, getChatHistory } from '../controllers/chatControllers';

const router = express.Router();

router.post('/', streamChatMessage);
router.get('/history/', getChatHistory);
router.delete('/history/delete', deleteChats);

export default router;
