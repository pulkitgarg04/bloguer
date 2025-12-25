import { Request, Response } from 'express';
import {
    dashboardStatsService,
    listUsersService,
    getUserService,
    deleteUserService,
    toggleAdminService,
    listPostsService,
    getPostService,
    deletePostService,
    togglePostPublishedService,
    listCommentsService,
    deleteCommentService,
    listSubscribersService,
    deleteSubscriberService,
    listContactMessagesService,
    deleteContactMessageService,
} from '../services/admin.service';

export const AdminController = {
    dashboard: async (_req: Request, res: Response) => {
        try {
            const stats = await dashboardStatsService();
            return res.json(stats);
        } catch (error) {
            console.error('Admin dashboard error:', error);
            return res.status(500).json({ message: 'Failed to load dashboard' });
        }
    },

    listUsers: async (_req: Request, res: Response) => {
        try {
            const users = await listUsersService();
            return res.json({ users });
        } catch (error) {
            console.error('Admin list users error:', error);
            return res.status(500).json({ message: 'Failed to list users' });
        }
    },

    getUser: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const user = await getUserService(id);
            if (!user) return res.status(404).json({ message: 'User not found' });
            return res.json({ user });
        } catch (error) {
            console.error('Admin get user error:', error);
            return res.status(500).json({ message: 'Failed to get user' });
        }
    },

    deleteUser: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const adminId = (req as any).userId as string;
            if (id === adminId) {
                return res.status(400).json({ message: 'Cannot delete yourself' });
            }
            await deleteUserService(id);
            return res.json({ message: 'User deleted successfully' });
        } catch (error) {
            console.error('Admin delete user error:', error);
            return res.status(500).json({ message: 'Failed to delete user' });
        }
    },

    toggleAdmin: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { isAdmin } = req.body;
            const adminId = (req as any).userId as string;
            if (id === adminId) {
                return res.status(400).json({ message: 'Cannot modify your own admin status' });
            }
            const result = await toggleAdminService(id, Boolean(isAdmin));
            return res.json(result);
        } catch (error) {
            console.error('Admin toggle admin error:', error);
            return res.status(500).json({ message: 'Failed to update admin status' });
        }
    },

    listPosts: async (_req: Request, res: Response) => {
        try {
            const posts = await listPostsService();
            return res.json({ posts });
        } catch (error) {
            console.error('Admin list posts error:', error);
            return res.status(500).json({ message: 'Failed to list posts' });
        }
    },

    getPost: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const post = await getPostService(id);
            if (!post) return res.status(404).json({ message: 'Post not found' });
            return res.json({ post });
        } catch (error) {
            console.error('Admin get post error:', error);
            return res.status(500).json({ message: 'Failed to get post' });
        }
    },

    deletePost: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            await deletePostService(id);
            return res.json({ message: 'Post deleted successfully' });
        } catch (error) {
            console.error('Admin delete post error:', error);
            return res.status(500).json({ message: 'Failed to delete post' });
        }
    },

    togglePublished: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { published } = req.body;
            const result = await togglePostPublishedService(id, Boolean(published));
            return res.json(result);
        } catch (error) {
            console.error('Admin toggle published error:', error);
            return res.status(500).json({ message: 'Failed to update post' });
        }
    },

    listComments: async (_req: Request, res: Response) => {
        try {
            const comments = await listCommentsService();
            return res.json({ comments });
        } catch (error) {
            console.error('Admin list comments error:', error);
            return res.status(500).json({ message: 'Failed to list comments' });
        }
    },

    deleteComment: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            await deleteCommentService(id);
            return res.json({ message: 'Comment deleted successfully' });
        } catch (error) {
            console.error('Admin delete comment error:', error);
            return res.status(500).json({ message: 'Failed to delete comment' });
        }
    },

    listSubscribers: async (_req: Request, res: Response) => {
        try {
            const subscribers = await listSubscribersService();
            return res.json({ subscribers });
        } catch (error) {
            console.error('Admin list subscribers error:', error);
            return res.status(500).json({ message: 'Failed to list subscribers' });
        }
    },

    deleteSubscriber: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            await deleteSubscriberService(id);
            return res.json({ message: 'Subscriber deleted successfully' });
        } catch (error) {
            console.error('Admin delete subscriber error:', error);
            return res.status(500).json({ message: 'Failed to delete subscriber' });
        }
    },

    listContactMessages: async (_req: Request, res: Response) => {
        try {
            const messages = await listContactMessagesService();
            return res.json({ messages });
        } catch (error) {
            console.error('Admin list messages error:', error);
            return res.status(500).json({ message: 'Failed to list messages' });
        }
    },

    deleteContactMessage: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            await deleteContactMessageService(id);
            return res.json({ message: 'Message deleted successfully' });
        } catch (error) {
            console.error('Admin delete message error:', error);
            return res.status(500).json({ message: 'Failed to delete message' });
        }
    },
};
