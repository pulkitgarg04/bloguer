import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Navbar({ activeTab }: { activeTab: string }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const { isAuthenticated, user, logout, isLoading } = useAuthStore();

    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav className="flex justify-between items-center py-5 px-10 border-b-2 bg-white">
            <Link to="/">
                <div className="text-2xl font-bold text-gray-800">
                    BLOG<span className="text-red-500">UER</span>
                </div>
            </Link>

            <ul className="flex gap-8">
                <Link to={'/'}>
                    <li
                        className={`text-lg font-medium cursor-pointer ${
                            activeTab === 'Home'
                                ? 'text-red-500 border-b-4 border-red-500'
                                : 'text-gray-700 hover:text-red-500'
                        }`}
                    >
                        Home
                    </li>
                </Link>
                <Link to={'/blogs'}>
                    <li
                        className={`text-lg font-medium cursor-pointer ${
                            activeTab === 'Blogs'
                                ? 'text-red-500 border-b-4 border-red-500'
                                : 'text-gray-700 hover:text-red-500'
                        }`}
                    >
                        For You
                    </li>
                </Link>
                <Link to={'/about'}>
                    <li
                        className={`text-lg font-medium cursor-pointer ${
                            activeTab === 'About Us'
                                ? 'text-red-500 border-b-4 border-red-500'
                                : 'text-gray-700 hover:text-red-500'
                        }`}
                    >
                        About Us
                    </li>
                </Link>
                <Link to={'/contact'}>
                    <li
                        className={`text-lg font-medium cursor-pointer ${
                            activeTab === 'Contact Us'
                                ? 'text-red-500 border-b-4 border-red-500'
                                : 'text-gray-700 hover:text-red-500'
                        }`}
                    >
                        Contact Us
                    </li>
                </Link>
            </ul>

            <div className="flex items-center">
                {isLoading ? (
                    <div className="h-10 w-10 bg-gray-300 rounded-full animate-pulse" />
                ) : isAuthenticated && user ? (
                    <div className="relative" ref={menuRef}>
                        <div
                            className="inline-flex items-center overflow-hidden rounded-full border bg-gray-200 cursor-pointer"
                            onClick={toggleMenu}
                        >
                            <img
                                src={
                                    user.avatar ||
                                    'https://avatar.iran.liara.run/public/44'
                                }
                                className="h-10 w-10"
                                alt="Avatar"
                            />
                        </div>

                        {menuOpen && (
                            <div
                                className="absolute right-0 z-10 w-52 rounded-md border border-gray-100 bg-white shadow-lg"
                                role="menu"
                            >
                                <div className="p-2">
                                    <Link to="/bookmarked">
                                        <div className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700">
                                            Bookmarked Articles
                                        </div>
                                    </Link>

                                    <Link to="/write">
                                        <div className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700">
                                            Write Article
                                        </div>
                                    </Link>

                                    <Link to="/analytics">
                                        <div className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700">
                                            Analytics
                                        </div>
                                    </Link>

                                    <Link to={`/profile/${user.username}`}>
                                        <div className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700">
                                            My Profile
                                        </div>
                                    </Link>

                                    <button
                                        className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                                        role="menuitem"
                                        onClick={() => logout()}
                                    >
                                        <LogIn size={15} />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link to="/login">
                        <button className="flex items-center gap-3 px-4 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800">
                            <LogIn size={18} />
                            Login
                        </button>
                    </Link>
                )}
            </div>
        </nav>
    );
}
