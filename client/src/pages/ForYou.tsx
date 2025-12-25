import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Newsletter from '../components/Newsletter';
import BlogCard from '../components/BlogCard';
import Skeleton from '../components/Skeleton';
import { useAuthStore } from '../store/authStore';

interface Author {
    username: string;
    name: string;
    avatar: string;
}

interface Post {
    id: string;
    title: string;
    content?: string;
    featuredImage: string;
    category: string;
    readTime: string | null;
    Date: string;
    author: Author;
}

interface PopularBlogsResponse {
    popularPosts: Post[];
}

interface FollowingBlogsResponse {
    followingBlogs: { posts: Post[] }[];
}

const ForYou: React.FC = () => {
    const { user, isAuthenticated } = useAuthStore();
    const [popularPosts, setPopularPosts] = useState<Post[]>([]);
    const [followingBlogs, setFollowingBlogs] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPopularBlogs = async () => {
            try {
                const response = await axios.get<PopularBlogsResponse>(
                    `${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/getPopularBlogs`
                );

                setPopularPosts(response.data.popularPosts);
            } catch (error) {
                console.error('Error fetching popular blogs:', error);
            }
        };

        const fetchFollowingBlogs = async () => {
            try {
                if (user) {
                    const userId = user?.id;
                    const response = await axios.get<FollowingBlogsResponse>(
                        `${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/getFollowingBlogs`,
                        { params: { userId } }
                    );
                    const blogs = response.data.followingBlogs.flatMap(
                        (blog) => blog.posts
                    );

                    setFollowingBlogs(blogs);
                }
            } catch (error) {
                console.error('Error fetching following blogs:', error);
            }
        };

        const fetchData = async () => {
            setLoading(true);

            try {
                await fetchPopularBlogs();

                if (user) {
                    await fetchFollowingBlogs();
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id]);

    if (loading) {
        return (
            <div className="min-h-screen font-inter bg-gray-50">
                <Navbar activeTab="Blogs" />
                <Skeleton />
                <Newsletter />
                <Footer />
            </div>
        );
    }

    return (
    <div className="min-h-screen font-inter bg-gray-50">
            <Navbar activeTab="Blogs" />

            <section className="flex flex-col items-center space-y-5 px-4 md:px-5">
                <div className="w-full">
                    <h3 className="text-xl md:text-2xl font-semibold text-gray-800 text-center my-6 md:my-10">
                        Most Popular Articles
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 px-2 md:px-10 pb-10">
                        {popularPosts.map((post) => (
                            <BlogCard
                                key={post.id}
                                id={post.id}
                                title={post.title}
                                category={post.category}
                                readTime={post.readTime || undefined}
                                featuredImage={post.featuredImage}
                                author={post.author}
                                date={post.Date}
                            />
                        ))}
                    </div>
                </div>

                {followingBlogs.length > 0 && isAuthenticated && (
                    <div className="w-full">
                        <h3 className="text-xl md:text-2xl font-semibold text-gray-800 text-center my-6 md:my-10">
                            Following
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 px-2 md:px-16 pb-10">
                            {followingBlogs.map((post) => (
                                <BlogCard
                                    key={post.id}
                                    id={post.id}
                                    title={post.title}
                                    category={post.category}
                                    readTime={post.readTime || undefined}
                                    featuredImage={post.featuredImage}
                                    author={post.author}
                                    date={post.Date}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </section>

            <Newsletter />
            <Footer />
        </div>
    );
};

export default ForYou;
