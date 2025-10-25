import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import {
  createBlogInput,
  updateBlogInput,
} from '@pulkitgarg04/bloguer-validations';
import authMiddleware from '../middlewares/authMiddleware';

export const blogRouter = Router();

const geoCache = new Map<string, { country: string; ts: number }>();
const GEO_TTL_MS = 24 * 60 * 60 * 1000;
async function lookupCountry(ip?: string): Promise<string | undefined> {
  if (!ip) return undefined;
  const key = ip;
  const now = Date.now();
  const hit = geoCache.get(key);
  if (hit && now - hit.ts < GEO_TTL_MS) return hit.country;
  try {
    const resp = await fetch(`https://ipapi.co/${encodeURIComponent(ip)}/json/`, { method: 'GET' });
    if (!resp.ok) return undefined;
    const data = (await resp.json()) as any;
    const country = data?.country_name || data?.country || data?.country_code;
    if (country) geoCache.set(key, { country, ts: now });
    return country;
  } catch {
    return undefined;
  }
}

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
    const post = await prisma.post.findUnique({ where: { id }, select: { id: true, title: true, content: true, author: { select: { name: true, username: true, avatar: true } }, readTime: true, featuredImage: true, category: true, Date: true, views: true, published: true } });
    if (!post || !post.published) return res.status(404).json({ message: 'Post not found' });

    await prisma.post.update({ where: { id }, data: { views: { increment: 1 } } });

    try {
      const ipHeader = (req.headers['x-forwarded-for'] as string) || '';
      const ip = ipHeader ? ipHeader.split(',')[0]?.trim() : (req.socket.remoteAddress || undefined);
      const userAgent = req.headers['user-agent'] as string | undefined;
      const ref = (req.headers['referer'] as string) || (req.headers['referrer'] as string) || '';
      const userId = (req as any).userId as string | undefined;
      const visitorId = (req.headers['x-visitor-id'] as string) || undefined;
      const source = ref ? (/twitter|t.co|x\.com/i.test(ref) ? 'social' : /facebook\.com/i.test(ref) ? 'social' : /linkedin\.com/i.test(ref) ? 'social' : /google\.|bing\.|duckduckgo\.|yahoo\./i.test(ref) ? 'search' : 'referral') : 'direct';
      const country = await lookupCountry(typeof ip === 'string' ? ip : undefined);
      const pvPrisma = new PrismaClient({ datasourceUrl: process.env.DATABASE_URL }).$extends(withAccelerate());
      let isReturning = false;
      if (visitorId) {
        const prev = await (pvPrisma as any).postView.findFirst({ where: { visitorId }, select: { id: true } });
        isReturning = !!prev;
      }
      try {
        await (pvPrisma as any).postView.create({ data: { postId: id, userId, ip: typeof ip === 'string' ? ip : undefined, userAgent, referrer: ref || undefined, visitorId, source, country, isReturning } });
      } catch {
        await (pvPrisma as any).postView.create({ data: { postId: id, userId, ip: typeof ip === 'string' ? ip : undefined, userAgent, referrer: ref || undefined } });
      }
    } catch {
    }

    const similarPosts = await prisma.post.findMany({ where: { category: post?.category, id: { not: post?.id }, published: true }, select: { id: true, title: true, content: true, author: { select: { name: true, username: true, avatar: true } }, readTime: true, featuredImage: true, category: true, Date: true }, orderBy: { Date: 'desc' }, take: 3 });

    const { published: _pub, ...safePost } = post as any;
    return res.json({ post: safePost, similarPosts });
  } catch (error) {
    return res.status(411).json({ message: 'An error occurred while fetching the blog post' });
  }
});

