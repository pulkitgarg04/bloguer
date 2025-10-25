import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

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

import { useAuthStore } from './store/authStore';

function App() {
    const { checkAuth } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/blogs" element={<ForYou />} />
                <Route path="/:username/:postId" element={<BlogPage />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />

                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />

                <Route path="/profile/:username" element={<Profile />} />
                <Route path="/bookmarked" element={<Bookmarked />} />
                <Route path="/write" element={<WritePost />} />
                <Route path="/edit/:username/:postId" element={<EditPost />} />
                <Route path="/analytics" element={<Analytics />} />
            </Routes>
            <Toaster />
        </BrowserRouter>
    );
}

export default App;
