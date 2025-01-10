import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { toast } from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const SkeletonLoader = () => (
    <div className="animate-pulse space-y-4">
        <div className="bg-gray-300 h-10 rounded-md w-2/3"></div>
        <div className="bg-gray-300 h-6 rounded-md w-1/2"></div>
        <div className="bg-gray-300 h-3 rounded-md w-full"></div>
        <div className="bg-gray-300 h-3 rounded-md w-full"></div>
        <div className="bg-gray-300 h-10 rounded-md w-1/3"></div>
    </div>
);

export default function EditPost() {
    const { postId, username } = useParams();
    const [content, setContent] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [category, setCategory] = useState<string>('Uncategorized');
    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(false);

    const navigate = useNavigate();

    const handleUpdate = async () => {
        if (!title || !content) {
            toast.error('Title or content cannot be empty!');
            return;
        }

        const formData = {
            postId: postId,
            title: title,
            content: content,
            category: category,
        };

        try {
            setUpdating(true);
            const token = localStorage.getItem('token');

            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/post`,
                formData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                toast.success('Article updated successfully!');
                navigate(`/${username}/${postId}`);
            } else {
                toast.error('Failed to update article.');
            }
        } catch (error) {
            console.error('Error updating article:', error);
            toast.error('An error occurred while updating the article.');
        } finally {
            setUpdating(false);
        }
    };

    useEffect(() => {
        const fetchBlogData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/${postId}`
                );
                const data = await response.data;
                setTitle(data.post.title);
                setContent(data.post.content);
                setCategory(data.post.category);
            } catch (error) {
                toast.error(`Error fetching blog data: ${error}`);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogData();
    }, [postId]);

    if (loading) {
        return (
            <div className="min-h-screen font-inter">
                <Navbar activeTab="Home" />
                <section className="p-10">
                    <h1 className="text-3xl font-semibold mb-4">
                        Edit Your Article
                    </h1>
                    <SkeletonLoader />
                </section>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen font-inter">
            <Navbar activeTab="Home" />

            <section className="p-10">
                <h1 className="text-3xl font-semibold mb-4">
                    Edit Your Article
                </h1>

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
                            updating
                                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                : 'bg-gray-800 text-white hover:bg-gray-700'
                        }`}
                        onClick={handleUpdate}
                        disabled={updating}
                    >
                        {updating ? 'Updating...' : 'Update'}
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
