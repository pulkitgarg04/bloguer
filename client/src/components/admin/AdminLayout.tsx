import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    FileText,
    MessageSquare,
    Mail,
    Newspaper,
    LogOut,
    Menu,
    X,
    Shield,
} from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';

interface AdminLayoutProps {
    children: React.ReactNode;
    title: string;
}

const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/users', label: 'Users', icon: Users },
    { path: '/admin/posts', label: 'Posts', icon: FileText },
    { path: '/admin/comments', label: 'Comments', icon: MessageSquare },
    { path: '/admin/subscribers', label: 'Subscribers', icon: Newspaper },
    { path: '/admin/messages', label: 'Messages', icon: Mail },
];

export default function AdminLayout({ children, title }: AdminLayoutProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout, isCheckingAuth, isAuthenticated } = useAuthStore();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAdminAccess = async () => {
            if (isCheckingAuth) return;

            if (!isAuthenticated) {
                navigate('/admin');
                return;
            }

            try {
                const token = localStorage.getItem('token');
                await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/dashboard`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setIsAdmin(true);
            } catch {
                setIsAdmin(false);
                navigate('/admin');
            }
        };

        checkAdminAccess();
    }, [isCheckingAuth, isAuthenticated, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/admin');
    };

    if (isCheckingAuth || isAdmin === null) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            </div>
        );
    }

    if (!isAdmin) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-100 font-inter">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-50 h-full w-64 bg-gray-900 text-white transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex items-center justify-between p-4 border-b border-gray-800">
                    <Link to="/admin/dashboard" className="flex items-center gap-2">
                        <Shield size={24} className="text-red-500" />
                        <span className="text-xl font-bold">
                            BLOG<span className="text-red-500">UER</span>
                        </span>
                    </Link>
                    <button
                        className="lg:hidden text-gray-400 hover:text-white"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X size={24} />
                    </button>
                </div>

                <nav className="p-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                    isActive
                                        ? 'bg-red-500 text-white'
                                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                }`}
                            >
                                <Icon size={20} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
                    <div className="flex items-center gap-3 mb-4">
                        <img
                            src={
                                user?.avatar ||
                                `https://ui-avatars.com/api/?background=random&name=${encodeURIComponent(user?.name || 'Admin')}&size=128`
                            }
                            alt="Avatar"
                            className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{user?.name}</p>
                            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className="lg:ml-64">
                {/* Top bar */}
                <header className="bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden text-gray-600 hover:text-gray-900"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu size={24} />
                        </button>
                        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
                    </div>
                    <Link
                        to="/"
                        className="text-sm text-gray-600 hover:text-red-500 transition-colors"
                    >
                        View Site →
                    </Link>
                </header>

                {/* Page content */}
                <main className="p-4 md:p-6">{children}</main>
            </div>
        </div>
    );
}
