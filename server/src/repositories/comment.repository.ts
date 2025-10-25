import prisma from './prisma';

export async function createComment(data: {
    content: string;
    authorId: string;
    postId: string;
}) {
    return (prisma as any).comment.create({
        data,
        include: {
            author: {
                select: { id: true, name: true, username: true, avatar: true },
            },
        },
    });
}

export async function findCommentsByPost(postId: string) {
    return (prisma as any).comment.findMany({
        where: { postId },
        orderBy: { createdAt: 'desc' },
        include: {
            author: {
                select: { id: true, name: true, username: true, avatar: true },
            },
        },
    });
}

export async function findCommentById(commentId: string) {
    return (prisma as any).comment.findUnique({
        where: { id: commentId },
        select: {
            id: true,
            authorId: true,
            post: { select: { authorId: true } },
        },
    });
}

export async function updateComment(commentId: string, content: string) {
    return (prisma as any).comment.update({
        where: { id: commentId },
        data: { content },
        include: {
            author: {
                select: { id: true, name: true, username: true, avatar: true },
            },
        },
    });
}

export async function deleteComment(commentId: string) {
    return (prisma as any).comment.delete({ where: { id: commentId } });
}
