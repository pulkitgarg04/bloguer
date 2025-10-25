import { getCache, setCache, delCache, delPattern } from '../utils/cache';
import { lookupCountry } from '../utils/geo';
import {
    createPost,
    updatePost,
    countPublishedPosts,
    findPublishedPosts,
    findPopularPosts,
    findFollowingBlogs,
    findPostPublic,
    incrementViews,
    findSimilarPosts,
    groupCommentsByPost,
    groupBookmarksByPost,
    findPostViewsSince,
    findPostViewsAll,
    findPostById,
    countComments,
    countBookmarks,
    createPostView,
} from '../repositories/blog.repository';

const TTL_BULK = 600; // 10 minutes
const TTL_POPULAR = 21600; // 6 hours
const TTL_FOLLOWING = 180; // 3 minutes
const TTL_POST = 120; // 2 minutes

function readingTime(content: string) {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} Min Read`;
}

export async function createPostService(
    userId: string,
    body: { title: string; content: string; category: string }
) {
    const post = await createPost({
        title: body.title,
        content: body.content,
        authorId: userId,
        featuredImage: `/thumbnails/${body.category}.webp`,
        category: body.category,
        readTime: readingTime(body.content),
        Date: new Date(),
    });
    await delPattern('blog:bulk:*');
    await delCache('blog:popular');
    await delPattern('blog:following:*');
    return post;
}

export async function updatePostService(
    postId: string,
    data: Partial<{
        title: string;
        content: string;
        category: string;
        published: boolean;
    }>
) {
    const post = await updatePost(postId, data);
    await delCache(`blog:post:${post.id}`);
    await delPattern('blog:bulk:*');
    await delCache('blog:popular');
    await delPattern('blog:following:*');
    return post;
}

export async function bulkService(page: number, limit: number, search: string) {
    const cacheKey = `blog:bulk:${page}:${limit}:${String(search || '').toLowerCase()}`;
    const cached = await getCache(cacheKey);
    if (cached) return JSON.parse(cached);

    const totalCount = await countPublishedPosts(search);
    const posts = await findPublishedPosts(search, (page - 1) * limit, limit);
    const payload = {
        blogs: posts,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
    };
    await setCache(cacheKey, JSON.stringify(payload), TTL_BULK);
    return payload;
}

export async function popularService() {
    const cacheKey = 'blog:popular';
    const cached = await getCache(cacheKey);
    if (cached) return JSON.parse(cached);
    const popularPosts = await findPopularPosts(6);
    const payload = { popularPosts };
    await setCache(cacheKey, JSON.stringify(payload), TTL_POPULAR);
    return payload;
}

export async function followingService(userId: string) {
    const cacheKey = `blog:following:${userId}`;
    const cached = await getCache(cacheKey);
    if (cached) return JSON.parse(cached);
    const followingBlogs = await findFollowingBlogs(userId);
    const payload = { followingBlogs: followingBlogs?.following || [] };
    await setCache(cacheKey, JSON.stringify(payload), TTL_FOLLOWING);
    return payload;
}

export async function getPostService(reqMeta: {
    id: string;
    ip?: string;
    userAgent?: string;
    ref?: string;
    userId?: string;
    visitorId?: string;
}) {
    const { id } = reqMeta;
    const cacheKey = `blog:post:${id}`;
    const cached = await getCache(cacheKey);
    if (cached) {
        try {
            await incrementViews(id);
        } catch {}
        try {
            const country = await lookupCountry(reqMeta.ip);
            let isReturning = false;
            if (reqMeta.visitorId) {
                const prev = await findPostViewsAll([id]);
                isReturning = !!prev.find(
                    (v: any) => v.visitorId === reqMeta.visitorId
                );
            }
            await createPostView({
                postId: id,
                userId: reqMeta.userId,
                ip: reqMeta.ip,
                userAgent: reqMeta.userAgent,
                referrer: reqMeta.ref,
                visitorId: reqMeta.visitorId,
                source: classifySource(reqMeta.ref),
                country,
                isReturning,
            });
        } catch {}
        return JSON.parse(cached);
    }

    const post = await findPostPublic(id);
    if (!post || !post.published) return null;
    await incrementViews(id);

    try {
        const country = await lookupCountry(reqMeta.ip);
        let isReturning = false;
        if (reqMeta.visitorId) {
            const prev = await findPostViewsAll([id]);
            isReturning = !!prev.find(
                (v: any) => v.visitorId === reqMeta.visitorId
            );
        }
        await createPostView({
            postId: id,
            userId: reqMeta.userId,
            ip: reqMeta.ip,
            userAgent: reqMeta.userAgent,
            referrer: reqMeta.ref,
            visitorId: reqMeta.visitorId,
            source: classifySource(reqMeta.ref),
            country,
            isReturning,
        });
    } catch {}

    const similarPosts = await findSimilarPosts(
        post.category as string,
        post.id,
        3
    );
    const { published: _pub, ...safePost } = post as any;
    const payload = { post: safePost, similarPosts };
    await setCache(cacheKey, JSON.stringify(payload), TTL_POST);
    return payload;
}

export async function analyticsOverviewService(userId: string) {
    const posts = await (
        await import('../repositories/prisma')
    ).default.post.findMany({
        where: { authorId: userId },
        select: {
            id: true,
            title: true,
            views: true,
            published: true,
            Date: true,
        },
    });
    const postIds = posts.map((p) => p.id);
    const [commentGroups, bookmarkGroups, last30Views, uniqueViews] =
        await Promise.all([
            groupCommentsByPost(postIds),
            groupBookmarksByPost(postIds),
            findPostViewsSince(
                postIds,
                new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            ),
            findPostViewsAll(postIds),
        ]);
    const commentsByPost = new Map<string, number>();
    (commentGroups as any[]).forEach((g: any) =>
        commentsByPost.set(g.postId, g._count._all)
    );
    const bookmarksByPost = new Map<string, number>();
    (bookmarkGroups as any[]).forEach((g: any) =>
        bookmarksByPost.set(g.postId, g._count._all)
    );
    const last30ByPost = new Map<string, number>();
    (last30Views as any[]).forEach((v: any) =>
        last30ByPost.set(v.postId, (last30ByPost.get(v.postId) || 0) + 1)
    );
    const uniqueKeySet = new Set<string>();
    (uniqueViews as any[]).forEach((v: any) => {
        const uniqKey = v.visitorId || `${v.ip || ''}|${v.userAgent || ''}`;
        uniqueKeySet.add(`${v.postId}::${uniqKey}`);
    });
    const uniqCounts = new Map<string, number>();
    for (const setKey of uniqueKeySet) {
        const [pid] = setKey.split('::');
        uniqCounts.set(pid, (uniqCounts.get(pid) || 0) + 1);
    }
    const items = posts.map((p) => ({
        postId: p.id,
        title: p.title,
        totalViews: p.views,
        last30dViews: last30ByPost.get(p.id) || 0,
        comments: commentsByPost.get(p.id) || 0,
        bookmarks: bookmarksByPost.get(p.id) || 0,
        uniqueViews: uniqCounts.get(p.id) || 0,
        engagementRate:
            p.views > 0
                ? Math.round(
                      (((commentsByPost.get(p.id) || 0) +
                          (bookmarksByPost.get(p.id) || 0)) /
                          p.views) *
                          1000
                  ) / 10
                : 0,
        published: p.published,
        date: p.Date,
    }));
    return { items };
}

export async function analyticsPostService(userId: string, postId: string) {
    const post = await findPostById(postId);
    if (!post) return null;
    if (post.authorId !== userId) return 'forbidden';
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const events = (await (
        await import('../repositories/prisma')
    ).default.postView.findMany({
        where: { postId, createdAt: { gte: since } },
        select: {
            createdAt: true,
            userAgent: true,
            visitorId: true,
            durationSec: true,
            source: true,
            country: true,
        },
    })) as any[];
    const comments = await countComments(postId);
    const bookmarks = await countBookmarks(postId);
    const days: { date: string; views: number }[] = [];
    for (let i = 29; i >= 0; i--) {
        const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
        const key = d.toISOString().slice(0, 10);
        days.push({ date: key, views: 0 });
    }
    const map = new Map(days.map((d) => [d.date, 0] as [string, number]));
    events.forEach((ev: any) => {
        const key = (ev.createdAt as Date).toISOString().slice(0, 10);
        map.set(key, (map.get(key) || 0) + 1);
    });
    const timeseries = days.map((d) => ({
        date: d.date,
        views: map.get(d.date) || 0,
    }));
    let mobile = 0,
        desktop = 0,
        other = 0;
    events.forEach((ev: any) => {
        const ua = (ev.userAgent || '').toLowerCase();
        if (/mobile|android|iphone|ipad/.test(ua)) mobile++;
        else if (/windows|macintosh|linux/.test(ua)) desktop++;
        else other++;
    });
    const uniqueVisitors = new Set<string>();
    events.forEach((ev: any) => uniqueVisitors.add(ev.visitorId || 'na'));
    const durations: number[] = [];
    const sourceCounts = new Map<string, number>();
    const countryCounts = new Map<string, number>();
    events.forEach((ev: any) => {
        if (typeof ev.durationSec === 'number') durations.push(ev.durationSec);
        if (ev.source)
            sourceCounts.set(ev.source, (sourceCounts.get(ev.source) || 0) + 1);
        if (ev.country)
            countryCounts.set(
                ev.country,
                (countryCounts.get(ev.country) || 0) + 1
            );
    });
    const avgReadTimeSec = durations.length
        ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
        : 0;
    return {
        post: {
            id: post.id,
            title: post.title,
            totalViews: post.views,
            published: post.published,
            date: post.Date,
        },
        timeseries,
        comments,
        bookmarks,
        devices: { mobile, desktop, other },
        uniqueVisitors: uniqueVisitors.size,
        avgReadTimeSec,
        sources: Array.from(sourceCounts.entries()).map(([source, count]) => ({
            source,
            count,
        })),
        countries: Array.from(countryCounts.entries()).map(
            ([country, count]) => ({ country, count })
        ),
    };
}

function classifySource(ref?: string) {
    if (!ref) return 'direct';
    if (/twitter|t.co|x\.com/i.test(ref)) return 'social';
    if (/facebook\.com/i.test(ref)) return 'social';
    if (/linkedin\.com/i.test(ref)) return 'social';
    if (/google\.|bing\.|duckduckgo\.|yahoo\./i.test(ref)) return 'search';
    return 'referral';
}
