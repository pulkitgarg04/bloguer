import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { LogIn, Menu, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { motion } from 'framer-motion';

export default function Navbar({ activeTab }: { activeTab: string }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const menuRef = useRef<HTMLDivElement>(null);
    const mobileRef = useRef<HTMLDivElement>(null);

    const { isAuthenticated, user, logout, isLoading } = useAuthStore();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setMenuOpen(false);
            }

            if (
                mobileRef.current &&
                !mobileRef.current.contains(event.target as Node)
            ) {
                setMobileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const NavItem = ({
        to,
        label,
        tab,
        onClick,
    }: {
        to: string;
        label: string;
        tab: string;
        onClick?: () => void;
    }) => (
        <Link to={to} onClick={onClick}>
            <motion.li
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`text-lg font-medium cursor-pointer px-2 py-1 ${
                    activeTab === tab
                        ? 'text-red-500 border-b-2 border-red-500'
                        : 'text-gray-700 hover:text-red-500'
                }`}
            >
                {label}
            </motion.li>
        </Link>
    );

    return (
        <nav className="sticky top-0 z-50 bg-white border-b">
            <div className="flex items-center justify-between px-6 py-4">
                <Link to="/">
                    <div className="text-2xl font-bold text-gray-800">
                        BLOG<span className="text-red-500">UER</span>
                    </div>
                </Link>

                <ul className="hidden md:flex gap-8">
                    <NavItem to="/" label="Home" tab="Home" />
                    <NavItem to="/blogs" label="For You" tab="Blogs" />
                    <NavItem to="/about" label="About Us" tab="About Us" />
                    <NavItem to="/contact" label="Contact Us" tab="Contact Us" />
                </ul>

                <div className="flex items-center gap-4">
                    {isLoading ? (
                        <div className="h-10 w-10 bg-gray-300 rounded-full animate-pulse" />
                    ) : isAuthenticated && user ? (
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setMenuOpen((p) => !p)}
                                className="rounded-full overflow-hidden border bg-gray-200"
                            >
                                <img
                                    src={
                                        user.avatar ||
                                        `https://ui-avatars.com/api/?background=random&name=${encodeURIComponent(
                                            user.name
                                        )}&size=128`
                                    }
                                    alt="Avatar"
                                    className="h-10 w-10"
                                />
                            </button>

                            {menuOpen && (
                                <div className="absolute right-0 mt-2 w-52 rounded-md border bg-white shadow-lg z-50">
                                    <Link
                                        to="/bookmarked"
                                        onClick={() => setMenuOpen(false)}
                                        className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                                    >
                                        Bookmarked Articles
                                    </Link>
                                    <Link
                                        to="/write"
                                        onClick={() => setMenuOpen(false)}
                                        className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                                    >
                                        Write Article
                                    </Link>
                                    <Link
                                        to="/analytics"
                                        onClick={() => setMenuOpen(false)}
                                        className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                                    >
                                        Analytics
                                    </Link>
                                    <Link
                                        to={`/profile/${user.username}`}
                                        onClick={() => setMenuOpen(false)}
                                        className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                                    >
                                        My Profile
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setMenuOpen(false);
                                            logout();
                                        }}
                                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        <LogIn size={16} />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login">
                            <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800">
                                <LogIn size={18} />
                                Login
                            </button>
                        </Link>
                    )}

                    <button
                        className="md:hidden"
                        onClick={() => setMobileOpen((p) => !p)}
                    >
                        {mobileOpen ? <X size={26} /> : <Menu size={26} />}
                    </button>
                </div>
            </div>

            {mobileOpen && (
                <motion.div
                    ref={mobileRef}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="md:hidden border-t bg-white px-6 py-4 space-y-4 overflow-hidden"
                >
                    <NavItem to="/" label="Home" tab="Home" onClick={() => setMobileOpen(false)} />
                    <NavItem to="/blogs" label="For You" tab="Blogs" onClick={() => setMobileOpen(false)} />
                    <NavItem to="/about" label="About Us" tab="About Us" onClick={() => setMobileOpen(false)} />
                    <NavItem to="/contact" label="Contact Us" tab="Contact Us" onClick={() => setMobileOpen(false)} />

                    {!isAuthenticated && (
                        <Link to="/login" onClick={() => setMobileOpen(false)}>
                            <button className="flex w-full items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg">
                                <LogIn size={18} />
                                Login
                            </button>
                        </Link>
                    )}
                </motion.div>
            )}
        </nav>
    );
}
