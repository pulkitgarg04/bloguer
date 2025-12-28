import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

export default function Signup() {
    const { signup, isLoading, checkAuth } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState<{
        name: string;
        username: string;
        email: string;
        password: string;
    }>({
        name: '',
        username: '',
        email: '',
        password: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isChecked, setIsChecked] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;

        setFormData((prevData) => ({ ...prevData, [id]: value }));
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    // const handleGoogleClick = () => {
    //     const redirect = window.location.origin;
        
    //     window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/google?redirect=${encodeURIComponent(redirect)}`;
    // };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            if (
                !formData.name ||
                !formData.username ||
                !formData.email ||
                !formData.password
            ) {
                toast.error('Please fill out all fields.');

                return;
            }

            if (!isChecked) {
                toast.error('You must agree to the terms and privacy policy.');

                return;
            }

            const signupSuccess = await signup(
                formData.email,
                formData.password,
                formData.name,
                formData.username
            );

            if (signupSuccess) {
                toast.dismiss();
                toast.success('Signup successful! Please check your email to verify your account.');
                // signup(formData);

                setTimeout(() => {
                    navigate('/verify-email');
                }, 1500);
            }
        } catch (error: unknown) {
            let errorMessage = 'An unexpected error occurred.';
            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data?.message || error.message || errorMessage;
            }
            else if (error instanceof Error) {
                errorMessage = error.message;
            }
            toast.error(errorMessage);
        }
    };

    useEffect(() => {
        const handleOAuthCallback = async () => {
            const params = new URLSearchParams(location.search);
            const token = params.get('token');
            const error = params.get('error');

            if (error) {
                toast.error(`Google sign-in failed: ${error}`);
                navigate('/signup', { replace: true });

                return;
            }

            if (token) {
                localStorage.setItem('token', token);
                
                await checkAuth();
                
                await new Promise(resolve => setTimeout(resolve, 100));
                
                toast.success('Signup Successful!');
                navigate('/', { replace: true });
            }
        };

        handleOAuthCallback();
    }, [location.search, checkAuth, navigate]);

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900 flex font-inter">
            <div className="flex flex-col justify-center items-center flex-1 px-4 py-8">
                <div className="text-4xl font-bold text-gray-800 flex mb-6 tracking-tight">
                    BLOG<span className="text-red-500">UER</span>
                </div>
                <div className="w-full max-w-md space-y-6 md:space-y-7">
                    <h1 className="text-2xl xl:text-3xl font-bold text-center">
                        Signup
                    </h1>

                    <p className="text-center text-gray-600 max-w-md mx-auto">
                        Welcome to Bloguer Roger! You are just a few steps away
                        to signup.
                    </p>

                    {/* <div className="flex justify-center">
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
                    </div> */}

                    <form onSubmit={handleSubmit}>
                        <div className="mx-auto max-w-md space-y-4">
                            <label
                                htmlFor="name"
                                className="relative block rounded-md border border-gray-200 shadow-sm"
                            >
                                <input
                                    type="text"
                                    id="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 h-11 px-4 w-full text-base"
                                    placeholder="Name"
                                />
                                <span className="pointer-events-none absolute left-2.5 top-0 -translate-y-1/2 bg-gray-100 px-1 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                                    Name
                                </span>
                            </label>

                            <label
                                htmlFor="username"
                                className="relative block rounded-md border border-gray-200 shadow-sm"
                            >
                                <input
                                    type="text"
                                    id="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 h-11 px-4 w-full text-base"
                                    placeholder="Username"
                                />
                                <span className="pointer-events-none absolute left-2.5 top-0 -translate-y-1/2 bg-gray-100 px-1 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                                    Username
                                </span>
                            </label>

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

                            <div className="space-y-2">
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
                                <div className="text-xs text-gray-600 space-y-1 px-1">
                                    <p className="font-medium text-gray-700">Password must contain:</p>
                                    <ul className="list-disc list-inside space-y-0.5 ml-2">
                                        <li>At least 8 characters</li>
                                        <li>One uppercase letter (A-Z)</li>
                                        <li>One lowercase letter (a-z)</li>
                                        <li>One number (0-9)</li>
                                        <li>One special character (@$!%*?&#)</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="flex items-center justify-start space-x-2">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4"
                                    checked={isChecked}
                                    onChange={() =>
                                        setIsChecked((prev) => !prev)
                                    }
                                />
                                <p className="text-sm text-gray-600 leading-snug">
                                    I agree to abide by Bloguer's Terms of
                                    Service and its Privacy Policy.
                                </p>
                            </div>

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
                                <p>
                                    {isLoading
                                        ? 'Creating...'
                                        : 'Create Account'}
                                </p>
                            </button>

                            <div className="text-sm text-center mt-3">
                                Already have an account?{' '}
                                <Link
                                    to="/login"
                                    className="hover:text-red-500 hover:underline"
                                >
                                    Login
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div className="flex-1 bg-indigo-100 hidden lg:flex items-center justify-center">
                <img
                    className="h-96"
                    src="https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg"
                    alt="Signup illustration"
                />
            </div>
        </div>
    );
}
