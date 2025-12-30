import { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import { BlogController } from '../controllers/blog.controller';
import upload from '../utils/multer';
import { uploadImageController } from '../controllers/uploadImage.controller';
import { cacheMiddleware } from '../middlewares/cacheMiddleware';

export const blogRouter = Router();

blogRouter.post('/upload-image', authMiddleware, upload.single('image'), uploadImageController);
blogRouter.post('/post', authMiddleware, BlogController.create);
blogRouter.put('/post', authMiddleware, BlogController.update);
blogRouter.delete('/post/:postId', authMiddleware, BlogController.delete);
blogRouter.post('/bookmark', authMiddleware, BlogController.toggleBookmark);
blogRouter.get('/bookmark/:postId', authMiddleware, BlogController.checkBookmark);
blogRouter.get('/bookmarks/:userId', cacheMiddleware.shortCache, BlogController.getBookmarks);
blogRouter.post('/analytics/engagement', BlogController.engagement);
blogRouter.get('/bulk', cacheMiddleware.conditionalCache, BlogController.bulk);
blogRouter.get('/getPopularBlogs', cacheMiddleware.mediumCache, BlogController.popular);
blogRouter.get('/getFollowingBlogs', cacheMiddleware.shortCache, BlogController.following);
blogRouter.get(
    '/analytics/overview',
    authMiddleware,
    cacheMiddleware.shortCache,
    BlogController.analyticsOverview
);
blogRouter.get('/analytics/geo', authMiddleware, cacheMiddleware.mediumCache, BlogController.analyticsGeo);
blogRouter.get(
    '/analytics/post/:postId',
    authMiddleware,
    cacheMiddleware.shortCache,
    BlogController.analyticsPost
);
blogRouter.get('/:id', cacheMiddleware.conditionalCache, BlogController.getById);

export default blogRouter;
