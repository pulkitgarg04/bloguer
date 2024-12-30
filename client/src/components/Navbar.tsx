import { useState } from "react";
import { Link } from "react-router-dom";
import { LogIn } from "lucide-react";

export default function Navbar({ activeTab }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <nav className="flex justify-between items-center py-5 px-10 border-b-2 bg-white">
      <div className="text-2xl font-bold text-gray-800">
        BLOG<span className="text-red-500">UER</span>
      </div>

      <ul className="flex gap-8">
        <Link to={"/"}>
          <li
            className={`text-lg font-medium cursor-pointer ${
              activeTab === "Home"
                ? "text-red-500 border-b-4 border-red-500"
                : "text-gray-700 hover:text-red-500"
            }`}
          >
            Home
          </li>
        </Link>
        <Link to={"/blogs"}>
          <li
            className={`text-lg font-medium cursor-pointer ${
              activeTab === "Blogs"
                ? "text-red-500 border-b-4 border-red-500"
                : "text-gray-700 hover:text-red-500"
            }`}
          >
            <a href="/blogs">Blogs</a>
          </li>
        </Link>
        <Link to={"/about"}>
          <li
            className={`text-lg font-medium cursor-pointer ${
              activeTab === "About Us"
                ? "text-red-500 border-b-4 border-red-500"
                : "text-gray-700 hover:text-red-500"
            }`}
          >
            <a href="/about">About Us</a>
          </li>
        </Link>
        <Link to={"/contact"}>
          <li
            className={`text-lg font-medium cursor-pointer ${
              activeTab === "Contact Us"
                ? "text-red-500 border-b-4 border-red-500"
                : "text-gray-700 hover:text-red-500"
            }`}
          >
            <a href="/contact">Contact Us</a>
          </li>
        </Link>
      </ul>

      <div className="flex items-center">
        {isLoggedIn ? (
          <div className="rounded-full h-10 w-10 bg-gray-300 flex items-center justify-center text-gray-700 font-bold">
            A
          </div>
        ) : (
          <Link to="login">
            <button className="flex items-center gap-3 px-4 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800">
              <LogIn size={18} />
              Login
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
}
