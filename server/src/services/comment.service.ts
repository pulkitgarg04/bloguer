import {
    createComment,
    deleteComment,
    findCommentById,
    findCommentsByPost,
    updateComment,
} from '../repositories/comment.repository';

export async function createCommentService(
    userId: string,
    postId: string,
    content: string
) {
    return createComment({ content, authorId: userId, postId });
}

export async function listCommentsService(postId: string) {
    return findCommentsByPost(postId);
}

export async function updateCommentService(
    userId: string,
    commentId: string,
    content: string
) {
    const existing = await findCommentById(commentId);
    if (!existing) return { notFound: true };

    if (existing.authorId !== userId) return { forbidden: true };

    const updated = await updateComment(commentId, content);

    return { comment: updated };
}

export async function deleteCommentService(userId: string, commentId: string) {
    const existing = await findCommentById(commentId);
    if (!existing) return { notFound: true };

    const isCommentAuthor = existing.authorId === userId;
    const isPostAuthor = existing.post?.authorId === userId;

    if (!isCommentAuthor && !isPostAuthor) return { forbidden: true };

    await deleteComment(commentId);

    return { success: true };
}
