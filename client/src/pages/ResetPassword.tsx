import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

export default function ResetPassword() {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const token = params.get('token');

    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.newPassword || !formData.confirmPassword) {
            toast.error('Please fill out all fields.');
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('Passwords do not match.');
            return;
        }

        if (formData.newPassword.length < 8) {
            toast.error('Password must be at least 8 characters long.');
            return;
        }

        if (!token) {
            toast.error('Invalid or missing reset token.');
            return;
        }

        try {
            setIsLoading(true);
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/reset-password`,
                { token, newPassword: formData.newPassword }
            );
            toast.success('Password reset successfully!');
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to reset password.';
            toast.error(errorMessage);
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
                        Reset Password
                    </h1>

                    <p className="text-center text-gray-600 max-w-md mx-auto">
                        Enter your new password below.
                    </p>

                    <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-5">
                        <label
                            htmlFor="newPassword"
                            className="relative block rounded-md border border-gray-200 shadow-sm"
                        >
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 h-11 px-4 w-full text-base pr-12"
                                placeholder="New Password"
                            />
                            <span className="pointer-events-none absolute left-2.5 top-0 -translate-y-1/2 bg-gray-100 px-1 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                                New Password
                            </span>
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </label>

                        <label
                            htmlFor="confirmPassword"
                            className="relative block rounded-md border border-gray-200 shadow-sm"
                        >
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                id="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 h-11 px-4 w-full text-base pr-12"
                                placeholder="Confirm Password"
                            />
                            <span className="pointer-events-none absolute left-2.5 top-0 -translate-y-1/2 bg-gray-100 px-1 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                                Confirm Password
                            </span>
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
                            {isLoading ? 'Resetting…' : 'Reset Password'}
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
