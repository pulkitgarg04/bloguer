import Navbar from "../components/Navbar";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";
import { Twitter, Facebook, Mail, Linkedin } from "lucide-react";

const blog = {
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
};

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
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen font-inter">
      <Navbar activeTab={"Blogs"} />

      <section className="p-10 bg-gray-100">
        <p className="text-center">
          {blog.category} • {blog.readTime}
        </p>
        <div className="flex justify-center items-center py-6">
          <h1 className="text-center text-4xl w-2/3 font-semibold">
            {blog.title}
          </h1>
        </div>
        <div className="flex justify-center items-center">
          <img
            src="https://avatar.iran.liara.run/public"
            alt={blog.author.name}
            className="h-10 w-10"
          />
          <p className="text-lg pl-3">
            {blog.author.name} • {blog.datePosted}
          </p>
        </div>
      </section>

      {/* // add logic to render featured image and content here */}
      <section className="py-10">
        <div className="flex justify-center">
          <img
            src={blog.featuredImage}
            alt={blog.title}
            className="h-96 max-w-3xl object-cover rounded-lg"
          />
        </div>
        <div className="max-w-3xl mx-auto px-4 py-6">
          <p className="text-lg text-gray-700">{blog.content}</p>
        </div>
      </section>

      <div className="inset-x-0 top-1/2 h-px -translate-y-1/2 bg-transparent bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-75"></div>

      <section className="flex justify-between px-40 py-8 items-center">
        <div className="flex gap-5">
          <img
            src="https://avatar.iran.liara.run/public"
            alt="avatar"
            className="h-20"
          />
          <div className="flex flex-col justify-center">
            <p className="text-gray-700">Written by:</p>
            <p className="text-xl font-semibold">{blog.author.name}</p>
          </div>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-14 pt-10">
          {blogs.map((blog) => (
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
          ))}
        </div>
      </section>

      <Newsletter />
      <Footer />
    </div>
  );
}
