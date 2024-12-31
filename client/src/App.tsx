import { BrowserRouter, Route, Routes } from "react-router-dom";
// import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Blog from "./pages/Blogs";
import BlogPage from "./pages/BlogPage";
import { Toaster } from "react-hot-toast";
import EditPost from "./pages/EditPost";
import WritePost from "./pages/WritePost";
import Bookmarked from "./pages/Bookmarked";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Contact from "./pages/Contact";

import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Blog />} />
          <Route path="/blogs" element={<Blog />} />
          <Route path="/blog/page" element={<BlogPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          <Route path="/profile" element={<Profile />} />
          <Route path="/bookmarked" element={<Bookmarked />} />
          <Route path="/write" element={<WritePost />} />
          <Route path="/edit" element={<EditPost />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
