import { Request, Response } from 'express';
import {
    createPostService,
    updatePostService,
    deletePostService,
    bulkService,
    popularService,
    followingService,
    getPostService,
    analyticsOverviewService,
    analyticsPostService,
    analyticsGeoService,
} from '../services/blog.service';

export const BlogController = {
    create: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).userId as string | undefined;
            if (!userId)
                return res
                    .status(401)
                    .json({ message: 'Unauthorized. No user ID found.' });
            const body = req.body as {
                title: string;
                content: string;
                category: string;
                featuredImage?: string;
            };
            const post = await createPostService(userId, body);
            return res.status(200).json({ id: post.id });
        } catch (err) {
            return res.status(500).json({ message: 'Failed to create post' });
        }
    },

    update: async (req: Request, res: Response) => {
        try {
            const { postId, title, content, category, published, featuredImage } =
                req.body as any;
            if (!postId)
                return res.status(400).json({ message: 'postId is required' });
            const post = await updatePostService(postId, {
                title,
                content,
                category,
                published,
                featuredImage,
            });
            return res.json({
                message: 'Blog updated successfully',
                id: post.id,
            });
        } catch (err) {
            return res
                .status(500)
                .json({ message: 'Failed to update blog post' });
        }
    },

    delete: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).userId as string | undefined;
            if (!userId)
                return res
                    .status(401)
                    .json({ message: 'Unauthorized. No user ID found.' });
            
            const { postId } = req.params;
            if (!postId)
                return res.status(400).json({ message: 'postId is required' });
            
            await deletePostService(postId, userId);
            return res.json({ message: 'Blog deleted successfully' });
        } catch (err: any) {
            if (err.message === 'Post not found') {
                return res.status(404).json({ message: 'Post not found' });
            }
            if (err.message === 'Unauthorized to delete this post') {
                return res.status(403).json({ message: 'Unauthorized to delete this post' });
            }
            return res
                .status(500)
                .json({ message: 'Failed to delete blog post' });
        }
    },

    bulk: async (req: Request, res: Response) => {
        try {
            const { page = '1', limit = '10', search = '' } = req.query as any;
            const payload = await bulkService(
                parseInt(page),
                parseInt(limit),
                String(search || '')
            );
            return res.json(payload);
        } catch (error: any) {
            return res
                .status(500)
                .json({
                    message: 'Something went wrong',
                    error: error.message,
                });
        }
    },

    popular: async (_req: Request, res: Response) => {
        try {
            const payload = await popularService();
            return res.json(payload);
        } catch (error) {
            return res.status(500).json({ error: 'Failed to fetch blogs.' });
        }
    },

    following: async (req: Request, res: Response) => {
        try {
            const userId = (req.query as any).userId as string | undefined;
            if (!userId)
                return res.status(400).json({ error: 'userId is required' });
            const payload = await followingService(userId);
            return res.json(payload);
        } catch (error) {
            return res
                .status(500)
                .json({ error: 'Failed to fetch following blogs.' });
        }
    },

    getById: async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const ipHeader = (req.headers['x-forwarded-for'] as string) || '';
            const ip = ipHeader
                ? ipHeader.split(',')[0]?.trim()
                : (req.socket.remoteAddress as string | undefined);
            const userAgent = req.headers['user-agent'] as string | undefined;
            const ref = ((req.headers['referer'] as string) ||
                (req.headers['referrer'] as string) ||
                '') as string;
            const userId = (req as any).userId as string | undefined;
            const visitorId =
                (req.headers['x-visitor-id'] as string) || undefined;
            const payload = await getPostService({
                id,
                ip,
                userAgent,
                ref,
                userId,
                visitorId,
            });
            if (!payload)
                return res.status(404).json({ message: 'Post not found' });
            return res.json(payload);
        } catch (error) {
            console.error('Error fetching blog post:', error);
            return res
                .status(500)
                .json({
                    message: 'An error occurred while fetching the blog post',
                });
        }
    },

    analyticsOverview: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).userId as string | undefined;
            if (!userId)
                return res.status(401).json({ message: 'Unauthorized' });
            const data = await analyticsOverviewService(userId);
            return res.json(data);
        } catch (error) {
            return res
                .status(500)
                .json({ message: 'Failed to load analytics' });
        }
    },

    analyticsPost: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).userId as string | undefined;
            if (!userId)
                return res.status(401).json({ message: 'Unauthorized' });
            const { postId } = req.params as any;
            const data = await analyticsPostService(userId, postId);
            if (data === 'forbidden')
                return res.status(403).json({ message: 'Forbidden' });
            if (!data)
                return res.status(404).json({ message: 'Post not found' });
            return res.json(data);
        } catch (error) {
            return res
                .status(500)
                .json({ message: 'Failed to load post analytics' });
        }
    },

    analyticsGeo: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).userId as string | undefined;
            if (!userId)
                return res.status(401).json({ message: 'Unauthorized' });
            const data = await analyticsGeoService(userId);
            return res.json(data);
        } catch (error) {
            return res
                .status(500)
                .json({ message: 'Failed to load geo analytics' });
        }
    },

    engagement: async (req: Request, res: Response) => {
        try {
            const { postId, visitorId, durationSec, scrollDepth } = req.body as any;
            if (!postId) return res.status(400).json({ message: 'postId is required' });

            const ipHeader = (req.headers['x-forwarded-for'] as string) || '';
            const ip = ipHeader ? ipHeader.split(',')[0]?.trim() : (req.socket.remoteAddress as string | undefined);
            const userAgent = req.headers['user-agent'] as string | undefined;
            const ref = ((req.headers['referer'] as string) || (req.headers['referrer'] as string) || '') as string;
            const userId = (req as any).userId as string | undefined;

            const result = await (await import('../services/blog.service')).createEngagementService({
                postId,
                visitorId,
                durationSec,
                scrollDepth,
                userId,
                ip,
                userAgent,
                referrer: ref,
            });

            if ((result as any).error) return res.status(500).json({ message: (result as any).error });
            return res.json({ ok: true });
        } catch (err: any) {
            console.error('Engagement handler error', err);
            return res.status(500).json({ message: 'Failed to record engagement' });
        }
    },

    toggleBookmark: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).userId as string | undefined;
            if (!userId)
                return res.status(401).json({ message: 'Unauthorized' });
            const { postId } = req.body as any;
            if (!postId) return res.status(400).json({ message: 'postId is required' });
            const result = await (await import('../services/blog.service')).toggleBookmarkService(userId, postId);
            return res.json(result);
        } catch (err: any) {
            return res.status(500).json({ message: 'Failed to toggle bookmark' });
        }
    },

    getBookmarks: async (req: Request, res: Response) => {
        try {
            const { userId } = req.params as any;
            if (!userId) return res.status(400).json({ message: 'userId is required' });
            const data = await (await import('../services/blog.service')).getBookmarksService(userId);
            return res.json(data);
        } catch (err: any) {
            return res.status(500).json({ message: 'Failed to fetch bookmarks' });
        }
    },
};
