import express from 'express';
import { ChatController } from '../controllers/chatControllers';
const slideRouter = express.Router();
const chatController = new ChatController;


slideRouter.post('/api/chat', (req, res) => chatController.handleChat(req, res));

export default  slideRouter;