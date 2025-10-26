import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

export default function Login() {
    const { login, isLoading, checkAuth } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState<{
        email: string;
        password: string;
    }>({ email: '', password: '' });

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;

        setFormData((prevData) => ({ ...prevData, [id]: value }));
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const handleGoogleClick = () => {
        const redirect = window.location.origin;

        window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/google?redirect=${encodeURIComponent(redirect)}`;
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
                toast.dismiss();
                toast.success('Login Successful!');

                setTimeout(() => {
                    navigate('/');
                }, 1000);
            }
        } catch (error: unknown) {
            // The authStore already extracts and throws the backend error message
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error('An unexpected error occurred.');
            }
        }
    };

    useEffect(() => {
        const handleOAuthCallback = async () => {
            const params = new URLSearchParams(location.search);
            const token = params.get('token');
            const error = params.get('error');

            if (error) {
                toast.error(`Google sign-in failed: ${error}`);
                navigate('/login', { replace: true });

                return;
            }

            if (token) {
                localStorage.setItem('token', token);
                
                // Call checkAuth and wait for it to complete
                await checkAuth();
                
                // Give a tiny delay to ensure state propagates
                await new Promise(resolve => setTimeout(resolve, 100));
                
                toast.success('Login Successful!');
                navigate('/', { replace: true });
            }
        };

        handleOAuthCallback();
    }, [location.search, checkAuth, navigate]);

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900 flex font-inter">
            <div className="flex-1 bg-indigo-100 hidden lg:flex items-center justify-center">
                <img
                    className="h-96"
                    src="https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg"
                    alt="Signup illustration"
                />
            </div>

            <div className="flex flex-col justify-center items-center flex-1 px-4 py-8">
                <div className="text-4xl font-bold text-gray-800 flex mb-6 tracking-tight">
                    BLOG<span className="text-red-500">UER</span>
                </div>
                <div className="w-full max-w-md space-y-6 md:space-y-7">
                    <h1 className="text-2xl xl:text-3xl font-bold text-center">
                        Login
                    </h1>
                    <p className="text-center text-gray-600 max-w-md mx-auto">
                        Welcome Back to Bloguer Roger! You are just a few steps
                        to login.
                    </p>
                    <div className="flex justify-center">
                        <button
                            type="button"
                            onClick={handleGoogleClick}
                            className="mt-3 mb-2 w-full inline-flex items-center justify-center gap-2 h-11 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 hover:shadow-sm"
                        >
                            <img
                                src="/logo/google.webp"
                                alt="Google"
                                className="w-5 h-5"
                            />
                            Continue with Google
                        </button>
                    </div>

                    <div className="flex items-center justify-center gap-2 my-3">
                        <hr className="w-full border-gray-300" />
                        <span className="text-gray-500">or</span>
                        <hr className="w-full border-gray-300" />
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
                                onClick={togglePasswordVisibility}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            >
                                {showPassword ? (
                                    <EyeOff size={20} />
                                ) : (
                                    <Eye size={20} />
                                )}
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
                            <LogIn size={20} />
                            <p>{isLoading ? 'Loading...' : 'Login'}</p>
                        </button>

                        <div className="w-full flex justify-end">
                            <Link
                                to="/forgot-password"
                                className="text-sm text-gray-700 hover:text-gray-900 underline"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <div className="text-sm text-center mt-3">
                            Don't have an account?{' '}
                            <Link
                                to="/signup"
                                className="hover:text-red-500 hover:underline"
                            >
                                Signup
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
