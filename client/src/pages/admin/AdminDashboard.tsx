import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Users,
    FileText,
    MessageSquare,
    Eye,
    Mail,
    Newspaper,
    TrendingUp,
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';

interface DashboardStats {
    usersCount: number;
    postsCount: number;
    commentsCount: number;
    subscribersCount: number;
    messagesCount: number;
    totalViews: number;
    recentUsers: Array<{
        id: string;
        name: string;
        username: string;
        avatar: string;
        JoinedDate: string;
    }>;
    recentPosts: Array<{
        id: string;
        title: string;
        Date: string;
        author: { name: string; username: string };
    }>;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/dashboard`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setStats(res.data);
            } catch {
                toast.error('Failed to load dashboard');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = stats
        ? [
              {
                  label: 'Total Users',
                  value: stats.usersCount,
                  icon: Users,
                  color: 'bg-blue-500',
                  link: '/admin/users',
              },
              {
                  label: 'Total Posts',
                  value: stats.postsCount,
                  icon: FileText,
                  color: 'bg-green-500',
                  link: '/admin/posts',
              },
              {
                  label: 'Total Comments',
                  value: stats.commentsCount,
                  icon: MessageSquare,
                  color: 'bg-yellow-500',
                  link: '/admin/comments',
              },
              {
                  label: 'Total Views',
                  value: stats.totalViews,
                  icon: Eye,
                  color: 'bg-purple-500',
                  link: '/admin/posts',
              },
              {
                  label: 'Subscribers',
                  value: stats.subscribersCount,
                  icon: Newspaper,
                  color: 'bg-pink-500',
                  link: '/admin/subscribers',
              },
              {
                  label: 'Messages',
                  value: stats.messagesCount,
                  icon: Mail,
                  color: 'bg-red-500',
                  link: '/admin/messages',
              },
          ]
        : [];

    return (
        <AdminLayout title="Dashboard">
            {loading ? (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-lg p-6 animate-pulse"
                            >
                                <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                                <div className="h-8 bg-gray-300 rounded w-1/3"></div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                        {statCards.map((card) => {
                            const Icon = card.icon;
                            return (
                                <Link
                                    key={card.label}
                                    to={card.link}
                                    className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-500">{card.label}</p>
                                            <p className="text-3xl font-bold mt-1">
                                                {card.value.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className={`p-3 rounded-full ${card.color}`}>
                                            <Icon size={24} className="text-white" />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <TrendingUp size={20} className="text-blue-500" />
                                    Recent Users
                                </h3>
                                <Link
                                    to="/admin/users"
                                    className="text-sm text-red-500 hover:underline"
                                >
                                    View All
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {stats?.recentUsers.map((user) => (
                                    <div
                                        key={user.id}
                                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                                    >
                                        <img
                                            src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}`}
                                            alt={user.name}
                                            className="w-10 h-10 rounded-full"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">{user.name}</p>
                                            <p className="text-sm text-gray-500 truncate">
                                                @{user.username}
                                            </p>
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            {new Date(user.JoinedDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                ))}
                                {(!stats?.recentUsers || stats.recentUsers.length === 0) && (
                                    <p className="text-gray-500 text-center py-4">No recent users</p>
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <FileText size={20} className="text-green-500" />
                                    Recent Posts
                                </h3>
                                <Link
                                    to="/admin/posts"
                                    className="text-sm text-red-500 hover:underline"
                                >
                                    View All
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {stats?.recentPosts.map((post) => (
                                    <div
                                        key={post.id}
                                        className="p-3 bg-gray-50 rounded-lg"
                                    >
                                        <p className="font-medium truncate">{post.title}</p>
                                        <div className="flex items-center justify-between mt-1">
                                            <p className="text-sm text-gray-500">
                                                by {post.author.name}
                                            </p>
                                            <span className="text-xs text-gray-400">
                                                {new Date(post.Date).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {(!stats?.recentPosts || stats.recentPosts.length === 0) && (
                                    <p className="text-gray-500 text-center py-4">No recent posts</p>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </AdminLayout>
    );
}
