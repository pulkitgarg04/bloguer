import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link, useParams } from "react-router-dom";
import { MapPin, Calendar1 } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

type FormatDateFunction = (dateString: string) => string;

const formatDate: FormatDateFunction = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function Profile() {
  const { username } = useParams();

  interface User {
    id: string;
    name: string;
    username: string;
    email: string;
    avatar?: string;
    bio?: string;
    JoinedDate?: string;
    location?: string;
  }

  interface Blog {
    id: string;
    featuredImage?: string;
    title: string;
    category: string;
    readTime?: string;
    author: {
      avatar?: string;
      name: string;
      username: string;
    };
    Date: string;
  }

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/profile/${username}`
        );
        setBlogs(response.data.posts);
        setUserData(response.data.user);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchUserProfile();
    }
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen font-inter">
        <Navbar activeTab="Home" />

        <div className="h-40 bg-gray-300 animate-pulse"></div>

        <div className="px-40 py-2 flex flex-col gap-3 pb-6">
          <div className="h-28 w-28 rounded-full bg-gray-300 animate-pulse -mt-14 border-white"></div>

          <div className="flex justify-between items-center">
            <div className="py-4 flex flex-col gap-2 w-3/4">
              <div className="h-6 bg-gray-300 animate-pulse w-1/2"></div>
              <div className="h-4 bg-gray-300 animate-pulse w-3/4"></div>
              <div className="flex gap-4">
                <div className="h-4 bg-gray-300 animate-pulse w-1/3"></div>
                <div className="h-4 bg-gray-300 animate-pulse w-1/3"></div>
                <div className="h-4 bg-gray-300 animate-pulse w-1/3"></div>
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              <div className="h-8 bg-gray-300 animate-pulse rounded-lg w-24"></div>
              <div className="flex justify-center items-center gap-4">
                <div className="bg-gray-300 animate-pulse py-3 rounded-xl px-7 w-24"></div>
                <div className="bg-gray-300 animate-pulse py-3 rounded-xl px-7 w-24"></div>
              </div>
            </div>
          </div>
        </div>

        <section className="my-10">
          <h3 className="text-center text-2xl font-semibold mb-10 h-6 bg-gray-300 animate-pulse w-1/3 mx-auto"></h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-20 pb-10">
            {Array(3)
              .fill(0)
              .map((_, index) => (
                <div
                  className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col h-full animate-pulse"
                  key={index}
                >
                  <div className="h-48 bg-gray-300 animate-pulse"></div>
                  <div className="p-4 flex flex-col flex-grow">
                    <div className="h-4 bg-gray-300 animate-pulse w-1/2"></div>
                    <div className="h-6 bg-gray-300 animate-pulse mt-2 w-3/4"></div>
                    <div className="mt-4 flex items-center space-x-4 text-gray-500">
                      <div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse"></div>
                      <div>
                        <div className="h-4 bg-gray-300 animate-pulse w-1/2"></div>
                        <div className="h-4 bg-gray-300 animate-pulse w-1/3 mt-2"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </section>

        <Footer />
      </div>
    );
  }


  if (!userData) {
    return (
      <div className="min-h-screen font-inter">
        <Navbar activeTab="Home" />
        <div className="text-center font-medium text-xl">User not found.</div>;
      </div>
    );
  }

  return (
    <div className="min-h-screen font-inter">
      <Navbar activeTab="Home" />
      <div className="h-40 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
      <div className="px-40 py-2 flex flex-col gap-3 pb-6">
        <div className="h-28 shadow-md w-28 rounded-full border-4 overflow-hidden -mt-14 border-white">
          <img
            src={userData.avatar || "https://default-avatar.com/avatar.png"}
            className="w-full h-full rounded-full object-center object-cover"
            alt={userData.name || "User Avatar"}
          />
        </div>
        <div className="flex justify-between items-center">
          <div className="py-4 flex flex-col gap-2">
            <p className="text-2xl font-semibold">{userData.name}</p>
            <p>{userData.bio || "Hi There, I am using Bloguer!"}</p>
            <div className="flex gap-4">
              <p>@{userData.username}</p>
              <p className="flex gap-1 items-center">
                <MapPin size={15} />
                <span>{userData.location || "Location not set"}</span>
              </p>
              <p className="flex gap-1 items-center">
                <Calendar1 size={15} />
                <span>
                  {userData.JoinedDate
                    ? `Joined: ${formatDate(userData.JoinedDate)}`
                    : "Joined Date not available"}
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <button className="bg-gray-800 rounded-lg text-white p-2">
              Follow
            </button>
            <div className="flex justify-center items-center gap-4">
              <div className="bg-indigo-200 py-3 rounded-xl px-7">
                <p className="text-xl text-indigo-800 font-medium">{"1M"}</p>
                <p className="text-sm">Followers</p>
              </div>
              <div className="bg-green-200 py-3 rounded-xl px-7">
                <p className="text-xl text-green-800 font-medium">{"70"}</p>
                <p className="text-sm">Following</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="my-10">
        <h3 className="text-center text-2xl font-semibold mb-10">
          {userData.name}'s Blogs
        </h3>

        {blogs && blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-20 pb-10">
            {blogs.map((blog) => (
              <Link to={`/${userData.username}/${blog.id}`} key={blog.id}>
                <div className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col h-full">
                  <img
                    src={
                      blog.featuredImage ||
                      "https://default-placeholder.com/600x400.png"
                    }
                    alt={blog.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4 flex flex-col flex-grow">
                    <div className="text-sm text-red-500 font-medium">
                      {blog.category} • {blog.readTime || "Read Time N/A"}
                    </div>
                    <h3 className="text-lg font-semibold mt-2 flex-grow line-clamp-2">
                      {blog.title}
                    </h3>
                    <div className="mt-4 flex items-center space-x-4 text-gray-500">
                      <img
                        src={
                          userData.avatar ||
                          "https://default-avatar.com/avatar.png"
                        }
                        alt={userData.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-sm">
                          {userData.name} •{" "}
                          {formatDate(blog.Date)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center font-medium text-xl py-10">
            No blogs found.
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
