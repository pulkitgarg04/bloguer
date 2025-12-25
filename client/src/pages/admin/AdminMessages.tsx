import { useEffect, useState } from 'react';
import { Search, Trash2, Mail, Phone, Calendar } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';

interface Message {
    id: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    createdAt: string;
}

export default function AdminMessages() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/messages`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessages(res.data.messages);
        } catch {
            toast.error('Failed to load messages');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this message?')) {
            return;
        }

        setDeletingId(id);
        try {
            const token = localStorage.getItem('token');
            await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/messages/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessages((prev) => prev.filter((m) => m.id !== id));
            toast.success('Message deleted successfully');
        } catch {
            toast.error('Failed to delete message');
        } finally {
            setDeletingId(null);
        }
    };

    const filteredMessages = messages.filter(
        (m) =>
            m.name?.toLowerCase().includes(search.toLowerCase()) ||
            m.email?.toLowerCase().includes(search.toLowerCase()) ||
            m.message?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout title="Contact Messages">
            <div className="mb-6">
                <div className="relative max-w-md">
                    <Search
                        size={20}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                        type="text"
                        placeholder="Search messages..."
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
                            <div key={i} className="h-24 bg-gray-300 rounded"></div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredMessages.map((message) => (
                        <div
                            key={message.id}
                            className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                        >
                            <div
                                className="p-4 cursor-pointer hover:bg-gray-50"
                                onClick={() =>
                                    setExpandedId(expandedId === message.id ? null : message.id)
                                }
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <span className="font-semibold text-lg">{message.name}</span>
                                            <span className="text-sm text-gray-500 flex items-center gap-1">
                                                <Calendar size={14} />
                                                {new Date(message.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Mail size={14} />
                                                {message.email}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Phone size={14} />
                                                {message.phone}
                                            </span>
                                        </div>
                                        <p className="text-gray-700 mt-2 line-clamp-2">
                                            {message.message}
                                        </p>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(message.id);
                                        }}
                                        disabled={deletingId === message.id}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 flex-shrink-0"
                                        title="Delete Message"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            {expandedId === message.id && (
                                <div className="px-4 pb-4 pt-0 border-t border-gray-100">
                                    <div className="bg-gray-50 rounded-lg p-4 mt-4">
                                        <h4 className="font-medium text-gray-700 mb-2">Full Message:</h4>
                                        <p className="text-gray-600 whitespace-pre-wrap">
                                            {message.message}
                                        </p>
                                    </div>
                                    <div className="flex gap-3 mt-4">
                                        <a
                                            href={`mailto:${message.email}`}
                                            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                                        >
                                            <Mail size={16} />
                                            Reply via Email
                                        </a>
                                        <a
                                            href={`tel:${message.phone}`}
                                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                        >
                                            <Phone size={16} />
                                            Call
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    {filteredMessages.length === 0 && (
                        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
                            No messages found
                        </div>
                    )}
                </div>
            )}

            <div className="mt-6 text-sm text-gray-500">
                Total messages: {messages.length}
            </div>
        </AdminLayout>
    );
}