blogRouter.get('/analytics/overview', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const prisma = new PrismaClient({ datasourceUrl: process.env.DATABASE_URL }).$extends(withAccelerate());

    const posts = await prisma.post.findMany({ where: { authorId: userId }, select: { id: true, title: true, views: true, published: true, Date: true } });
    const postIds = posts.map(p => p.id);

    const [commentGroups, bookmarkGroups, last30Views, uniqueViews] = await Promise.all([
      prisma.comment.groupBy({ by: ['postId'], _count: { _all: true }, where: { postId: { in: postIds } } }),
      prisma.bookmark.groupBy({ by: ['postId'], _count: { _all: true }, where: { postId: { in: postIds } } }),
      (prisma as any).postView.findMany({ where: { postId: { in: postIds }, createdAt: { gte: new Date(Date.now() - 30*24*60*60*1000) } }, select: { postId: true, createdAt: true, visitorId: true, ip: true, userAgent: true } }),
      (prisma as any).postView.findMany({ where: { postId: { in: postIds } }, select: { postId: true, visitorId: true, ip: true, userAgent: true } })
    ]);

    const commentsByPost = new Map<string, number>();
    commentGroups.forEach((g: any) => commentsByPost.set(g.postId, g._count._all));
    const bookmarksByPost = new Map<string, number>();
    bookmarkGroups.forEach((g: any) => bookmarksByPost.set(g.postId, g._count._all));

    const last30ByPost = new Map<string, number>();
    (last30Views as any[]).forEach((v) => last30ByPost.set(v.postId, (last30ByPost.get(v.postId) || 0) + 1));

    const uniqueByPost = new Map<string, number>();
    (uniqueViews as any[]).forEach(v => {
      const key = v.postId;
      const uniqKey = v.visitorId || `${v.ip || ''}|${v.userAgent || ''}`;
      const setKey = `${key}::${uniqKey}`;
      uniqueByPost.set(setKey, 1);
    });
    const uniqCounts = new Map<string, number>();
    for (const setKey of uniqueByPost.keys()) {
      const [pid] = setKey.split('::');
      uniqCounts.set(pid, (uniqCounts.get(pid) || 0) + 1);
    }

    const items = posts.map(p => ({
      postId: p.id,
      title: p.title,
      totalViews: p.views,
      last30dViews: last30ByPost.get(p.id) || 0,
      comments: commentsByPost.get(p.id) || 0,
      bookmarks: bookmarksByPost.get(p.id) || 0,
      uniqueViews: uniqCounts.get(p.id) || 0,
      engagementRate: p.views > 0 ? Math.round(((commentsByPost.get(p.id) || 0) + (bookmarksByPost.get(p.id) || 0)) / p.views * 1000) / 10 : 0,
      published: p.published,
      date: p.Date,
    }));

    return res.json({ items });
  } catch (error) {
    console.error('Analytics overview error:', error);
    return res.status(500).json({ message: 'Failed to load analytics' });
  }
});

blogRouter.get('/analytics/post/:postId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const { postId } = req.params;
    const prisma = new PrismaClient({ datasourceUrl: process.env.DATABASE_URL }).$extends(withAccelerate());

    const post = await prisma.post.findUnique({ where: { id: postId }, select: { id: true, authorId: true, title: true, views: true, published: true, Date: true } });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.authorId !== userId) return res.status(403).json({ message: 'Forbidden' });

    const since = new Date(Date.now() - 30*24*60*60*1000);
  const events = await (prisma as any).postView.findMany({ where: { postId, createdAt: { gte: since } }, select: { createdAt: true, userAgent: true, visitorId: true, durationSec: true, source: true, country: true } });
    const comments = await prisma.comment.count({ where: { postId } });
    const bookmarks = await prisma.bookmark.count({ where: { postId } });

    const days: { date: string; views: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(Date.now() - i*24*60*60*1000);
      const key = d.toISOString().slice(0,10);
      days.push({ date: key, views: 0 });
    }
    const map = new Map(days.map(d => [d.date, 0] as [string, number] ));
    (events as any[]).forEach(ev => {
      const key = (ev.createdAt as Date).toISOString().slice(0,10);
      map.set(key, (map.get(key) || 0) + 1);
    });
    const timeseries = days.map(d => ({ date: d.date, views: map.get(d.date) || 0 }));

    let mobile = 0, desktop = 0, other = 0;
    (events as any[]).forEach(ev => {
      const ua = (ev.userAgent || '').toLowerCase();
      if (/mobile|android|iphone|ipad/.test(ua)) mobile++; else if (/windows|macintosh|linux/.test(ua)) desktop++; else other++;
    });

    const uniqueVisitors = new Set<string>();
    (events as any[]).forEach(ev => {
      const id = ev.visitorId || 'na';
      uniqueVisitors.add(id);
    });

    const durations: number[] = [];
    const sourceCounts = new Map<string, number>();
    const countryCounts = new Map<string, number>();
    (events as any[]).forEach(ev => {
      if (typeof ev.durationSec === 'number') durations.push(ev.durationSec);
      if (ev.source) sourceCounts.set(ev.source, (sourceCounts.get(ev.source) || 0) + 1);
      if (ev.country) countryCounts.set(ev.country, (countryCounts.get(ev.country) || 0) + 1);
    });
    const avgReadTimeSec = durations.length ? Math.round(durations.reduce((a,b)=>a+b,0)/durations.length) : 0;

    return res.json({
      post: { id: post.id, title: post.title, totalViews: post.views, published: post.published, date: post.Date },
      timeseries,
      comments,
      bookmarks,
      devices: { mobile, desktop, other },
      uniqueVisitors: uniqueVisitors.size,
      avgReadTimeSec,
      sources: Array.from(sourceCounts.entries()).map(([source, count]) => ({ source, count })),
      countries: Array.from(countryCounts.entries()).map(([country, count]) => ({ country, count })),
    });
  } catch (error) {
    console.error('Analytics post detail error:', error);
    return res.status(500).json({ message: 'Failed to load post analytics' });
  }
});

