import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Trash2, Eye, EyeOff, ExternalLink } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';

interface Post {
    id: string;
    title: string;
    category: string;
    published: boolean;
    views: number;
    Date: string;
    author: {
        id: string;
        name: string;
        username: string;
        avatar: string;
    };
    _count: {
        comments: number;
        bookmarks: number;
    };
}

export default function AdminPosts() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchPosts = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/posts`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setPosts(res.data.posts);
        } catch {
            toast.error('Failed to load posts');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Are you sure you want to delete "${title}"?`)) {
            return;
        }

        setDeletingId(id);
        try {
            const token = localStorage.getItem('token');
            await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/posts/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setPosts((prev) => prev.filter((p) => p.id !== id));
            toast.success('Post deleted successfully');
        } catch {
            toast.error('Failed to delete post');
        } finally {
            setDeletingId(null);
        }
    };

    const handleTogglePublished = async (id: string, currentStatus: boolean) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/posts/${id}/published`,
                { published: !currentStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setPosts((prev) =>
                prev.map((p) => (p.id === id ? { ...p, published: !currentStatus } : p))
            );
            toast.success(`Post ${!currentStatus ? 'published' : 'unpublished'}`);
        } catch {
            toast.error('Failed to update post');
        }
    };

    const filteredPosts = posts.filter(
        (p) =>
            p.title?.toLowerCase().includes(search.toLowerCase()) ||
            p.author.name?.toLowerCase().includes(search.toLowerCase()) ||
            p.category?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout title="Posts">
            <div className="mb-6">
                <div className="relative max-w-md">
                    <Search
                        size={20}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                        type="text"
                        placeholder="Search posts..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                </div>
            </div>

            {loading ? (
                <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-16 bg-gray-300 rounded"></div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                                        Post
                                    </th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                                        Author
                                    </th>
                                    <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">
                                        Category
                                    </th>
                                    <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">
                                        Views
                                    </th>
                                    <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">
                                        Comments
                                    </th>
                                    <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">
                                        Status
                                    </th>
                                    <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">
                                        Date
                                    </th>
                                    <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredPosts.map((post) => (
                                    <tr key={post.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <p className="font-medium truncate max-w-xs">
                                                {post.title}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <img
                                                    src={post.author.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.name)}`}
                                                    alt={post.author.name}
                                                    className="w-8 h-8 rounded-full"
                                                />
                                                <span className="text-sm">{post.author.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="px-2 py-1 text-xs bg-gray-100 rounded-full">
                                                {post.category}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center text-sm">
                                            {post.views.toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3 text-center text-sm">
                                            {post._count.comments}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span
                                                className={`px-2 py-1 text-xs rounded-full ${
                                                    post.published
                                                        ? 'bg-green-100 text-green-600'
                                                        : 'bg-gray-100 text-gray-600'
                                                }`}
                                            >
                                                {post.published ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center text-sm text-gray-500">
                                            {new Date(post.Date).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-2">
                                                <Link
                                                    to={`/${post.author.username}/${post.id}`}
                                                    target="_blank"
                                                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                                    title="View Post"
                                                >
                                                    <ExternalLink size={18} />
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        handleTogglePublished(post.id, post.published)
                                                    }
                                                    className={`p-2 rounded-lg transition-colors ${
                                                        post.published
                                                            ? 'text-yellow-600 hover:bg-yellow-50'
                                                            : 'text-green-600 hover:bg-green-50'
                                                    }`}
                                                    title={post.published ? 'Unpublish' : 'Publish'}
                                                >
                                                    {post.published ? (
                                                        <EyeOff size={18} />
                                                    ) : (
                                                        <Eye size={18} />
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(post.id, post.title)}
                                                    disabled={deletingId === post.id}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                    title="Delete Post"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredPosts.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            No posts found
                        </div>
                    )}
                </div>
            )}
        </AdminLayout>
    );
}
