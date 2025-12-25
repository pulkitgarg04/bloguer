import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Shield } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';

export default function AdminLogin() {
    const { user, isAuthenticated, isCheckingAuth, login, isLoading } = useAuthStore();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (!isCheckingAuth && isAuthenticated && user) {
            // Check if user is admin
            const checkAdmin = async () => {
                try {
                    const token = localStorage.getItem('token');
                    await axios.get(
                        `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/dashboard`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    navigate('/admin/dashboard');
                } catch {
                    // Not admin, stay on login
                }
            };
            checkAdmin();
        }
    }, [isCheckingAuth, isAuthenticated, user, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            toast.error('Please fill out all fields.');
            return;
        }

        try {
            const loginSuccess = await login(formData.email, formData.password);
            if (loginSuccess) {
                // Verify admin access
                const token = localStorage.getItem('token');
                try {
                    await axios.get(
                        `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/dashboard`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    toast.success('Admin login successful!');
                    navigate('/admin/dashboard');
                } catch {
                    toast.error('You do not have admin access.');
                }
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error('An unexpected error occurred.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900 flex font-inter">
            <div className="flex-1 bg-gray-800 hidden lg:flex items-center justify-center">
                <div className="text-center text-white">
                    <Shield size={120} className="mx-auto mb-6 text-red-500" />
                    <h2 className="text-4xl font-bold mb-4">Admin Panel</h2>
                    <p className="text-gray-400 text-lg">Secure access for administrators only</p>
                </div>
            </div>

            <div className="flex flex-col justify-center items-center flex-1 px-4 py-8">
                <div className="text-4xl font-bold text-gray-800 flex mb-6 tracking-tight">
                    BLOG<span className="text-red-500">UER</span>
                </div>
                <div className="w-full max-w-md space-y-6">
                    <div className="text-center">
                        <div className="flex justify-center mb-4">
                            <div className="p-3 bg-red-100 rounded-full">
                                <Shield size={32} className="text-red-500" />
                            </div>
                        </div>
                        <h1 className="text-2xl xl:text-3xl font-bold">Admin Login</h1>
                        <p className="text-gray-600 mt-2">
                            Enter your credentials to access the admin panel
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-5">
                        <label
                            htmlFor="email"
                            className="relative block rounded-md border border-gray-200 shadow-sm"
                        >
                            <input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 h-11 px-4 w-full text-base"
                                placeholder="Email"
                            />
                            <span className="pointer-events-none absolute left-2.5 top-0 -translate-y-1/2 bg-gray-100 px-1 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                                Email
                            </span>
                        </label>

                        <label
                            htmlFor="password"
                            className="relative rounded-md border border-gray-200 shadow-sm flex items-center"
                        >
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 h-11 px-4 w-full text-base"
                                placeholder="Password"
                            />
                            <span className="pointer-events-none absolute left-2.5 top-0 -translate-y-1/2 bg-gray-100 px-1 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                                Password
                            </span>
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </label>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`h-11 rounded-lg flex gap-2 justify-center items-center w-full font-medium ${
                                isLoading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gray-800 text-white hover:bg-gray-700'
                            }`}
                        >
                            <Shield size={20} />
                            <p>{isLoading ? 'Authenticating...' : 'Access Admin Panel'}</p>
                        </button>
                    </form>

                    <div className="text-center">
                        <Link to="/" className="text-gray-600 hover:text-red-500 text-sm">
                            ← Back to Bloguer
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
