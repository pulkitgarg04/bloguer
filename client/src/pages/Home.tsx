import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

interface FormatDateFunction {
  (dateString: string): string;
}

const formatDate: FormatDateFunction = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export default function Blog() {
  interface Blog {
    id: string;
    featuredImage: string;
    title: string;
    category: string;
    readTime: string;
    author: {
      name: string;
    };
    Date: string;
    content: string;
  }

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/bulk`);
        console.log(response.data);
        setBlogs(response.data);
        setLoading(false);
      } catch (err) {
        toast.error("Error fetching blogs");
        console.log("Error: ", err);
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen font-inter bg-gray-50">
      <Navbar activeTab="Home" />

      <section className="flex flex-col items-center space-y-5 px-4">
        <h3 className="mt-10 text-3xl font-semibold text-gray-800">Latest Blogs</h3>
        <p className="text-gray-600 text-center">
          Explore insightful articles, trending topics, and deep dives into the world of blogging.
        </p>
        <div className="flex items-center w-full max-w-lg bg-gray-200 px-4 py-2 rounded-lg shadow-sm">
          <Search className="text-red-500" size={20} />
          <input
            type="text"
            className="w-full p-2 bg-transparent outline-none text-gray-800 placeholder-gray-500"
            placeholder="Search for blogs by topic or keywords ..."
          />
        </div>
      </section>

      <section className="mt-16 px-4">
        <Link to="/blog/page">
          <div className="w-full overflow-hidden mb-10 flex justify-center">
            <img
              src={blogs[0].featuredImage}
              alt={blogs[0].title}
              className="w-1/3 h-80 object-cover rounded-lg shadow-sm"
            />
            <div className="p-8 flex flex-col justify-center">
              <div className="text-sm text-red-500 font-medium flex items-center">
                <p>
                  {blogs[0].category} • {blogs[0].readTime || "15 Min"}
                </p>
                <span className="mx-5 bg-red-200 px-2 py-1 rounded-xl text-xs text-red-600">
                  New
                </span>
              </div>
              <h2 className="text-3xl font-semibold mt-2 max-w-96">{blogs[0].title}</h2>
              <div className="mt-4 flex items-center space-x-4 text-gray-500">
                <img
                  src={"https://avatar.iran.liara.run/public"}
                  alt={blogs[0].author.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">
                    {blogs[0].author.name} • {formatDate(blogs[0].Date)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-10 pb-10">
          {blogs.slice(1).map((blog) => (
            <Link key={blog.id} to={`/blog/${blog.id}`}>
              <div className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col h-full">
                <img
                  src={blog.featuredImage}
                  alt={blog.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 flex flex-col flex-grow">
                  <div className="text-sm text-red-500 font-medium">
                    {blog.category} • {blog.readTime || "15Min"}
                  </div>
                  <h3 className="text-lg font-semibold mt-2 flex-grow">{blog.title}</h3>
                  <p className="mt-4 text-gray-700 text-sm line-clamp-2">{blog.content}</p>
                  <div className="mt-4 flex items-center space-x-4 text-gray-500">
                    <img
                      src={"https://avatar.iran.liara.run/public"}
                      alt={blog.author.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-sm">
                        {/* {blog.author.name} • {blog.Date.toLocaleDateString()} */}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Pagination */}
      <ol className="flex justify-center items-center gap-2 text-xs font-medium">
        <li>
          <a
            href="#"
            className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-gray-100 bg-white text-gray-900 hover:bg-gray-100"
          >
            <span className="sr-only">Previous Page</span>
            <ChevronLeft />
          </a>
        </li>
        {/* Pagination numbers */}
        <li>
          <a
            href="#"
            className="block w-8 h-8 rounded-md border border-gray-100 bg-white text-center leading-8 text-gray-900 hover:bg-gray-100"
          >
            1
          </a>
        </li>
        <li>
          <span className="block w-8 h-8 text-xl rounded-md bg-red-600 text-center leading-8 text-white">
            2
          </span>
        </li>
        {/* More pages */}
        <li>
          <a
            href="#"
            className="block w-8 h-8 rounded-md border border-gray-100 bg-white text-center leading-8 text-gray-900 hover:bg-gray-100"
          >
            3
          </a>
        </li>
        <li>
          <a
            href="#"
            className="block w-8 h-8 rounded-md border border-gray-100 bg-white text-center leading-8 text-gray-900 hover:bg-gray-100"
          >
            4
          </a>
        </li>
        <li>
          <a
            href="#"
            className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-gray-100 bg-white text-gray-900 hover:bg-gray-100 rtl:rotate-180"
          >
            <span className="sr-only">Next Page</span>
            <ChevronRight />
          </a>
        </li>
      </ol>

      <Newsletter />
      <Footer />
    </div>
  );
}