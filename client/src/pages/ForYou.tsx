import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Newsletter from '../components/Newsletter';
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

interface FormatDateFunction {
    (dateString: string): string;
}

const formatDate: FormatDateFunction = (dateString) => {
    const date = new Date(dateString);

    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

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

            <section className="flex flex-col items-center space-y-5 px-5">
                <div>
                    <h3 className="text-2xl font-semibold text-gray-800 text-center my-10">
                        Most Popular Articles
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-10 pb-10">
                        {popularPosts.map((post) => (
                            <Link
                                key={post.id}
                                to={`/${post.author?.username || 'unknown'}/${post.id}`}
                            >
                                <div className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col h-full">
                                    <img
                                        src={post.featuredImage}
                                        alt={post.title}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-4 flex flex-col flex-grow">
                                        <div className="text-sm text-red-500 font-medium">
                                            {post.category} •{' '}
                                            {post.readTime || 'Read Time N/A'}
                                        </div>
                                        <h3 className="text-lg font-semibold mt-2 flex-grow">
                                            {post.title}
                                        </h3>
                                        <div className="mt-4 flex items-center space-x-4 text-gray-500">
                                            <img
                                                src={
                                                    post.author?.avatar ||
                                                    'default-avatar.png'
                                                }
                                                alt={
                                                    post.author?.name ||
                                                    'Unknown Author'
                                                }
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                            <div>
                                                <p className="font-medium text-sm">
                                                    {post.author?.name ||
                                                        'Unknown'}{' '}
                                                    • {formatDate(post.Date)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {followingBlogs.length > 0 && isAuthenticated && (
                    <div>
                        <h3 className="text-2xl font-semibold text-gray-800 text-center my-10">
                            Following
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-16 pb-10">
                            {followingBlogs.map((post) => (
                                <Link
                                    key={post.id}
                                    to={`/${post.author?.username || 'unknown'}/${post.id}`}
                                >
                                    <div className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col h-full">
                                        <img
                                            src={post.featuredImage}
                                            alt={post.title}
                                            className="w-full h-48 object-cover"
                                        />
                                        <div className="p-4 flex flex-col flex-grow">
                                            <div className="text-sm text-red-500 font-medium">
                                                {post.category} •{' '}
                                                {post.readTime ||
                                                    'Read Time N/A'}
                                            </div>
                                            <h3 className="text-lg font-semibold mt-2 flex-grow">
                                                {post.title}
                                            </h3>
                                            <div className="mt-4 flex items-center space-x-4 text-gray-500">
                                                <img
                                                    src={
                                                        post.author?.avatar ||
                                                        'default-avatar.png'
                                                    }
                                                    alt={
                                                        post.author?.name ||
                                                        'Unknown Author'
                                                    }
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                                <div>
                                                    <p className="font-medium text-sm">
                                                        {post.author?.name ||
                                                            'Unknown'}{' '}
                                                        •{' '}
                                                        {formatDate(post.Date)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
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
