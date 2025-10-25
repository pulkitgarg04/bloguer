import prisma from './prisma';

export async function findUserByEmail(email: string) {
    return prisma.user.findFirst({ where: { email } });
}

export async function findUserByUsername(username: string) {
    return prisma.user.findUnique({
        where: { username: username.toLowerCase() },
        include: { followers: true, following: true },
    });
}

export async function createUser(data: {
    name: string;
    username: string;
    email: string;
    password: string;
    avatar: string;
    JoinedDate: Date;
}) {
    return prisma.user.create({ data });
}

export async function findUserProfile(username: string) {
    return prisma.user.findUnique({
        where: { username: username.toLowerCase() },
        select: {
            id: true,
            name: true,
            username: true,
            email: true,
            avatar: true,
            JoinedDate: true,
            location: true,
            bio: true,
            followers: true,
        },
    });
}

export async function findPostsByAuthor(authorId: string) {
    return prisma.post.findMany({
        where: { authorId },
        select: {
            id: true,
            title: true,
            content: true,
            featuredImage: true,
            readTime: true,
            category: true,
            views: true,
            Date: true,
        },
        orderBy: { Date: 'desc' },
    });
}

export async function follow(userId: string, targetId: string) {
    await prisma.$transaction([
        prisma.user.update({
            where: { id: userId },
            data: { following: { connect: { id: targetId } } },
        }),
        prisma.user.update({
            where: { id: targetId },
            data: { followers: { connect: { id: userId } } },
        }),
    ]);
}

export async function unfollow(userId: string, targetId: string) {
    await prisma.$transaction([
        prisma.user.update({
            where: { id: userId },
            data: { following: { disconnect: { id: targetId } } },
        }),
        prisma.user.update({
            where: { id: targetId },
            data: { followers: { disconnect: { id: userId } } },
        }),
    ]);
}

export async function findUserBasicById(id: string) {
    return prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            username: true,
            email: true,
            avatar: true,
        },
    });
}

export async function isFollowing(userId: string, targetId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            following: { select: { id: true }, where: { id: targetId } },
        },
    });
    return !!user?.following?.length;
}
