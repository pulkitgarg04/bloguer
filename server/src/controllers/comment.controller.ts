import { Request, Response } from 'express';
import {
    createCommentService,
    deleteCommentService,
    listCommentsService,
    updateCommentService,
} from '../services/comment.service';

export const CommentController = {
    create: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).userId as string | undefined;
            if (!userId)
                return res.status(401).json({ message: 'Unauthorized' });
            const { postId, content } = req.body as any;
            if (!postId || !content)
                return res
                    .status(400)
                    .json({ message: 'postId and content are required' });
            const comment = await createCommentService(userId, postId, content);
            return res.status(201).json({ comment });
        } catch (error) {
            return res
                .status(500)
                .json({ message: 'Failed to create comment' });
        }
    },

    listByPost: async (req: Request, res: Response) => {
        try {
            const { postId } = req.params as any;
            const comments = await listCommentsService(postId);
            return res.json({ comments });
        } catch (error) {
            return res
                .status(500)
                .json({ message: 'Failed to fetch comments' });
        }
    },

    update: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).userId as string | undefined;
            if (!userId)
                return res.status(401).json({ message: 'Unauthorized' });
            const { commentId } = req.params as any;
            const { content } = req.body as any;
            if (!content || !content.trim())
                return res.status(400).json({ message: 'Content is required' });
            const result = await updateCommentService(
                userId,
                commentId,
                content
            );
            if ((result as any).notFound)
                return res.status(404).json({ message: 'Comment not found' });
            if ((result as any).forbidden)
                return res.status(403).json({ message: 'Forbidden' });
            return res.json({ comment: (result as any).comment });
        } catch (error) {
            return res
                .status(500)
                .json({ message: 'Failed to update comment' });
        }
    },

    remove: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).userId as string | undefined;
            if (!userId)
                return res.status(401).json({ message: 'Unauthorized' });
            const { commentId } = req.params as any;
            const result = await deleteCommentService(userId, commentId);
            if ((result as any).notFound)
                return res.status(404).json({ message: 'Comment not found' });
            if ((result as any).forbidden)
                return res.status(403).json({ message: 'Forbidden' });
            return res.json({ success: true, message: 'Comment deleted' });
        } catch (error) {
            return res
                .status(500)
                .json({ message: 'Failed to delete comment' });
        }
    },
};
