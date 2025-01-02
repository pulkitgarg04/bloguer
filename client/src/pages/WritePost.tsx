import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { toast } from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function WritePost() {
  const [content, setContent] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [category, setCategory] = useState<string>("Uncategorized");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handlePublish = async () => {
    if (!title || !content) {
      toast.error("Title or content cannot be empty!");
      return;
    }

    const formData = {
      title: title,
      content: content,
      category: category,
    };

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/post`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Article published successfully!");
        navigate("/");
      } else {
        toast.error("Failed to publish article.");
      }
    } catch (error) {
      console.error("Error publishing article:", error);
      toast.error("An error occurred while publishing the article.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-inter">
      <Navbar activeTab="Home" />

      <section className="p-10">
        <h1 className="text-3xl font-semibold mb-4">Write New Article</h1>

        <div className="flex justify-center items-center gap-2 my-5">
          <label htmlFor="title" className="text-2xl font-medium">
            Title:
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-gray-200 py-2 px-4 rounded-lg font-medium text-xl hover:outline-none focus:outline-none"
            maxLength={100}
            placeholder="Enter article title"
          />
          <select
            name="category"
            id="category"
            className="bg-gray-200 py-2 px-2 rounded-md"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Uncategorized" className="bg-white">
              Uncategorized
            </option>
            <option value="Technology" className="bg-white">
              Technology
            </option>
            <option value="Science" className="bg-white">
              Science
            </option>
            <option value="Blogging" className="bg-white">
              Blogging
            </option>
            <option value="Health" className="bg-white">
              Health
            </option>
            <option value="Fitness" className="bg-white">
              Fitness
            </option>
            <option value="Education" className="bg-white">
              Education
            </option>
            <option value="Internet" className="bg-white">
              Internet
            </option>
            <option value="Programming" className="bg-white">
              Programming
            </option>
            <option value="Self-Help" className="bg-white">
              Self-Help
            </option>
            <option value="Lifestyle" className="bg-white">
              Lifestyle
            </option>
          </select>
          <button
            className={`py-2 px-4 rounded-md ${
              loading
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
            onClick={handlePublish}
            disabled={loading}
          >
            {loading ? "Publishing..." : "Publish"}
          </button>
        </div>

        <ReactQuill
          value={content}
          onChange={setContent}
          className="h-96 mt-10 mb-20"
          placeholder="Write your article here..."
        />
      </section>

      <Footer />
    </div>
  );
}
