import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';
import Skeleton from '../components/Skeleton';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

type FormatDateFunction = (dateString: string) => string;

const formatDate: FormatDateFunction = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

interface Blogs {
    id: string;
    title: string;
    author: { username: string; avatar: string; name: string };
    featuredImage: string;
    category: string;
    readTime?: string;
    content: string;
    Date: string;
}

export default function Bookmarked() {
    const { user } = useAuthStore();
    const [blogs, setBlogs] = useState<Blogs[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            const fetchBookmarkedBlogs = async () => {
                setLoading(true);
                try {
                    const response = await axios.get(
                        `${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/bookmarks/${
                            user.id
                        }`
                    );
                    setLoading(false);
                    if (Array.isArray(response.data.posts)) {
                        setBlogs(response.data.posts);
                    } else {
                        setBlogs([]);
                    }
                } catch (error) {
                    toast.error('Failed to fetch bookmarked blogs');
                    console.error(error);
                }
            };

            fetchBookmarkedBlogs();
        }
    }, [user]);

    const filteredBlogs = blogs.filter((blog) =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen font-inter">
            <Navbar activeTab="Blogs" />

            <section className="flex flex-col items-center space-y-5 px-4">
                <h3 className="mt-10 text-3xl font-semibold text-gray-800">
                    Your Bookmarked Blogs
                </h3>
                <p className="text-gray-600 text-center">
                    Explore insightful articles, trending topics, and deep dives
                    into the world of blogging.
                </p>
                <div className="flex items-center w-full max-w-lg bg-gray-200 px-4 py-2 rounded-lg shadow-sm">
                    <Search className="text-red-500" size={20} />
                    <input
                        type="text"
                        className="w-full p-2 bg-transparent outline-none text-gray-800 placeholder-gray-500"
                        placeholder="Search for blogs from bookmarked ..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </section>

            {loading ? (
                <Skeleton />
            ) : (
                <section className="mt-16 px-4">
                    {filteredBlogs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-10 pb-10">
                            {filteredBlogs.map((blog) => (
                                <Link
                                    key={blog.id}
                                    to={`/${blog.author.username}/${blog.id}`}
                                >
                                    <div className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col h-full">
                                        <img
                                            src={blog.featuredImage}
                                            alt={blog.title}
                                            className="w-full h-48 object-cover"
                                        />
                                        <div className="p-4 flex flex-col flex-grow">
                                            <div className="text-sm text-red-500 font-medium">
                                                {blog.category} •{' '}
                                                {blog.readTime ||
                                                    'Read Time N/A'}
                                            </div>
                                            <h3 className="text-lg font-semibold mt-2 flex-grow">
                                                {blog.title}
                                            </h3>
                                            <p
                                                className="mt-4 text-gray-700 text-sm line-clamp-2"
                                                dangerouslySetInnerHTML={{
                                                    __html: blog.content,
                                                }}
                                            />
                                            <div className="mt-4 flex items-center space-x-4 text-gray-500">
                                                <img
                                                    src={blog.author.avatar}
                                                    alt={blog.author.name}
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                                <div>
                                                    <p className="font-medium text-sm">
                                                        {blog.author.name} •{' '}
                                                        {formatDate(blog.Date)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center mt-10 font-medium text-xl">
                            No Bookmarked Blogs
                        </div>
                    )}
                </section>
            )}

            <Newsletter />
            <Footer />
        </div>
    );
}
