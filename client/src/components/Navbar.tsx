import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { LogIn, Menu, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Navbar({ activeTab }: { activeTab: string }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const { isAuthenticated, user, logout, isLoading } = useAuthStore();

    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen((prev) => !prev);
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

    // Close mobile menu when route changes
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [activeTab]);

    const navLinks = [
        { to: '/', label: 'Home', tab: 'Home' },
        { to: '/blogs', label: 'For You', tab: 'Blogs' },
        { to: '/about', label: 'About Us', tab: 'About Us' },
        { to: '/contact', label: 'Contact Us', tab: 'Contact Us' },
    ];

    return (
        <nav className="flex justify-between items-center py-4 px-4 md:px-10 border-b-2 bg-white relative">
            <Link to="/">
                <div className="text-xl md:text-2xl font-bold text-gray-800">
                    BLOG<span className="text-red-500">UER</span>
                </div>
            </Link>

            {/* Desktop Navigation */}
            <ul className="hidden md:flex gap-8">
                {navLinks.map((link) => (
                    <Link key={link.tab} to={link.to}>
                        <li
                            className={`text-lg font-medium cursor-pointer ${
                                activeTab === link.tab
                                    ? 'text-red-500 border-b-4 border-red-500'
                                    : 'text-gray-700 hover:text-red-500'
                            }`}
                        >
                            {link.label}
                        </li>
                    </Link>
                ))}
            </ul>

            {/* Desktop Auth Section */}
            <div className="hidden md:flex items-center">
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
                                    `https://ui-avatars.com/api/?background=random&name=${encodeURIComponent(user.name)}&size=128`
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

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-3">
                {isAuthenticated && user && (
                    <div className="relative" ref={menuRef}>
                        <div
                            className="inline-flex items-center overflow-hidden rounded-full border bg-gray-200 cursor-pointer"
                            onClick={toggleMenu}
                        >
                            <img
                                src={
                                    user.avatar ||
                                    `https://ui-avatars.com/api/?background=random&name=${encodeURIComponent(user.name)}&size=128`
                                }
                                className="h-8 w-8"
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
                )}
                <button
                    onClick={toggleMobileMenu}
                    className="p-2 text-gray-700 hover:text-red-500"
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="absolute top-full left-0 right-0 bg-white border-b-2 shadow-lg z-50 md:hidden">
                    <ul className="flex flex-col py-4">
                        {navLinks.map((link) => (
                            <Link key={link.tab} to={link.to} onClick={() => setMobileMenuOpen(false)}>
                                <li
                                    className={`px-6 py-3 text-lg font-medium cursor-pointer ${
                                        activeTab === link.tab
                                            ? 'text-red-500 bg-red-50'
                                            : 'text-gray-700 hover:text-red-500 hover:bg-gray-50'
                                    }`}
                                >
                                    {link.label}
                                </li>
                            </Link>
                        ))}
                        {!isAuthenticated && (
                            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                                <li className="px-6 py-3 text-lg font-medium text-gray-700 hover:text-red-500 hover:bg-gray-50 flex items-center gap-2">
                                    <LogIn size={18} />
                                    Login
                                </li>
                            </Link>
                        )}
                    </ul>
                </div>
            )}
        </nav>
    );
}
