import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { MapPin, Calendar1 } from "lucide-react";

const blogs = [
  {
    id: 1,
    title:
      "Discover expert tips, trends, and stories to inspire and empower your blogging journey!",
    content:
      "Blogging is one of the most rewarding and challenging activities one can embark on. In this blog, we explore various expert tips, techniques, and trends to help you stand out in the crowded digital world. Learn how to craft compelling content, develop your personal brand, and stay updated with the latest industry news.",
    category: "Blogging",
    readTime: "15 min read",
    author: {
      name: "Pulkit Garg",
      image: "/author1.jpg",
    },
    datePosted: "Dec 30, 2024",
    featuredImage:
      "https://blog.snappa.com/wp-content/uploads/2017/04/featured-images-fb.png",
  },
  {
    id: 2,
    title: "Exploring the Art of Storytelling",
    content:
      "Storytelling is a powerful tool that every writer should master. In this article, we dive deep into the art of crafting stories that captivate your audience. We cover narrative structures, character development, and how to evoke emotion through your writing.",
    category: "Writing",
    readTime: "10 min read",
    author: {
      name: "Pulkit Garg",
      image: "/author2.jpg",
    },
    datePosted: "Dec 28, 2024",
    featuredImage:
      "https://blog.snappa.com/wp-content/uploads/2017/04/featured-images-fb.png",
  },
  {
    id: 3,
    title: "How to Create Engaging Blog Content",
    content:
      "Creating engaging content is key to maintaining your audience’s interest. In this blog, we provide strategies on how to keep your readers hooked from the first paragraph to the last. Learn the importance of storytelling, the use of visuals, and how to optimize your content for SEO.",
    category: "Marketing",
    readTime: "12 min read",
    author: {
      name: "Pulkit Garg",
      image: "/author3.jpg",
    },
    datePosted: "Dec 25, 2024",
    featuredImage:
      "https://blog.snappa.com/wp-content/uploads/2017/04/featured-images-fb.png",
  },
  {
    id: 4,
    title: "Mastering SEO: Tips and Best Practices for Content Optimization",
    content:
      "Search Engine Optimization (SEO) is essential for any blogger who wants to grow their audience. This post covers the best practices for SEO, including keyword research, on-page SEO techniques, and how to measure the effectiveness of your SEO efforts. Learn how to make your content discoverable and relevant on search engines.",
    category: "SEO",
    readTime: "8 min read",
    author: {
      name: "Pulkit Garg",
      image: "/author4.jpg",
    },
    datePosted: "Dec 20, 2024",
    featuredImage:
      "https://visualmodo.com/wp-content/uploads/2017/11/Featured-Image-Usage-Guide-And-Importance-6.jpg",
  },
  {
    id: 5,
    title: "Building a Personal Brand as a Blogger",
    content:
      "A personal brand can differentiate you from others in the blogging world. This blog discusses how to create and promote your personal brand, how to connect with your target audience, and why authenticity is key to success in blogging.",
    category: "Branding",
    readTime: "10 min read",
    author: {
      name: "Pulkit Garg",
      image: "/author2.jpg",
    },
    datePosted: "Dec 18, 2024",
    featuredImage:
      "https://blog.snappa.com/wp-content/uploads/2017/04/featured-images-fb.png",
  },
  {
    id: 6,
    title: "Maximizing Social Media for Bloggers",
    content:
      "Social media is an essential tool for bloggers to promote their content and connect with their audience. In this blog, we explore how bloggers can use different social media platforms like Twitter, Instagram, and LinkedIn to boost their visibility and grow their audience.",
    category: "Social Media",
    readTime: "12 min read",
    author: {
      name: "Pulkit Garg",
      image: "/author3.jpg",
    },
    datePosted: "Dec 15, 2024",
    featuredImage:
      "https://blog.snappa.com/wp-content/uploads/2017/04/featured-images-fb.png",
  },
  {
    id: 7,
    title: "The Role of Visuals in Blogging",
    content:
      "Images, infographics, and videos can help improve engagement with your blog posts. In this blog, we discuss how to effectively use visuals in your content, the benefits they bring, and how to create or source high-quality visuals.",
    category: "Design",
    readTime: "9 min read",
    author: {
      name: "Pulkit Garg",
      image: "/author4.jpg",
    },
    datePosted: "Dec 10, 2024",
    featuredImage:
      "https://visualmodo.com/wp-content/uploads/2017/11/Featured-Image-Usage-Guide-And-Importance-6.jpg",
  },
];

export default function Profile() {
  const { user } = useAuthStore();
  const blogsAvaliable = false;

  return (
    <div className="min-h-screen font-inter">
      <Navbar activeTab="Home" />
      <div className="h-40 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
      <div className="px-40 py-2 flex flex-col gap-3 pb-6">
        <div className="h-28 shadow-md w-28 rounded-full border-4 overflow-hidden -mt-14 border-white">
          <img
            src={user?.avatar}
            className="w-full h-full rounded-full object-center object-cover"
          />
        </div>
        <div className="flex justify-between items-center">
          <div className="py-4 flex flex-col gap-2">
            <p className="text-2xl font-semibold">{user.name}</p>
            <p>{user.bio || "This is my bio."}</p>
            <div className="flex gap-4">
              <p>@{user?.username}</p>
              <p className="flex gap-1 items-center">
                <MapPin size={15} />
                <span>Punjab, India</span>
              </p>
              <p className="flex gap-1 items-center">
                <Calendar1 size={15} />
                <span>Joined 1 January, 2025</span>
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
          {user.name}'s Blogs
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-20 pb-10">
          {blogs.map((blog) => (
            <Link to="/blog/page">
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
                    {blog.category} • {blog.readTime}
                  </div>
                  <h3 className="text-lg font-semibold mt-2 flex-grow">
                    {blog.title}
                  </h3>

                  <div className="mt-4 flex items-center space-x-4 text-gray-500">
                    <img
                      src={"https://avatar.iran.liara.run/public"}
                      alt={blog.author.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-sm">
                        {blog.author.name} • {blog.datePosted}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
