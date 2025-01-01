import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";
import { Twitter, Facebook, Mail, Linkedin } from "lucide-react";
import DOMPurify from "dompurify";
import { toast } from "react-hot-toast";

interface FormatDateFunction {
  (dateString: string): string;
}

const formatDate: FormatDateFunction = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

interface Blog {
  category: string;
  readTime: string;
  title: string;
  author: {
    name: string;
    username: string;
    avatar: string;
  };
  Date: string;
  featuredImage: string;
  content: string;
  views: number;
}

interface SimilarBlog {
  id: string;
  category: string;
  readTime: string;
  title: string;
  featuredImage: string;
  content: string;
  author: {
    name: string;
    username: string;
    avatar: string;
  };
  Date: string;
  views: number;
}

export default function BlogPage() {
  const { postId } = useParams();

  const [blog, setBlog] = useState<Blog | null>(null);
  const [similarBlogs, setSimilarBlogs] = useState<SimilarBlog[]>([]);

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/${postId}`
        );
        const data = await response.data;
        setBlog(data.post);
        setSimilarBlogs(data.similarPosts);
      } catch (error) {
        toast.error(`Error fetching blog data: ${error}`);
      }
    };

    fetchBlogData();
  }, [postId]);

  if (!blog) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen font-inter">
      <Navbar activeTab={"Blogs"} />

      <section className="p-10 bg-gray-100">
        <p className="text-center">
          {blog.category} • {blog.readTime || "10Min"}
        </p>
        <div className="flex justify-center items-center py-6">
          <h1 className="text-center text-4xl w-2/3 font-semibold">
            {blog.title}
          </h1>
        </div>
        <div className="flex justify-center items-center">
          <img
            src={blog.author.avatar}
            alt={blog.author.name}
            className="h-10 w-10"
          />
          <p className="text-lg pl-3">
            {blog.author.name} • {formatDate(blog.Date)} • {blog.views} views
          </p>
        </div>
      </section>

      <section className="py-10">
        <div className="flex justify-center">
          <img
            src={blog.featuredImage}
            alt={blog.title}
            className="h-96 max-w-3xl object-cover rounded-lg"
          />
        </div>
        <div className="max-w-3xl mx-auto px-4 py-6">
          <div
            className="text-lg text-gray-700 prose"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(blog.content),
            }}
          />
        </div>
      </section>

      <div className="inset-x-0 top-1/2 h-px -translate-y-1/2 bg-transparent bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-75"></div>

      <section className="flex justify-between px-40 py-8 items-center">
        <div className="flex gap-5">
          <img src={blog.author.avatar} alt="avatar" className="h-20" />
          <Link to={`/${blog.author.username}`}>
            <div className="flex flex-col justify-center">
              <p className="text-gray-700">Written by:</p>
              <p className="text-xl font-semibold">{blog.author.name}</p>
              <p className="text-sm">@{blog.author.username}</p>
            </div>
          </Link>
        </div>
        <div className="flex">
          <p className="font-semibold">Share this blog:</p>
          <div className="flex gap-5 pl-4">
            <Facebook
              className="text-black bg-white rounded-full p-1"
              size={25}
            />
            <Twitter
              className="text-black bg-white rounded-full p-1"
              size={25}
            />
            <Mail className="text-black bg-white rounded-full p-1" size={25} />
            <Linkedin
              className="text-black bg-white rounded-full p-1"
              size={25}
            />
          </div>
        </div>
      </section>

      <section>
        <span className="relative flex justify-center">
          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-transparent bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-75"></div>
          <span className="relative z-10 bg-white px-6 text-xl font-semibold">
            You May Also Like
          </span>
        </span>

        {similarBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-14 pt-10">
            {similarBlogs.map((blog) => (
              <Link to={`/${blog.author.username}/${blog.id}`}>
                <div
                  key={blog.id}
                  className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col h-full"
                >
                  <img
                    src={blog.featuredImage}
                    alt={blog.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4 flex flex-col flex-grow">
                    <div className="text-sm text-red-500 font-medium">
                      {blog.category} • {blog.readTime || "10 Min"}
                    </div>
                    <h3 className="text-lg font-semibold mt-2 flex-grow">
                      {blog.title}
                    </h3>

                    <p
                      className="mt-4 text-gray-700 text-sm line-clamp-2"
                      dangerouslySetInnerHTML={{
                        __html: blog.content,
                      }}
                    />

                    <div className="mt-4 flex items-center space-x-4 text-gray-500">
                      <img
                        src={"https://avatar.iran.liara.run/public"}
                        alt={blog.author.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-sm">
                          {blog.author.name} • {formatDate(blog.Date)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center mt-10 font-medium text-xl">
            No Similar Posts for this post
          </div>
        )}
      </section>

      <Newsletter />
      <Footer />
    </div>
  );
}
