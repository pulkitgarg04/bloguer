import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react';

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
    currentPage: number;
}

const fetchBlogs = async (page: number, limit: number, search: string): Promise<BulkBlogsResponse> => {
    const response = await axios.get<BulkBlogsResponse>(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/bulk`,
        {
            params: { page, limit, search },
        }
    );
    return response.data;
};

export const useBlogs = (page: number, limit: number, search: string) => {
    const queryClient = useQueryClient();
    
    const query = useQuery({
        queryKey: ['blogs', page, limit, search],
        queryFn: () => {
            const pageLimit = page === 1 ? 10 : 9;
            return fetchBlogs(page, pageLimit, search);
        },
        staleTime: search ? 5 * 60 * 1000 : 30 * 60 * 1000, // 5 min for search, 30 min for homepage
        gcTime: 60 * 60 * 1000, // Cached for 1 hour
        placeholderData: (previousData) => previousData, // Keep showing old data while loading new
    });

    useEffect(() => {
        if (query.data && !search && page < query.data.totalPages) {
            const nextPage = page + 1;
            const nextLimit = nextPage === 1 ? 10 : 9;
            queryClient.prefetchQuery({
                queryKey: ['blogs', nextPage, nextLimit, search],
                queryFn: () => fetchBlogs(nextPage, nextLimit, search),
                staleTime: 30 * 60 * 1000,
            });
        }
    }, [query.data, page, search, queryClient]);

    return query;
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
