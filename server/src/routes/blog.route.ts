import { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import { BlogController } from '../controllers/blog.controller';

export const blogRouter = Router();

blogRouter.post('/post', authMiddleware, BlogController.create);
blogRouter.put('/post', authMiddleware, BlogController.update);
blogRouter.get('/bulk', BlogController.bulk);
blogRouter.get('/getPopularBlogs', BlogController.popular);
blogRouter.get('/getFollowingBlogs', BlogController.following);
blogRouter.get(
    '/analytics/overview',
    authMiddleware,
    BlogController.analyticsOverview
);
blogRouter.get(
    '/analytics/geo',
    authMiddleware,
    BlogController.analyticsGeo
);
blogRouter.get(
    '/analytics/post/:postId',
    authMiddleware,
    BlogController.analyticsPost
);
blogRouter.get('/:id', BlogController.getById);

export default blogRouter;
