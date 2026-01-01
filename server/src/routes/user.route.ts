import upload from '../utils/multer';
import { uploadAvatarController } from '../controllers/uploadAvatar.controller';

import { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import { UserController } from '../controllers/user.controller';

export const userRouter = Router();

userRouter.post('/signup', UserController.signup);
userRouter.post('/login', UserController.login);
userRouter.post('/upload-avatar', authMiddleware, upload.single('avatar'), uploadAvatarController);
userRouter.get('/verify-email', UserController.verifyEmail);
userRouter.post('/resend-verification', UserController.resendVerification);
userRouter.post('/forgot-password', UserController.forgotPassword);
userRouter.post('/reset-password', UserController.resetPassword);
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
userRouter.put('/update-profile', authMiddleware, UserController.updateProfile);
