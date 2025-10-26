import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForYou from './pages/ForYou';
import BlogPage from './pages/BlogPage';
import EditPost from './pages/EditPost';
import WritePost from './pages/WritePost';
import Bookmarked from './pages/Bookmarked';
import Profile from './pages/Profile';
import About from './pages/About';
import Contact from './pages/Contact';
import Analytics from './pages/Analytics';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';

import { useAuthStore } from './store/authStore';

function AppShell() {
    const { checkAuth } = useAuthStore();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleOAuthParams = async () => {
            const params = new URLSearchParams(location.search);
            const token = params.get('token');
            const error = params.get('error');

            if (error) {
                toast.error(`Google sign-in failed: ${error}`);

                navigate(location.pathname, { replace: true });

                return;
            }

            if (token) {
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
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/blogs" element={<ForYou />} />
                <Route path=":username/:postId" element={<BlogPage />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />

                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />

                <Route path="/profile/:username" element={<Profile />} />
                <Route path="/bookmarked" element={<Bookmarked />} />
                <Route path="/write" element={<WritePost />} />
                <Route path="/edit/:username/:postId" element={<EditPost />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
            </Routes>
            <Toaster />
        </>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AppShell />
        </BrowserRouter>
    );
}

export default App;
