import prisma from './prisma';

export async function createPost(data: {
    title: string;
    content: string;
    authorId: string;
    featuredImage: string;
    category: string;
    readTime: string;
    Date: Date;
}) {
    return prisma.post.create({ data });
}

export async function updatePost(
    postId: string,
    data: Partial<{
        title: string;
        content: string;
        category: string;
        published: boolean;
        featuredImage: string;
        readTime: string;
    }>
) {
    return prisma.post.update({ where: { id: postId }, data });
}

export async function deletePost(postId: string) {
    return prisma.post.delete({ where: { id: postId } });
}

export async function countPublishedPosts(search: string) {
    return prisma.post.count({
        where: {
            published: true,
            OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { content: { contains: search, mode: 'insensitive' } },
            ],
        },
    });
}

export async function findPublishedPosts(
    search: string,
    skip: number,
    take: number
) {
    return prisma.post.findMany({
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
            author: { select: { name: true, username: true, avatar: true } },
            readTime: true,
            featuredImage: true,
            category: true,
            Date: true,
        },
        skip,
        take,
        orderBy: { Date: 'desc' },
    });
}

export async function findPopularPosts(take: number) {
    return prisma.post.findMany({
        where: { published: true },
        orderBy: { views: 'desc' },
        take,
        select: {
            id: true,
            title: true,
            author: { select: { name: true, username: true, avatar: true } },
            readTime: true,
            featuredImage: true,
            category: true,
            Date: true,
        },
    });
}

export async function findFollowingBlogs(userId: string) {
    return prisma.user.findUnique({
        where: { id: userId },
        include: {
            following: {
                include: {
                    posts: {
                        where: { published: true },
                        select: {
                            id: true,
                            title: true,
                            author: {
                                select: {
                                    name: true,
                                    username: true,
                                    avatar: true,
                                },
                            },
                            readTime: true,
                            featuredImage: true,
                            category: true,
                            Date: true,
                        },
                        orderBy: { Date: 'desc' },
                    },
                },
            },
        },
    });
}

export async function findPostPublic(id: string) {
    return prisma.post.findUnique({
        where: { id },
        select: {
            id: true,
            title: true,
            content: true,
            author: { select: { name: true, username: true, avatar: true } },
            readTime: true,
            featuredImage: true,
            category: true,
            Date: true,
            views: true,
            published: true,
        },
    });
}

export async function incrementViews(id: string) {
    return prisma.post.update({
        where: { id },
        data: { views: { increment: 1 } },
    });
}

export async function findSimilarPosts(
    category: string,
    excludeId: string,
    take: number
) {
    return prisma.post.findMany({
        where: { category, id: { not: excludeId }, published: true },
        select: {
            id: true,
            title: true,
            author: { select: { name: true, username: true, avatar: true } },
            readTime: true,
            featuredImage: true,
            category: true,
            Date: true,
        },
        orderBy: { Date: 'desc' },
        take,
    });
}

export async function groupCommentsByPost(postIds: string[]) {
    return prisma.comment.groupBy({
        by: ['postId'],
        _count: { _all: true },
        where: { postId: { in: postIds } },
    });
}

export async function groupBookmarksByPost(postIds: string[]) {
    return prisma.bookmark.groupBy({
        by: ['postId'],
        _count: { _all: true },
        where: { postId: { in: postIds } },
    });
}

export async function findPostViewsSince(postIds: string[], since: Date) {
    return (prisma as any).postView.findMany({
        where: { postId: { in: postIds }, createdAt: { gte: since } },
        select: {
            postId: true,
            createdAt: true,
            visitorId: true,
            ip: true,
            userAgent: true,
        },
    });
}

export async function findPostViewsAll(postIds: string[]) {
    return (prisma as any).postView.findMany({
        where: { postId: { in: postIds } },
        select: { postId: true, visitorId: true, ip: true, userAgent: true },
    });
}

export async function findPostViewExists(params: {
    postId: string;
    visitorId?: string;
    ip?: string;
    userAgent?: string;
}) {
    const { postId, visitorId, ip, userAgent } = params;
    return (prisma as any).postView.findFirst({
        where: {
            postId,
            OR: [
                visitorId ? { visitorId } : undefined,
                ip || userAgent
                    ? {
                          AND: [
                              ip ? { ip } : undefined,
                              userAgent ? { userAgent } : undefined,
                          ].filter(Boolean) as any,
                      }
                    : undefined,
            ].filter(Boolean) as any,
        },
        select: { id: true },
    });
}

export async function findPostById(postId: string) {
    return prisma.post.findUnique({
        where: { id: postId },
        select: {
            id: true,
            authorId: true,
            title: true,
            views: true,
            published: true,
            Date: true,
        },
    });
}

export async function countComments(postId: string) {
    return prisma.comment.count({ where: { postId } });
}

export async function countBookmarks(postId: string) {
    return prisma.bookmark.count({ where: { postId } });
}

export async function createPostView(data: any) {
    try {
        return await (prisma as any).postView.create({ data });
    } catch {
        const fallback = {
            postId: data.postId,
            userId: data.userId,
            ip: data.ip,
            userAgent: data.userAgent,
            referrer: data.referrer,
        };
        return await (prisma as any).postView.create({ data: fallback });
    }
}

export async function createBookmark(userId: string, postId: string) {
    return prisma.bookmark.create({ data: { userId, postId } });
}

export async function deleteBookmark(userId: string, postId: string) {
    return prisma.bookmark.deleteMany({ where: { userId, postId } });
}

export async function findBookmarksByUser(userId: string) {
    return prisma.bookmark.findMany({
        where: { userId },
        include: { post: { include: { author: { select: { name: true, username: true, avatar: true } } } } },
        orderBy: { id: 'desc' },
    });
}

export async function findBookmark(userId: string, postId: string) {
    return prisma.bookmark.findFirst({ where: { userId, postId } });
}

export async function checkBookmarkExists(userId: string, postId: string): Promise<boolean> {
    const count = await prisma.bookmark.count({ where: { userId, postId } });
    return count > 0;
}
