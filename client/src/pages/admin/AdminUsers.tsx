import { useEffect, useState } from 'react';
import { Search, Trash2, Shield, ShieldOff } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';

interface User {
    id: string;
    email: string;
    name: string;
    username: string;
    avatar: string;
    isAdmin: boolean;
    JoinedDate: string;
    emailVerifiedAt: string | null;
    provider: string;
    _count: {
        posts: number;
        comments: number;
        followers: number;
        following: number;
    };
}

export default function AdminUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/users`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUsers(res.data.users);
        } catch {
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete user "${name}"? This will also delete all their posts and comments.`)) {
            return;
        }

        setDeletingId(id);
        try {
            const token = localStorage.getItem('token');
            await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/users/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUsers((prev) => prev.filter((u) => u.id !== id));
            toast.success('User deleted successfully');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to delete user');
        } finally {
            setDeletingId(null);
        }
    };

    const handleToggleAdmin = async (id: string, currentStatus: boolean) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/users/${id}/admin`,
                { isAdmin: !currentStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUsers((prev) =>
                prev.map((u) => (u.id === id ? { ...u, isAdmin: !currentStatus } : u))
            );
            toast.success(`Admin status ${!currentStatus ? 'granted' : 'revoked'}`);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update admin status');
        }
    };

    const filteredUsers = users.filter(
        (u) =>
            u.name?.toLowerCase().includes(search.toLowerCase()) ||
            u.email?.toLowerCase().includes(search.toLowerCase()) ||
            u.username?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout title="Users">
            <div className="mb-6">
                <div className="relative max-w-md">
                    <Search
                        size={20}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                        type="text"
                        placeholder="Search users..."
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
                            <div key={i} className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                                    <div className="h-3 bg-gray-300 rounded w-1/3"></div>
                                </div>
                            </div>
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
                                        User
                                    </th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                                        Email
                                    </th>
                                    <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">
                                        Posts
                                    </th>
                                    <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">
                                        Followers
                                    </th>
                                    <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">
                                        Status
                                    </th>
                                    <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">
                                        Joined
                                    </th>
                                    <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}`}
                                                    alt={user.name}
                                                    className="w-10 h-10 rounded-full"
                                                />
                                                <div>
                                                    <p className="font-medium flex items-center gap-2">
                                                        {user.name}
                                                        {user.isAdmin && (
                                                            <span className="px-2 py-0.5 text-xs bg-red-100 text-red-600 rounded-full">
                                                                Admin
                                                            </span>
                                                        )}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        @{user.username}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm">{user.email}</td>
                                        <td className="px-4 py-3 text-center text-sm">
                                            {user._count.posts}
                                        </td>
                                        <td className="px-4 py-3 text-center text-sm">
                                            {user._count.followers}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span
                                                className={`px-2 py-1 text-xs rounded-full ${
                                                    user.emailVerifiedAt
                                                        ? 'bg-green-100 text-green-600'
                                                        : 'bg-yellow-100 text-yellow-600'
                                                }`}
                                            >
                                                {user.emailVerifiedAt ? 'Verified' : 'Unverified'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center text-sm text-gray-500">
                                            {new Date(user.JoinedDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleToggleAdmin(user.id, user.isAdmin)}
                                                    className={`p-2 rounded-lg transition-colors ${
                                                        user.isAdmin
                                                            ? 'text-yellow-600 hover:bg-yellow-50'
                                                            : 'text-blue-600 hover:bg-blue-50'
                                                    }`}
                                                    title={user.isAdmin ? 'Revoke Admin' : 'Make Admin'}
                                                >
                                                    {user.isAdmin ? (
                                                        <ShieldOff size={18} />
                                                    ) : (
                                                        <Shield size={18} />
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.id, user.name)}
                                                    disabled={deletingId === user.id}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                    title="Delete User"
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
                    {filteredUsers.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            No users found
                        </div>
                    )}
                </div>
            )}
        </AdminLayout>
    );
}