blogRouter.post('/analytics/engagement', async (req: Request, res: Response) => {
  try {
    const { postId, visitorId, durationSec, scrollDepth, source } = req.body as { postId: string; visitorId?: string; durationSec?: number; scrollDepth?: number; source?: string };
    if (!postId) return res.status(400).json({ message: 'postId required' });
    const prisma = new PrismaClient({ datasourceUrl: process.env.DATABASE_URL }).$extends(withAccelerate());

    const since = new Date(); since.setUTCHours(0,0,0,0);
    const where: any = { postId, createdAt: { gte: since } };
    if (visitorId) where.visitorId = visitorId;
    const pv = (prisma as any).postView;
    if (!pv) {
      return res.json({ success: true });
    }
    try {
      const latest = await pv.findFirst({ where, orderBy: { createdAt: 'desc' }, select: { id: true } });
      if (latest) {
        await pv.update({ where: { id: latest.id }, data: { durationSec: typeof durationSec === 'number' ? durationSec : undefined, scrollDepth: typeof scrollDepth === 'number' ? scrollDepth : undefined, source } });
      } else {
        await pv.create({ data: { postId, visitorId, durationSec, scrollDepth, source } });
      }
    } catch {
      try {
        await pv.create({ data: { postId } });
      } catch {}
    }
    return res.json({ success: true });
  } catch (error) {
    console.error('Analytics engagement error:', error);
    return res.status(500).json({ message: 'Failed to update engagement' });
  }
});

blogRouter.post('/analytics/share', async (req: Request, res: Response) => {
  try {
    const { postId, platform } = req.body as { postId: string; platform: string };
    if (!postId || !platform) return res.status(400).json({ message: 'postId and platform are required' });
    const prisma = new PrismaClient({ datasourceUrl: process.env.DATABASE_URL }).$extends(withAccelerate());
    await (prisma as any).postShare.create({ data: { postId, platform } });
    return res.json({ success: true });
  } catch (error) {
    console.error('Analytics share error:', error);
    return res.status(500).json({ message: 'Failed to record share' });
  }
});

blogRouter.get('/analytics/geo', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const prisma = new PrismaClient({ datasourceUrl: process.env.DATABASE_URL }).$extends(withAccelerate());
    const posts = await prisma.post.findMany({ where: { authorId: userId }, select: { id: true } });
    const postIds = posts.map(p => p.id);
    if (postIds.length === 0) return res.json({ countries: [] });
    const events = await (prisma as any).postView.findMany({ where: { postId: { in: postIds }, country: { not: null } }, select: { country: true } });
    const map = new Map<string, number>();
    (events as any[]).forEach(e => { const c = e.country as string; map.set(c, (map.get(c) || 0) + 1); });
    return res.json({ countries: Array.from(map.entries()).map(([country, count]) => ({ country, count })) });
  } catch (error) {
    console.error('Analytics geo error:', error);
    return res.status(500).json({ message: 'Failed to load geo analytics' });
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