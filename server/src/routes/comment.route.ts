import { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import { CommentController } from '../controllers/comment.controller';

export const commentRouter = Router();

commentRouter.post('/', authMiddleware, CommentController.create);
commentRouter.get('/post/:postId', CommentController.listByPost);
commentRouter.put('/:commentId', authMiddleware, CommentController.update);
commentRouter.delete('/:commentId', authMiddleware, CommentController.remove);

export default commentRouter;
