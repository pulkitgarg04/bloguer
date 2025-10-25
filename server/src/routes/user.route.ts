import { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import { UserController } from '../controllers/user.controller';

export const userRouter = Router();

userRouter.post('/signup', UserController.signup);
userRouter.post('/login', UserController.login);
userRouter.get('/checkAuth', authMiddleware, UserController.checkAuth);
userRouter.get('/profile/:username', UserController.profile);
userRouter.get(
    '/followersFollowingCount/:username',
    UserController.followersFollowingCount
);
userRouter.post(
    '/followOrUnfollow',
    authMiddleware,
    UserController.followOrUnfollow
);
