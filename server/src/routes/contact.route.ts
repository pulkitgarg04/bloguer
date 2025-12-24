import { Router } from 'express';
import { ContactController } from '../controllers/contact.controller';
import authMiddleware from '../middlewares/authMiddleware';

export const contactRouter = Router();

contactRouter.post('/submit', ContactController.submit);
contactRouter.get('/messages', authMiddleware, ContactController.getAll);
contactRouter.get('/messages/:id', authMiddleware, ContactController.getById);
contactRouter.delete('/messages/:id', authMiddleware, ContactController.delete);

export default contactRouter;
