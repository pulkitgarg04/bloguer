import { BrowserRouter, Route, Routes } from "react-router-dom";
// import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Blog from "./pages/Blogs";
import BlogPage from "./pages/BlogPage";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Blog />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/blogs" element={<Blog />} />
        <Route path="/blog/page" element={<BlogPage />} />

        <Route path="/profile" element={<BlogPage />} />
        <Route path="/bookmarked" element={<BlogPage />} />
        <Route path="/write" element={<BlogPage />} />
        <Route path="/edit" element={<BlogPage />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;