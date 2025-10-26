import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email) {
            toast.error('Please enter your email.');

            return;
        }

        try {
            setIsLoading(true);
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/forgot-password`,
                { email }
            );
            toast.success('If an account exists, a reset link will be sent.');
            navigate('/login');
        } catch {
            toast.success('If an account exists, a reset link will be sent.');
            navigate('/login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900 flex font-inter">
            <div className="flex flex-col justify-center items-center flex-1 px-4 py-8">
                <div className="text-4xl font-bold text-gray-800 flex mb-6 tracking-tight">
                    BLOG<span className="text-red-500">UER</span>
                </div>

                <div className="w-full max-w-md space-y-6 md:space-y-7">
                    <h1 className="text-2xl xl:text-3xl font-bold text-center">
                        Forgot Password
                    </h1>

                    <p className="text-center text-gray-600 max-w-md mx-auto">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>

                    <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-5">
                        <label
                            htmlFor="email"
                            className="relative block rounded-md border border-gray-200 shadow-sm"
                        >
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 h-11 px-4 w-full text-base"
                                placeholder="Email"
                            />
                            <span className="pointer-events-none absolute left-2.5 top-0 -translate-y-1/2 bg-gray-100 px-1 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                                Email
                            </span>
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
                            {isLoading ? 'Sending…' : 'Send reset link'}
                        </button>

                        <div className="text-sm text-center mt-3">
                            <Link to="/login" className="hover:text-red-500 hover:underline">
                                Back to Login
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
