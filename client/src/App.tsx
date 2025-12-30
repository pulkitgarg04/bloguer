import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForYou from './pages/ForYou';
import BlogPage from './pages/BlogPage';

const EditPost = lazy(() => import('./pages/EditPost'));
const WritePost = lazy(() => import('./pages/WritePost'));
const Bookmarked = lazy(() => import('./pages/Bookmarked'));
const Profile = lazy(() => import('./pages/Profile'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Analytics = lazy(() => import('./pages/Analytics'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));

const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminPosts = lazy(() => import('./pages/admin/AdminPosts'));
const AdminComments = lazy(() => import('./pages/admin/AdminComments'));
const AdminSubscribers = lazy(() => import('./pages/admin/AdminSubscribers'));
const AdminMessages = lazy(() => import('./pages/admin/AdminMessages'));

import { Analytics as VAnalytics } from "@vercel/analytics/react"

import { useAuthStore } from './store/authStore';

const PageLoader = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
    </div>
);

function AppShell() {
    const { checkAuth } = useAuthStore();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleOAuthParams = async () => {
            const params = new URLSearchParams(location.search);
            const token = params.get('token');
            const error = params.get('error');

            const isOAuthCallback = location.pathname === '/login' || location.pathname === '/signup';
            
            if (error && isOAuthCallback) {
                toast.error(`Google sign-in failed: ${error}`);

                navigate(location.pathname, { replace: true });

                return;
            }

            if (token && isOAuthCallback) {
                localStorage.setItem('token', token);
                await checkAuth();

                await new Promise((r) => setTimeout(r, 100));

                navigate(location.pathname, { replace: true });
            }
        };

        handleOAuthParams();
    }, [location.search, location.pathname, checkAuth, navigate]);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return (
        <>
            <Suspense fallback={<PageLoader />}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/blogs" element={<ForYou />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms-of-service" element={<TermsOfService />} />

                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />

                    <Route path="/profile/:username" element={<Profile />} />
                    <Route path="/bookmarked" element={<Bookmarked />} />
                    <Route path="/write" element={<WritePost />} />
                    <Route path="/edit/:username/:postId" element={<EditPost />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />

                    <Route path="/admin" element={<AdminLogin />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/users" element={<AdminUsers />} />
                    <Route path="/admin/posts" element={<AdminPosts />} />
                    <Route path="/admin/comments" element={<AdminComments />} />
                    <Route path="/admin/subscribers" element={<AdminSubscribers />} />
                    <Route path="/admin/messages" element={<AdminMessages />} />

                    <Route path="/:username/:postId" element={<BlogPage />} />
                </Routes>
            </Suspense>
            <Toaster />
        </>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AppShell />
            <VAnalytics />
        </BrowserRouter>
    );
}

export default App;
