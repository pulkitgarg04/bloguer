import { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import { AIController } from '../controllers/ai.controller';

export const aiRouter = Router();

aiRouter.post(
    '/generate-article',
    authMiddleware,
    AIController.generateArticle
);
