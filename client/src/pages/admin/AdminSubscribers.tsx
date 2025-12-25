import { useEffect, useState } from 'react';
import { Search, Trash2, Download } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';

interface Subscriber {
    id: string;
    email: string;
    createdAt: string;
}

export default function AdminSubscribers() {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchSubscribers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/subscribers`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSubscribers(res.data.subscribers);
        } catch {
            toast.error('Failed to load subscribers');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscribers();
    }, []);

    const handleDelete = async (id: string, email: string) => {
        if (!confirm(`Are you sure you want to remove ${email} from subscribers?`)) {
            return;
        }

        setDeletingId(id);
        try {
            const token = localStorage.getItem('token');
            await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/subscribers/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSubscribers((prev) => prev.filter((s) => s.id !== id));
            toast.success('Subscriber removed successfully');
        } catch {
            toast.error('Failed to remove subscriber');
        } finally {
            setDeletingId(null);
        }
    };

    const handleExport = () => {
        const csv = ['Email,Subscribed Date'];
        filteredSubscribers.forEach((s) => {
            csv.push(`${s.email},${new Date(s.createdAt).toLocaleDateString()}`);
        });
        const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'subscribers.csv';
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Subscribers exported');
    };

    const filteredSubscribers = subscribers.filter((s) =>
        s.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout title="Newsletter Subscribers">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="relative max-w-md w-full sm:w-auto">
                    <Search
                        size={20}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                        type="text"
                        placeholder="Search subscribers..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                </div>
                <button
                    onClick={handleExport}
                    disabled={subscribers.length === 0}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Download size={18} />
                    Export CSV
                </button>
            </div>

            {loading ? (
                <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-12 bg-gray-300 rounded"></div>
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
                                        Email
                                    </th>
                                    <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">
                                        Subscribed Date
                                    </th>
                                    <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredSubscribers.map((subscriber) => (
                                    <tr key={subscriber.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium">{subscriber.email}</td>
                                        <td className="px-4 py-3 text-center text-sm text-gray-500">
                                            {new Date(subscriber.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center">
                                                <button
                                                    onClick={() =>
                                                        handleDelete(subscriber.id, subscriber.email)
                                                    }
                                                    disabled={deletingId === subscriber.id}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                    title="Remove Subscriber"
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
                    {filteredSubscribers.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            No subscribers found
                        </div>
                    )}
                </div>
            )}

            <div className="mt-6 text-sm text-gray-500">
                Total subscribers: {subscribers.length}
            </div>
        </AdminLayout>
    );
}
