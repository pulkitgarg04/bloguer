import {
    getAllUsers,
    getUserById,
    deleteUserById,
    updateUserAdmin,
    getAllPosts,
    getPostByIdAdmin,
    deletePostById,
    updatePostPublished,
    getAllComments,
    deleteCommentById,
    getAllSubscribers,
    deleteSubscriberById,
    getAllContactMessages,
    deleteContactMessageById,
    getDashboardStats,
} from '../repositories/admin.repository';
import { delPattern, delCache } from '../utils/cache';

export async function dashboardStatsService() {
    return getDashboardStats();
}

export async function listUsersService() {
    return getAllUsers();
}

export async function getUserService(id: string) {
    return getUserById(id);
}

export async function deleteUserService(id: string) {
    await deleteUserById(id);
    return { success: true };
}

export async function toggleAdminService(id: string, isAdmin: boolean) {
    return updateUserAdmin(id, isAdmin);
}

export async function listPostsService() {
    return getAllPosts();
}

export async function getPostService(id: string) {
    return getPostByIdAdmin(id);
}

export async function deletePostService(id: string) {
    await deletePostById(id);
    await delCache(`blog:post:${id}`);
    await delPattern('blog:bulk:*');
    await delCache('blog:popular');
    await delPattern('blog:following:*');
    return { success: true };
}

export async function togglePostPublishedService(id: string, published: boolean) {
    const result = await updatePostPublished(id, published);
    await delCache(`blog:post:${id}`);
    await delPattern('blog:bulk:*');
    await delCache('blog:popular');
    await delPattern('blog:following:*');
    return result;
}

export async function listCommentsService() {
    return getAllComments();
}

export async function deleteCommentService(id: string) {
    await deleteCommentById(id);
    return { success: true };
}

export async function listSubscribersService() {
    return getAllSubscribers();
}

export async function deleteSubscriberService(id: string) {
    await deleteSubscriberById(id);
    return { success: true };
}

export async function listContactMessagesService() {
    return getAllContactMessages();
}

export async function deleteContactMessageService(id: string) {
    await deleteContactMessageById(id);
    return { success: true };
}
