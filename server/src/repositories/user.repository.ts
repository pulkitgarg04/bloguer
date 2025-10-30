import prisma from './prisma';

export async function findUserByEmail(email: string) {
    return prisma.user.findFirst({ where: { email } });
}

export async function findUserByUsername(username: string) {
    return prisma.user.findFirst({
        where: {
            username: {
                equals: username,
                mode: 'insensitive',
            },
        },
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

export async function createUserFromGoogle(data: {
    name: string;
    email: string;
    avatar?: string;
    googleId: string;
}) {
    return (prisma as any).user.create({
        data: {
            name: data.name,
            username: data.email.split('@')[0],
            email: data.email,
            password: 'GOOGLE',
            avatar: data.avatar,
            JoinedDate: new Date(),
            provider: 'GOOGLE',
            googleId: data.googleId,
            emailVerifiedAt: new Date(),
        },
    });
}

export async function findUserProfile(username: string) {
    return prisma.user.findFirst({
        where: { username: { equals: username, mode: 'insensitive' } },
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
        where: {
            authorId
        },
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

export async function setVerificationToken(
    userId: string,
    token: string,
    expiresAt: Date
) {
    return (prisma as any).user.update({
        where: { id: userId },
        data: { verificationToken: token, verificationTokenExpires: expiresAt },
        select: { id: true },
    });
}

export async function findUserByVerificationToken(token: string) {
    return (prisma as any).user.findFirst({
        where: { verificationToken: token },
    });
}

export async function markEmailVerified(userId: string) {
    return (prisma as any).user.update({
        where: { id: userId },
        data: {
            emailVerifiedAt: new Date(),
            verificationToken: null,
            verificationTokenExpires: null,
        },
        select: { id: true, emailVerifiedAt: true },
    });
}

export async function findUserByGoogleId(googleId: string) {
    return (prisma as any).user.findFirst({ where: { googleId } });
}

export async function setPasswordResetToken(
    userId: string,
    token: string,
    expiresAt: Date
) {
    return (prisma as any).user.update({
        where: { id: userId },
        data: {
            resetPasswordToken: token,
            resetPasswordTokenExpires: expiresAt,
        },
        select: { id: true },
    });
}

export async function findUserByResetToken(token: string) {
    return (prisma as any).user.findFirst({
        where: { resetPasswordToken: token },
    });
}

export async function updatePassword(userId: string, hashedPassword: string) {
    return (prisma as any).user.update({
        where: { id: userId },
        data: {
            password: hashedPassword,
            resetPasswordToken: null,
            resetPasswordTokenExpires: null,
        },
        select: { id: true },
    });
}
