import Navbar from "../components/Navbar";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

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

export default function Blog() {
  return (
    <div className="min-h-screen font-inter bg-gray-50">
      <Navbar activeTab="Blogs" />

      <section className="flex flex-col items-center space-y-5 px-4">
        <h3 className="mt-10 text-3xl font-semibold text-gray-800">
          Latest Blogs
        </h3>

        <p className="text-gray-600 text-center">
          Explore insightful articles, trending topics, and deep dives into the
          world of blogging.
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
                  {blogs[0].category} • {blogs[0].readTime}
                </p>
                <span className="mx-5 bg-red-200 px-2 py-1 rounded-xl text-xs text-red-600">
                  New
                </span>
              </div>
              <h2 className="text-3xl font-semibold mt-2 max-w-96">
                {blogs[0].title}
              </h2>
              <div className="mt-4 flex items-center space-x-4 text-gray-500">
                <img
                  src={"https://avatar.iran.liara.run/public"}
                  alt={blogs[0].author.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">
                    {blogs[0].author.name} • {blogs[0].datePosted}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-10 pb-10">
          {blogs.slice(1).map((blog) => (
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

                  {/* Blog content section */}
                  <p className="mt-4 text-gray-700 text-sm line-clamp-2">
                    {blog.content}
                  </p>

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

      {/* Pagination abhi set karni ha */}
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
