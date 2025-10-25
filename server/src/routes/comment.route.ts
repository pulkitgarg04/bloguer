import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import authMiddleware from '../middlewares/authMiddleware';

export const commentRouter = Router();

commentRouter.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { postId, content } = req.body;
    if (!postId || !content) return res.status(400).json({ message: 'postId and content are required' });

    const prisma = new PrismaClient({ datasourceUrl: process.env.DATABASE_URL }).$extends(withAccelerate());

    const comment = await (prisma as any).comment.create({
      data: {
        content,
        authorId: userId,
        postId,
      },
      include: { author: { select: { id: true, name: true, username: true, avatar: true } } },
    });

    return res.status(201).json({ comment });
  } catch (error) {
    console.error('Error creating comment:', error);
    return res.status(500).json({ message: 'Failed to create comment' });
  }
});

commentRouter.get('/post/:postId', async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const prisma = new PrismaClient({ datasourceUrl: process.env.DATABASE_URL }).$extends(withAccelerate());

    const comments = await (prisma as any).comment.findMany({
      where: { postId },
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { id: true, name: true, username: true, avatar: true } } },
    });

    return res.json({ comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return res.status(500).json({ message: 'Failed to fetch comments' });
  }
});

export default commentRouter;

// Update a comment (only author can update)
commentRouter.put('/:commentId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { commentId } = req.params;
    const { content } = req.body as { content?: string };
    if (!content || !content.trim()) return res.status(400).json({ message: 'Content is required' });

    const prisma = new PrismaClient({ datasourceUrl: process.env.DATABASE_URL }).$extends(withAccelerate());

    const existing = await (prisma as any).comment.findUnique({ where: { id: commentId }, select: { id: true, authorId: true } });
    if (!existing) return res.status(404).json({ message: 'Comment not found' });
    if (existing.authorId !== userId) return res.status(403).json({ message: 'Forbidden' });

    const updated = await (prisma as any).comment.update({
      where: { id: commentId },
      data: { content },
      include: { author: { select: { id: true, name: true, username: true, avatar: true } } },
    });

    return res.json({ comment: updated });
  } catch (error) {
    console.error('Error updating comment:', error);
    return res.status(500).json({ message: 'Failed to update comment' });
  }
});

// Delete a comment (author of the comment OR the author of the post can delete)
commentRouter.delete('/:commentId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { commentId } = req.params;
    const prisma = new PrismaClient({ datasourceUrl: process.env.DATABASE_URL }).$extends(withAccelerate());

    const existing = await (prisma as any).comment.findUnique({
      where: { id: commentId },
      select: { id: true, authorId: true, post: { select: { authorId: true } } },
    });
    if (!existing) return res.status(404).json({ message: 'Comment not found' });
    const isCommentAuthor = existing.authorId === userId;
    const isPostAuthor = existing.post?.authorId === userId;
    if (!isCommentAuthor && !isPostAuthor) return res.status(403).json({ message: 'Forbidden' });

    await (prisma as any).comment.delete({ where: { id: commentId } });
    return res.json({ success: true, message: 'Comment deleted' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return res.status(500).json({ message: 'Failed to delete comment' });
  }
});
