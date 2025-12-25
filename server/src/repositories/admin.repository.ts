import prisma from './prisma';

export async function getAllUsers() {
    return (prisma as any).user.findMany({
        select: {
            id: true,
            email: true,
            name: true,
            username: true,
            avatar: true,
            isAdmin: true,
            JoinedDate: true,
            emailVerifiedAt: true,
            provider: true,
            _count: {
                select: { posts: true, comments: true, followers: true, following: true },
            },
        },
        orderBy: { JoinedDate: 'desc' },
    });
}

export async function getUserById(id: string) {
    return (prisma as any).user.findUnique({
        where: { id },
        select: {
            id: true,
            email: true,
            name: true,
            username: true,
            avatar: true,
            bio: true,
            location: true,
            isAdmin: true,
            JoinedDate: true,
            emailVerifiedAt: true,
            provider: true,
            _count: {
                select: { posts: true, comments: true, followers: true, following: true },
            },
        },
    });
}

export async function deleteUserById(id: string) {
    await prisma.comment.deleteMany({ where: { authorId: id } });
    await prisma.bookmark.deleteMany({ where: { userId: id } });
    await prisma.post.deleteMany({ where: { authorId: id } });
    return prisma.user.delete({ where: { id } });
}

export async function updateUserAdmin(id: string, isAdmin: boolean) {
    return (prisma as any).user.update({
        where: { id },
        data: { isAdmin },
        select: { id: true, isAdmin: true },
    });
}

export async function getAllPosts() {
    return prisma.post.findMany({
        select: {
            id: true,
            title: true,
            category: true,
            published: true,
            views: true,
            Date: true,
            author: { select: { id: true, name: true, username: true, avatar: true } },
            _count: { select: { comments: true, bookmarks: true } },
        },
        orderBy: { Date: 'desc' },
    });
}

export async function getPostByIdAdmin(id: string) {
    return prisma.post.findUnique({
        where: { id },
        include: {
            author: { select: { id: true, name: true, username: true, avatar: true } },
            comments: {
                include: { author: { select: { id: true, name: true, username: true, avatar: true } } },
                orderBy: { createdAt: 'desc' },
            },
        },
    });
}

export async function deletePostById(id: string) {
    return prisma.post.delete({ where: { id } });
}

export async function updatePostPublished(id: string, published: boolean) {
    return prisma.post.update({
        where: { id },
        data: { published },
        select: { id: true, published: true },
    });
}

export async function getAllComments() {
    return prisma.comment.findMany({
        select: {
            id: true,
            content: true,
            createdAt: true,
            author: { select: { id: true, name: true, username: true, avatar: true } },
            post: { select: { id: true, title: true } },
        },
        orderBy: { createdAt: 'desc' },
    });
}

export async function deleteCommentById(id: string) {
    return prisma.comment.delete({ where: { id } });
}

export async function getAllSubscribers() {
    return (prisma as any).newsletterSubscriber.findMany({
        orderBy: { createdAt: 'desc' },
    });
}

export async function deleteSubscriberById(id: string) {
    return (prisma as any).newsletterSubscriber.delete({ where: { id } });
}

export async function getAllContactMessages() {
    return (prisma as any).contactMessage.findMany({
        orderBy: { createdAt: 'desc' },
    });
}

export async function deleteContactMessageById(id: string) {
    return (prisma as any).contactMessage.delete({ where: { id } });
}

export async function getDashboardStats() {
    const [usersCount, postsCount, commentsCount, subscribersCount, messagesCount, totalViews] = await Promise.all([
        prisma.user.count(),
        prisma.post.count(),
        prisma.comment.count(),
        (prisma as any).newsletterSubscriber.count(),
        (prisma as any).contactMessage.count(),
        prisma.post.aggregate({ _sum: { views: true } }),
    ]);

    const recentUsers = await prisma.user.findMany({
        take: 5,
        orderBy: { JoinedDate: 'desc' },
        select: { id: true, name: true, username: true, avatar: true, JoinedDate: true },
    });

    const recentPosts = await prisma.post.findMany({
        take: 5,
        orderBy: { Date: 'desc' },
        select: {
            id: true,
            title: true,
            Date: true,
            author: { select: { name: true, username: true } },
        },
    });

    return {
        usersCount,
        postsCount,
        commentsCount,
        subscribersCount,
        messagesCount,
        totalViews: totalViews._sum.views || 0,
        recentUsers,
        recentPosts,
    };
}
