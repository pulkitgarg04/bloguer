import { Request, Response } from 'express';
import {
    signupService,
    loginService,
    checkAuthService,
    profileService,
    followersFollowingCountService,
    followOrUnfollowService,
} from '../services/user.service';

export const UserController = {
    signup: async (req: Request, res: Response) => {
        try {
            const result = await signupService(req.body);
            if ((result as any).error)
                return res.status(403).json({ message: (result as any).error });
            if ((result as any).conflict)
                return res
                    .status(409)
                    .json({ message: (result as any).conflict });
            return res.status(201).json({
                jwt: (result as any).token,
                user: (result as any).user,
            });
        } catch (e) {
            return res.status(500).json({ message: 'Server Error' });
        }
    },

    login: async (req: Request, res: Response) => {
        try {
            const result = await loginService(req.body);
            if ((result as any).error)
                return res.status(403).json({ message: (result as any).error });
            return res.status(200).json({
                jwt: (result as any).token,
                user: (result as any).user,
            });
        } catch (e) {
            return res.status(500).json({ message: 'Server error' });
        }
    },

    checkAuth: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).userId as string | undefined;
            if (!userId)
                return res
                    .status(401)
                    .json({ message: 'Unauthorized. No user ID found.' });
            const user = await checkAuthService(userId);
            if (!user)
                return res.status(404).json({ message: 'User not found.' });
            return res.status(200).json(user);
        } catch (e) {
            return res.status(500).json({ message: 'Server error.' });
        }
    },

    profile: async (req: Request, res: Response) => {
        try {
            const { username } = req.params as any;
            const data = await profileService(username);
            if (!data)
                return res.status(404).json({ message: 'User not found.' });
            return res.status(200).json(data);
        } catch (e) {
            return res
                .status(500)
                .json({ message: 'Server error while fetching posts.' });
        }
    },

    followersFollowingCount: async (req: Request, res: Response) => {
        try {
            const { username } = req.params as any;
            const data = await followersFollowingCountService(username);
            if (!data)
                return res.status(404).json({ message: 'User not found.' });
            return res.status(200).json(data);
        } catch (e) {
            return res.status(500).json({
                message: 'Error fetching followers and following count.',
            });
        }
    },

    followOrUnfollow: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).userId as string | undefined;
            const { usernameToFollow, action } = req.body as any;
            if (!userId || !usernameToFollow || !action)
                return res
                    .status(400)
                    .json({ message: 'Missing required parameters' });
            const ok = await followOrUnfollowService(
                userId,
                usernameToFollow,
                action
            );
            if (!ok)
                return res
                    .status(404)
                    .json({ message: 'User to follow not found' });
            return res
                .status(200)
                .json({ message: `Successfully ${action}ed` });
        } catch (error) {
            return res.status(500).json({ message: 'Server error' });
        }
    },
};
