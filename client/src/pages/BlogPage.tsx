import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Newsletter from '../components/Newsletter';
import { useAuthStore } from '../store/authStore';
import Footer from '../components/Footer';
import {
    Twitter,
    Facebook,
    Mail,
    Linkedin,
    Eye,
    Calendar1,
    Bookmark,
} from 'lucide-react';
import DOMPurify from 'dompurify';
import { toast } from 'react-hot-toast';

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

interface Blog {
    id: string;
    category: string;
    readTime: string;
    title: string;
    author: {
        name: string;
        username: string;
        avatar: string;
    };
    Date: string;
    featuredImage: string;
    content: string;
    views: number;
}

interface SimilarBlog {
    id: string;
    category: string;
    readTime: string;
    title: string;
    featuredImage: string;
    content: string;
    author: {
        name: string;
        username: string;
        avatar: string;
    };
    Date: string;
    views: number;
}

export default function BlogPage() {
    const { postId } = useParams();

    const [blog, setBlog] = useState<Blog | null>(null);
    const [similarBlogs, setSimilarBlogs] = useState<SimilarBlog[]>([]);

    const [isBookmarked, setIsBookmarked] = useState(false);
    const { user } = useAuthStore();

    useEffect(() => {
        const fetchBlogData = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/${postId}`
                );
                const data = await response.data;
                setBlog(data.post);
                setSimilarBlogs(data.similarPosts);
            } catch (error) {
                toast.error(`Error fetching blog data: ${error}`);
            }
        };

        fetchBlogData();
    }, [postId]);

    useEffect(() => {
        const checkBookmark = async () => {
            if (user) {
                try {
                    const response = await axios.get(
                        `${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/bookmarks/${
                            user.id
                        }`
                    );
                    const isAlreadyBookmarked = response.data.posts.some(
                        (post: Blog) => post.id === postId
                    );
                    setIsBookmarked(isAlreadyBookmarked);
                } catch (error) {
                    console.error('Error fetching bookmark status:', error);
                }
            }
        };

        checkBookmark();
    }, [user, postId]);

    const handleBookmarkToggle = async () => {
        if (user) {
            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/bookmark`,
                    { userId: user.id, postId }
                );
                setIsBookmarked((prev) => !prev);
                toast.success(response.data.message);
            } catch (error) {
                toast.error('Failed to toggle bookmark');
                console.error(error);
            }
        } else {
            toast.error('You need to be login to bookmark this article.');
        }
    };

    if (!blog) {
        return (
            <div className="min-h-screen font-inter">
                <Navbar activeTab={'Blogs'} />
                <section className="p-10 bg-gray-100">
                    <div className="w-1/3 h-6 bg-gray-300 animate-pulse mx-auto"></div>
                </section>

                <section className="py-10">
                    <div className="max-w-3xl mx-auto bg-gray-300 h-96 animate-pulse"></div>

                    <div className="max-w-3xl mx-auto px-4 py-6">
                        <div className="bg-gray-300 h-6 w-3/4 animate-pulse mb-4"></div>
                        <div className="bg-gray-300 h-6 w-5/6 animate-pulse mb-4"></div>
                        <div className="bg-gray-300 h-6 w-1/2 animate-pulse mb-4"></div>
                    </div>
                </section>

                <section className="py-10">
                    <div className="flex justify-center gap-10">
                        {[...Array(3)].map((_, idx) => (
                            <div
                                key={idx}
                                className="flex flex-col justify-center bg-gray-50 rounded-md p-4 w-64 shadow-lg hover:scale-105 duration-200 animate-pulse"
                            >
                                <div className="bg-gray-300 h-36 w-full rounded-md"></div>
                                <div className="py-3">
                                    <div className="bg-gray-300 h-6 w-2/3 animate-pulse"></div>
                                    <div className="bg-gray-300 h-6 w-1/2 animate-pulse mt-2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
                <Newsletter />
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen font-inter">
            <Navbar activeTab={'Blogs'} />

            <section className="p-10 bg-gray-100">
                <p className="text-center">
                    {blog.category} • {blog.readTime}
                </p>
                <div className="flex justify-center items-center py-6">
                    <h1 className="text-center text-4xl w-2/3 font-semibold">
                        {blog.title}
                    </h1>
                </div>
                <div className="flex justify-center items-center">
                    <Link to={`/profile/${blog.author.username}`}>
                        <img
                            src={blog.author.avatar}
                            alt={blog.author.name}
                            className="h-10 w-10"
                        />
                    </Link>
                    <div className="text-lg pl-3 flex">
                        <Link to={`/profile/${blog.author.username}`}>
                            <p>{blog.author.name}</p>
                        </Link>
                        <p className="flex gap-2 justify-center items-center ml-8 mx-4">
                            <Calendar1 size={15} />{' '}
                            <span>{formatDate(blog.Date)}</span>
                        </p>
                        <p className="flex gap-2 justify-center items-center mx-4">
                            <Eye size={15} /> <span>{blog.views} views</span>
                        </p>
                        <button
                            onClick={handleBookmarkToggle}
                            className={`flex gap-2 justify-center items-center mx-4 px-2 rounded-md ${
                                isBookmarked
                                    ? 'bg-gray-300 text-blue-600'
                                    : 'hover:bg-gray-300'
                            }`}
                        >
                            <Bookmark size={15} />
                            <p>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</p>
                        </button>
                    </div>
                </div>
            </section>

            <section className="py-10">
                <div className="flex justify-center">
                    <img
                        src={blog.featuredImage}
                        alt={blog.title}
                        className="h-96 max-w-3xl object-cover rounded-lg"
                    />
                </div>
                <div className="max-w-3xl mx-auto px-4 py-6">
                    <div
                        className="text-lg text-gray-700 prose"
                        dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(blog.content),
                        }}
                    />
                </div>
            </section>

            <div className="inset-x-0 top-1/2 h-px -translate-y-1/2 bg-transparent bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-75"></div>

            <section className="flex justify-between px-40 py-8 items-center">
                <div className="flex gap-5">
                    <img
                        src={blog.author.avatar}
                        alt="avatar"
                        className="h-20"
                    />
                    <Link to={`/profile/${blog.author.username}`}>
                        <div className="flex flex-col justify-center">
                            <p className="text-gray-700">Written by:</p>
                            <p className="text-xl font-semibold">
                                {blog.author.name}
                            </p>
                            <p className="text-sm">@{blog.author.username}</p>
                        </div>
                    </Link>
                </div>
                <div className="flex">
                    <p className="font-semibold">Share this blog:</p>
                    <div className="flex gap-5 pl-4">
                        <a
                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                                window.location.href
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Share on Facebook"
                        >
                            <Facebook
                                className="text-black bg-white rounded-full p-1 cursor-pointer hover:bg-gray-200"
                                size={25}
                            />
                        </a>
                        <a
                            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                                window.location.href
                            )}&text=${encodeURIComponent(blog.title)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Share on Twitter"
                        >
                            <Twitter
                                className="text-black bg-white rounded-full p-1 cursor-pointer hover:bg-gray-200"
                                size={25}
                            />
                        </a>
                        <a
                            href={`mailto:?subject=${encodeURIComponent(
                                blog.title
                            )}&body=Check out this blog: ${encodeURIComponent(
                                window.location.href
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Share via Email"
                        >
                            <Mail
                                className="text-black bg-white rounded-full p-1 cursor-pointer hover:bg-gray-200"
                                size={25}
                            />
                        </a>
                        <a
                            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                                window.location.href
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Share on LinkedIn"
                        >
                            <Linkedin
                                className="text-black bg-white rounded-full p-1 cursor-pointer hover:bg-gray-200"
                                size={25}
                            />
                        </a>
                    </div>
                </div>
            </section>

            <section>
                <span className="relative flex justify-center">
                    <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-transparent bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-75"></div>
                    <span className="relative z-10 bg-white px-6 text-xl font-semibold">
                        You May Also Like
                    </span>
                </span>

                {similarBlogs && similarBlogs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-32 py-10">
                        {similarBlogs.map((similarPost) => (
                            <Link
                                key={similarPost.id}
                                to={`/${similarPost.author.username}/${similarPost.id}`}
                            >
                                <div className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col h-full">
                                    <img
                                        src={similarPost.featuredImage}
                                        alt={similarPost.title}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-4 flex flex-col flex-grow">
                                        <div className="text-sm text-red-500 font-medium">
                                            {similarPost.category} •{' '}
                                            {similarPost.readTime ||
                                                'Read Time N/A'}
                                        </div>
                                        <h3 className="text-lg font-semibold mt-2 flex-grow">
                                            {similarPost.title}
                                        </h3>
                                        <p
                                            className="mt-4 text-gray-700 text-sm line-clamp-2"
                                            dangerouslySetInnerHTML={{
                                                __html: similarPost.content,
                                            }}
                                        />
                                        <div className="mt-4 flex items-center space-x-4 text-gray-500">
                                            <img
                                                src={similarPost.author.avatar}
                                                alt={similarPost.author.name}
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                            <div>
                                                <p className="font-medium text-sm">
                                                    {similarPost.author.name} •{' '}
                                                    {formatDate(
                                                        similarPost.Date
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-xl p-10">
                        No Similar Posts Available for this post
                    </div>
                )}
            </section>

            <Newsletter />
            <Footer />
        </div>
    );
}
