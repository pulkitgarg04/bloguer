import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';
import CommentCard from '../components/CommentCard';
import CommentForm from '../components/CommentForm';
import { useAuthStore } from '../store/authStore';
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
import { getVisitorId } from '../utils/visitor';

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

interface Comment {
    id: string;
    content: string;
    author: {
        id?: string;
        name: string;
        username?: string;
        avatar?: string;
    };
    createdAt: string;
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
    const [comments, setComments] = useState<Comment[]>([]);
    const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
    const { user } = useAuthStore();

    useEffect(() => {
        const fetchBlogData = async () => {
            try {
                const vid = getVisitorId();
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/${postId}`,
                    { headers: { 'x-visitor-id': vid } }
                );
                const data = await response.data;
                setBlog(data.post);
                setSimilarBlogs(data.similarPosts);
                try {
                    const resp = await axios.get(
                        `${import.meta.env.VITE_BACKEND_URL}/api/v1/comment/post/${postId}`
                    );
                    setComments(resp.data.comments || []);
                } catch (err) {
                    console.error('Failed to fetch comments', err);
                }
            } catch (error) {
                toast.error(`Error fetching blog data: ${error}`);
            }
        };

        fetchBlogData();
    }, [postId]);

    useEffect(() => {
        const start = Date.now();
        let maxScroll = 0;
        const onScroll = () => {
            const scrolled = window.scrollY + window.innerHeight;
            const total = document.documentElement.scrollHeight;
            const depth = Math.min(100, Math.round((scrolled / total) * 100));
            if (depth > maxScroll) maxScroll = depth;
        };
        window.addEventListener('scroll', onScroll);
        const send = () => {
            const durationSec = Math.round((Date.now() - start) / 1000);
            const vid = getVisitorId();
            if (!postId) return;
            axios
                .post(
                    `${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/analytics/engagement`,
                    {
                        postId,
                        visitorId: vid,
                        durationSec,
                        scrollDepth: maxScroll,
                    }
                )
                .catch(() => {
                    /* ignore */
                });
        };
        const onHide = () => {
            send();
        };
        document.addEventListener('visibilitychange', onHide);
        return () => {
            window.removeEventListener('scroll', onScroll);
            document.removeEventListener('visibilitychange', onHide);
            send();
        };
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
                const token = localStorage.getItem('token');
                const response = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/bookmark`,
                    { postId },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setIsBookmarked((prev) => !prev);
                const msg = response.data.bookmarked ? 'Bookmarked' : 'Removed from bookmarks';
                toast.success(msg);
            } catch (error) {
                toast.error('Failed to toggle bookmark');
                console.error(error);
            }
        } else {
            toast.error('You need to be login to bookmark this article.');
        }
    };

    const handleAddComment = async (content: string) => {
        if (!user) {
            toast.error('You need to be logged in to comment.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const resp = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/comment`,
                { postId, content },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const created = resp.data.comment;
            setComments((prev) => [created, ...prev]);
            toast.success('Comment added');
        } catch (err) {
            console.error('Failed to add comment', err);
            toast.error('Failed to add comment');
        }
    };

    const handleEditComment = async (id: string, content: string) => {
        if (!user) return;

        try {
            const token = localStorage.getItem('token');
            const resp = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/comment/${id}`,
                { content },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const updated = resp.data.comment;
            setComments((prev) =>
                prev.map((c) =>
                    c.id === updated.id ? { ...c, content: updated.content } : c
                )
            );
            toast.success('Comment updated');
        } catch (err) {
            console.error('Failed to update comment', err);
            toast.error('Failed to update comment');
        }
    };

    const handleDeleteComment = async (id: string) => {
        if (!user) {
            toast.error('You need to be logged in.');
            return;
        }

        const confirmDelete = window.confirm(
            'Delete this comment? This cannot be undone.'
        );

        if (!confirmDelete) return;

        try {
            setIsDeletingId(id);
            const token = localStorage.getItem('token');
            await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/comment/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setComments((prev) => prev.filter((c) => c.id !== id));
            toast.success('Comment deleted');
        } catch (err) {
            console.error('Failed to delete comment', err);
            toast.error('Failed to delete comment');
        } finally {
            setIsDeletingId(null);
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
                            src={blog.author.avatar || `https://ui-avatars.com/api/?background=random&name=${encodeURIComponent(blog.author.name)}&size=128`}
                            alt={blog.author.name}
                            className="h-10 w-10 rounded-3xl"
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

            <section className="px-4 py-8">
                <div className="max-w-3xl mx-auto flex justify-between items-center">
                    <Link to={`/profile/${blog.author.username}`}>
                        <div className="flex gap-5 items-center">
                            <img
                                src={blog.author.avatar || `https://ui-avatars.com/api/?background=random&name=${encodeURIComponent(blog.author.name)}&size=128`}
                                alt="avatar"
                                className="h-16 w-16 rounded-full object-cover"
                            />
                            <div className="flex flex-col justify-center">
                                <p className="text-gray-700">Written by:</p>
                                <p className="text-xl font-semibold">
                                    {blog.author.name}
                                </p>
                                <p className="text-sm">
                                    @{blog.author.username}
                                </p>
                            </div>
                        </div>
                    </Link>

                    <div className="flex items-center">
                        <p className="font-semibold mr-4">Share this blog:</p>
                        <div className="flex gap-4">
                            <a
                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                                    window.location.href
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Share on Facebook"
                                onClick={() => {
                                    axios
                                        .post(
                                            `${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/analytics/share`,
                                            { postId, platform: 'facebook' }
                                        )
                                        .catch(() => {});
                                }}
                            >
                                <Facebook
                                    className="text-black bg-white rounded-full p-1 cursor-pointer hover:bg-gray-200"
                                    size={26}
                                />
                            </a>
                            <a
                                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                                    window.location.href
                                )}&text=${encodeURIComponent(blog.title)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Share on Twitter"
                                onClick={() => {
                                    axios
                                        .post(
                                            `${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/analytics/share`,
                                            { postId, platform: 'twitter' }
                                        )
                                        .catch(() => {});
                                }}
                            >
                                <Twitter
                                    className="text-black bg-white rounded-full p-1 cursor-pointer hover:bg-gray-200"
                                    size={26}
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
                                onClick={() => {
                                    axios
                                        .post(
                                            `${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/analytics/share`,
                                            { postId, platform: 'email' }
                                        )
                                        .catch(() => {});
                                }}
                            >
                                <Mail
                                    className="text-black bg-white rounded-full p-1 cursor-pointer hover:bg-gray-200"
                                    size={26}
                                />
                            </a>
                            <a
                                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                                    window.location.href
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Share on LinkedIn"
                                onClick={() => {
                                    axios
                                        .post(
                                            `${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/analytics/share`,
                                            { postId, platform: 'linkedin' }
                                        )
                                        .catch(() => {});
                                }}
                            >
                                <Linkedin
                                    className="text-black bg-white rounded-full p-1 cursor-pointer hover:bg-gray-200"
                                    size={26}
                                />
                            </a>
                        </div>
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
                                                src={similarPost.author.avatar || `https://ui-avatars.com/api/?background=random&name=${encodeURIComponent(similarPost.author.name)}&size=128`}
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

            <section className="max-w-3xl mx-auto px-4 py-6">
                <h3 className="text-xl font-semibold mb-4">Comments</h3>

                <CommentForm user={user} onSubmit={handleAddComment} />

                <div className="space-y-4">
                    {comments.length === 0 ? (
                        <div className="text-gray-500">
                            No comments yet. Be the first to comment!
                        </div>
                    ) : (
                        comments.map((c) => {
                            const isOwner =
                                user && c.author.id && user.id === c.author.id;
                            const isPostAuthor = !!(
                                user &&
                                blog &&
                                user.username === blog.author.username
                            );

                            return (
                                <CommentCard
                                    key={c.id}
                                    id={c.id}
                                    content={c.content}
                                    author={c.author}
                                    createdAt={c.createdAt}
                                    isOwner={!!isOwner}
                                    isPostAuthor={isPostAuthor}
                                    onEdit={handleEditComment}
                                    onDelete={handleDeleteComment}
                                    isDeleting={isDeletingId === c.id}
                                />
                            );
                        })
                    )}
                </div>
            </section>

            <Newsletter />
            <Footer />
        </div>
    );
}
