import { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import adminMiddleware from '../middlewares/adminMiddleware';
import { AdminController } from '../controllers/admin.controller';

export const adminRouter = Router();

adminRouter.use(authMiddleware);
adminRouter.use(adminMiddleware);

adminRouter.get('/dashboard', AdminController.dashboard);
adminRouter.get('/users', AdminController.listUsers);
adminRouter.get('/users/:id', AdminController.getUser);
adminRouter.delete('/users/:id', AdminController.deleteUser);
adminRouter.put('/users/:id/admin', AdminController.toggleAdmin);
adminRouter.get('/posts', AdminController.listPosts);
adminRouter.get('/posts/:id', AdminController.getPost);
adminRouter.delete('/posts/:id', AdminController.deletePost);
adminRouter.put('/posts/:id/published', AdminController.togglePublished);
adminRouter.get('/comments', AdminController.listComments);
adminRouter.delete('/comments/:id', AdminController.deleteComment);
adminRouter.get('/subscribers', AdminController.listSubscribers);
adminRouter.delete('/subscribers/:id', AdminController.deleteSubscriber);
adminRouter.get('/messages', AdminController.listContactMessages);
adminRouter.delete('/messages/:id', AdminController.deleteContactMessage);

export default adminRouter;
