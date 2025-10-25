import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import {
  createBlogInput,
  updateBlogInput,
} from '@pulkitgarg04/bloguer-validations';
import authMiddleware from '../middlewares/authMiddleware';

export const blogRouter = Router();

blogRouter.post('/post', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized. No user ID found.' });
    }

    const body = req.body;

    const prisma = new PrismaClient({ datasourceUrl: process.env.DATABASE_URL }).$extends(
      withAccelerate()
    );

    function calculateReadingTime(content: string) {
      const wordsPerMinute = 200;
      const words = content.split(/\s+/).length;
      const minutes = Math.ceil(words / wordsPerMinute);
      return `${minutes} Min Read`;
    }

    const post = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: userId,
        featuredImage: `/thumbnails/${body.category}.webp`,
        category: body.category,
        readTime: calculateReadingTime(body.content),
        Date: new Date(),
      },
    });

    return res.status(200).json({ id: post.id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to create post' });
  }
});

blogRouter.put('/post', authMiddleware, async (req: Request, res: Response) => {
  const body = req.body;

  // Validate input
  // const { success } = updateBlogInput.safeParse(body);
  // if (!success) {
  //   return res.status(411).json({ message: "Inputs are Incorrect" });
  // }

  const prisma = new PrismaClient({ datasourceUrl: process.env.DATABASE_URL }).$extends(withAccelerate());

  try {
    const post = await prisma.post.update({
      where: { id: body.postId },
      data: { title: body.title, content: body.content, category: body.category },
    });

    return res.json({ message: 'Blog updated successfully', id: post.id });
  } catch (err) {
    console.error('Error updating blog:', err);
    return res.status(500).json({ message: 'Failed to update blog post' });
  }
});

blogRouter.get('/bulk', async (req: Request, res: Response) => {
  const prisma = new PrismaClient({ datasourceUrl: process.env.DATABASE_URL }).$extends(withAccelerate());

  const { page = '1', limit = '10', search = '' } = req.query as any;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  try {
    const totalCount = await prisma.post.count({
      where: {
        published: true,
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } },
        ],
      },
    });

    const posts = await prisma.post.findMany({
      where: {
        published: true,
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        title: true,
        content: true,
        author: { select: { name: true, username: true, avatar: true } },
        readTime: true,
        featuredImage: true,
        category: true,
        Date: true,
      },
      skip,
      take: parseInt(limit),
      orderBy: { Date: 'desc' },
    });

    const totalPages = Math.ceil(totalCount / parseInt(limit));

    return res.json({ blogs: posts, totalPages, currentPage: parseInt(page) });
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong', error: (error as any).message });
  }
});

blogRouter.get('/getPopularBlogs', async (req: Request, res: Response) => {
  const prisma = new PrismaClient({ datasourceUrl: process.env.DATABASE_URL }).$extends(withAccelerate());

  try {
    const popularPosts = await prisma.post.findMany({ where: { published: true }, orderBy: { views: 'desc' }, take: 6, include: { author: true } });
    return res.json({ popularPosts });
  } catch (error) {
    console.error('Error in fetching blogs: ', error);
    return res.status(500).json({ error: 'Failed to fetch blogs.' });
  }
});

blogRouter.get('/getFollowingBlogs', async (req: Request, res: Response) => {
  const userId = (req.query as any).userId;
  if (!userId) return res.status(400).json({ error: 'userId is required' });

  const prisma = new PrismaClient({ datasourceUrl: process.env.DATABASE_URL }).$extends(withAccelerate());

  try {
    const followingBlogs = await prisma.user.findUnique({
      where: { id: userId },
      include: { following: { include: { posts: { where: { published: true }, select: { id: true, title: true, content: true, author: { select: { name: true, username: true, avatar: true } }, readTime: true, featuredImage: true, category: true, Date: true }, orderBy: { Date: 'desc' } } } } },
    });
    return res.json({ followingBlogs: followingBlogs?.following || [] });
  } catch (error) {
    console.error('Error fetching following blogs:', error);
    return res.status(500).json({ error: 'Failed to fetch following blogs.' });
  }
});

blogRouter.get('/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  const prisma = new PrismaClient({ datasourceUrl: process.env.DATABASE_URL }).$extends(withAccelerate());

  try {
    const post = await prisma.post.update({ where: { id }, data: { views: { increment: 1 } }, select: { id: true, title: true, content: true, author: { select: { name: true, username: true, avatar: true } }, readTime: true, featuredImage: true, category: true, Date: true, views: true } });

    const similarPosts = await prisma.post.findMany({ where: { category: post?.category, id: { not: post?.id }, published: true }, select: { id: true, title: true, content: true, author: { select: { name: true, username: true, avatar: true } }, readTime: true, featuredImage: true, category: true, Date: true }, orderBy: { Date: 'desc' }, take: 3 });

    return res.json({ post, similarPosts });
  } catch (error) {
    return res.status(411).json({ message: 'An error occurred while fetching the blog post' });
  }
});

blogRouter.post('/bookmark', async (req: Request, res: Response) => {
  const { userId, postId } = req.body;

  const prisma = new PrismaClient({ datasourceUrl: process.env.DATABASE_URL }).$extends(withAccelerate());

  try {
    const existingBookmark = await prisma.bookmark.findFirst({ where: { userId, postId } });

    if (existingBookmark) {
      await prisma.bookmark.delete({ where: { id: existingBookmark.id } });
      return res.status(200).json({ message: 'Bookmark removed' });
    } else {
      await prisma.bookmark.create({ data: { userId, postId } });
      return res.status(201).json({ message: 'Bookmark added' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to toggle bookmark' });
  }
});

blogRouter.get('/bookmarks/:userId', async (req: Request, res: Response) => {
  const userId = req.params.userId;

  const prisma = new PrismaClient({ datasourceUrl: process.env.DATABASE_URL }).$extends(withAccelerate());

  try {
    const bookmarks = await prisma.bookmark.findMany({ where: { userId }, select: { post: { select: { id: true, title: true, featuredImage: true, category: true, readTime: true, authorId: true, author: { select: { name: true, avatar: true, username: true } }, Date: true } } } });

    if (!bookmarks.length) return res.status(200).json({ message: 'No bookmarked blogs found.' });

    const posts = bookmarks.map((bookmark) => bookmark.post);
    return res.status(200).json({ posts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch bookmarked blogs.' });
  }
});

export default blogRouter;