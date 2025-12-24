import { Router } from 'express';
import { NewsletterController } from '../controllers/newsletter.controller';
import authMiddleware from '../middlewares/authMiddleware';

export const newsletterRouter = Router();

newsletterRouter.post('/subscribe', NewsletterController.subscribe);
newsletterRouter.get('/subscribers', authMiddleware, NewsletterController.getAll);
newsletterRouter.post('/unsubscribe', NewsletterController.unsubscribe);

export default newsletterRouter;
