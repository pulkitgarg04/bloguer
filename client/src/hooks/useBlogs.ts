import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Blog {
    id: string;
    title: string;
    content: string;
    featuredImage: string;
    category: string;
    Date: string;
    readTime: string | null;
    author: {
        name: string;
        username: string;
        avatar: string;
    };
}

interface BulkBlogsResponse {
    blogs: Blog[];
    totalPages: number;
}

export const useBlogs = (page: number, limit: number, search: string) => {
    return useQuery({
        queryKey: ['blogs', page, limit, search],
        queryFn: async () => {
            const pageLimit = page === 1 ? 10 : 9;
            const response = await axios.get<BulkBlogsResponse>(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/bulk`,
                {
                    params: {
                        page,
                        limit: pageLimit,
                        search,
                    },
                }
            );
            return response.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

interface PopularBlogsResponse {
    popularPosts: Blog[];
}

export const usePopularBlogs = () => {
    return useQuery({
        queryKey: ['popularBlogs'],
        queryFn: async () => {
            const response = await axios.get<PopularBlogsResponse>(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/getPopularBlogs`
            );
            return response.data.popularPosts;
        },
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
};

interface FollowingBlogsResponse {
    followingBlogs: { posts: Blog[] }[];
}

export const useFollowingBlogs = (userId?: string) => {
    return useQuery({
        queryKey: ['followingBlogs', userId],
        queryFn: async () => {
            if (!userId) return [];
            const response = await axios.get<FollowingBlogsResponse>(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/getFollowingBlogs`,
                { params: { userId } }
            );
            return response.data.followingBlogs.flatMap((blog) => blog.posts);
        },
        enabled: !!userId,
        staleTime: 3 * 60 * 1000, // 3 minutes
    });
};
