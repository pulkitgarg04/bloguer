import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';

export default function VerifyEmail() {
    const [params] = useSearchParams();
    const token = params.get('token');
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>(
        'idle'
    );
    const [message, setMessage] = useState('');

    useEffect(() => {
        const run = async () => {
            if (!token) {
                setStatus('error');
                setMessage('Missing verification token');
                return;
            }
            try {
                await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/verify-email`,
                    { params: { token } }
                );
                setStatus('success');
            } catch (e: any) {
                setStatus('error');
                setMessage(
                    e?.response?.data?.message || 'Verification failed.'
                );
            }
        };
        run();
    }, [token]);

    return (
        <div className="min-h-screen font-inter bg-gray-50">
            <Navbar activeTab={'Home'} />
            <div className="max-w-xl mx-auto py-20 px-4 text-center">
                {status === 'idle' && (
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
                        <p className="mt-2 text-gray-600">
                            You can request a new verification email from the
                            Signup page.
                        </p>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
