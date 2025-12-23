import { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import { BlogController } from '../controllers/blog.controller';
import upload from '../utils/multer';
import { uploadImageController } from '../controllers/uploadImage.controller';

export const blogRouter = Router();

blogRouter.post('/upload-image', authMiddleware, upload.single('image'), uploadImageController);
blogRouter.post('/post', authMiddleware, BlogController.create);
blogRouter.put('/post', authMiddleware, BlogController.update);
blogRouter.delete('/post/:postId', authMiddleware, BlogController.delete);
blogRouter.post('/bookmark', authMiddleware, BlogController.toggleBookmark);
blogRouter.get('/bookmarks/:userId', BlogController.getBookmarks);
blogRouter.post('/analytics/engagement', BlogController.engagement);
blogRouter.get('/bulk', BlogController.bulk);
blogRouter.get('/getPopularBlogs', BlogController.popular);
blogRouter.get('/getFollowingBlogs', BlogController.following);
blogRouter.get(
    '/analytics/overview',
    authMiddleware,
    BlogController.analyticsOverview
);
blogRouter.get('/analytics/geo', authMiddleware, BlogController.analyticsGeo);
blogRouter.get(
    '/analytics/post/:postId',
    authMiddleware,
    BlogController.analyticsPost
);
blogRouter.get('/:id', BlogController.getById);

export default blogRouter;
