import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Trash2, ExternalLink } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';

interface Comment {
    id: string;
    content: string;
    createdAt: string;
    author: {
        id: string;
        name: string;
        username: string;
        avatar: string;
    };
    post: {
        id: string;
        title: string;
    };
}

export default function AdminComments() {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchComments = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/comments`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setComments(res.data.comments);
        } catch {
            toast.error('Failed to load comments');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this comment?')) {
            return;
        }

        setDeletingId(id);
        try {
            const token = localStorage.getItem('token');
            await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/comments/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setComments((prev) => prev.filter((c) => c.id !== id));
            toast.success('Comment deleted successfully');
        } catch {
            toast.error('Failed to delete comment');
        } finally {
            setDeletingId(null);
        }
    };

    const filteredComments = comments.filter(
        (c) =>
            c.content?.toLowerCase().includes(search.toLowerCase()) ||
            c.author.name?.toLowerCase().includes(search.toLowerCase()) ||
            c.post.title?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout title="Comments">
            <div className="mb-6">
                <div className="relative max-w-md">
                    <Search
                        size={20}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                        type="text"
                        placeholder="Search comments..."
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
                            <div
                                key={i}
                                className="h-20 bg-gray-300 rounded"
                            ></div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredComments.map((comment) => (
                        <div
                            key={comment.id}
                            className="bg-white rounded-lg border border-gray-200 p-4"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3 flex-1">
                                    <img
                                        src={
                                            comment.author.avatar ||
                                            `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author.name)}`
                                        }
                                        alt={comment.author.name}
                                        className="w-10 h-10 rounded-full flex-shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-medium">
                                                {comment.author.name}
                                            </span>
                                            <span className="text-gray-400">
                                                •
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                @{comment.author.username}
                                            </span>
                                            <span className="text-gray-400">
                                                •
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {new Date(
                                                    comment.createdAt
                                                ).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-gray-700 mt-1">
                                            {comment.content}
                                        </p>
                                        <div className="mt-2 flex items-center gap-2">
                                            <span className="text-sm text-gray-500">
                                                on
                                            </span>
                                            <Link
                                                to={`/${comment.author.username}/${comment.post.id}`}
                                                target="_blank"
                                                className="text-sm text-red-500 hover:underline flex items-center gap-1"
                                            >
                                                {comment.post.title}
                                                <ExternalLink size={14} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(comment.id)}
                                    disabled={deletingId === comment.id}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 flex-shrink-0"
                                    title="Delete Comment"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {filteredComments.length === 0 && (
                        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
                            No comments found
                        </div>
                    )}
                </div>
            )}
        </AdminLayout>
    );
}
