import { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function VerifyEmail() {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const token = params.get('token');
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>(
        'idle'
    );
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [resending, setResending] = useState(false);

    useEffect(() => {
        const run = async () => {
            if (!token) {
                // User arrived without a token (from signup/login redirect)
                setStatus('idle');

                return;
            }

            console.log('Attempting verification with token:', token);

            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/verify-email`,
                    { params: { token } }
                );
                
                console.log('Verification response:', response.data);
                setStatus('success');
                toast.success('Email verified successfully!');
                
                // Redirect to login after 2 seconds
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } catch (e: any) {
                console.error('Verification error:', e);
                setStatus('error');
                setMessage(
                    e?.response?.data?.message || 'Verification failed.'
                );
            }
        };

        run();
    }, [token, navigate]);

    const handleResendVerification = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            toast.error('Please enter your email address');
            return;
        }
        
        setResending(true);
        try {
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/resend-verification`,
                { email }
            );
            toast.success('Verification email sent! Please check your inbox.');
            setEmail('');
        } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Failed to resend verification email');
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="min-h-screen font-inter bg-gray-50 flex flex-col">
            <Navbar activeTab={'Home'} />
            <div className="flex-1 flex items-center justify-center px-4">
                <div className="max-w-xl w-full">
                {status === 'idle' && !token && (
                    <div className="bg-white border border-blue-200 rounded-lg p-8">
                        <h2 className="text-2xl font-semibold text-red-500">
                            Verify Your Email
                        </h2>
                        <p className="mt-2 text-gray-600">
                            We've sent a verification link to your email address.
                            Please check your inbox and click the link to verify your account.
                        </p>
                        <div className="mt-6 border-t pt-6">
                            <p className="text-sm text-gray-600 mb-4">
                                Didn't receive the email? Enter your email to resend:
                            </p>
                            <form onSubmit={handleResendVerification} className="flex gap-2">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                                <button
                                    type="submit"
                                    disabled={resending}
                                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded disabled:opacity-50"
                                >
                                    {resending ? 'Sending...' : 'Resend'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
                {status === 'idle' && token && (
                    <div className="bg-white border border-gray-200 rounded-lg p-8">
                        Verifying your email...
                    </div>
                )}
                {status === 'success' && (
                    <div className="bg-white border border-green-200 rounded-lg p-8">
                        <h2 className="text-2xl font-semibold text-green-700">
                            Email verified successfully
                        </h2>
                        <p className="mt-2 text-gray-600">
                            You can now log in to your account.
                        </p>
                        <Link
                            to="/login"
                            className="inline-block mt-4 px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white"
                        >
                            Go to Login
                        </Link>
                    </div>
                )}
                {status === 'error' && (
                    <div className="bg-white border border-red-200 rounded-lg p-8">
                        <h2 className="text-2xl font-semibold text-red-700">
                            Verification failed
                        </h2>
                        <p className="mt-2 text-gray-600">{message}</p>
                        <div className="mt-6 border-t pt-6">
                            <p className="text-sm text-gray-600 mb-4">
                                Request a new verification email:
                            </p>
                            <form onSubmit={handleResendVerification} className="flex gap-2">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                                <button
                                    type="submit"
                                    disabled={resending}
                                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded disabled:opacity-50"
                                >
                                    {resending ? 'Sending...' : 'Resend'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
                </div>
            </div>
            <Footer />
        </div>
    );
}
