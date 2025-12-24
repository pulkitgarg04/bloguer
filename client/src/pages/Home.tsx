import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';
import BlogCard from '../components/BlogCard';
import Skeleton from '../components/Skeleton';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Blog() {
    interface Blog {
        id: string;
        featuredImage: string;
        title: string;
        category: string;
        readTime: string;
        author: {
            name: string;
            username: string;
            avatar: string;
        };
        Date: string;
        content?: string;
    }

    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                setLoading(true);
                const pageLimit = currentPage === 1 ? 10 : 9;
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/bulk`,
                    {
                        params: {
                            page: currentPage,
                            limit: pageLimit,
                            search: searchTerm,
                        },
                    }
                );

                console.log(response.data);
                setTotalPages(response.data.totalPages);
                setBlogs(response.data.blogs);
            } catch (err) {
                toast.error('Error fetching blogs');
                console.log('Error: ', err);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, [currentPage, searchTerm]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="min-h-screen font-inter bg-gray-50">
            <Navbar activeTab="Home" />

            <section className="flex flex-col items-center space-y-5 px-4">
                <h3 className="mt-10 text-3xl font-semibold text-gray-800">
                    Latest Blogs
                </h3>
                <p className="text-gray-600 text-center">
                    Explore insightful articles, trending topics, and deep dives
                    into the world of blogging.
                </p>
                <div className="flex items-center w-full max-w-lg bg-gray-200 px-4 py-2 rounded-lg shadow-sm">
                    <Search className="text-red-500" size={20} />
                    <input
                        type="text"
                        className="w-full p-2 bg-transparent outline-none text-gray-800 placeholder-gray-500"
                        placeholder="Search for blogs by topic or keywords ..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
            </section>

            {loading ? (
                <Skeleton />
            ) : (
                <section className="mt-16 px-4">
                    {searchTerm === '' &&
                        currentPage === 1 &&
                        blogs.length > 0 && (
                            <BlogCard
                                id={blogs[0].id}
                                title={blogs[0].title}
                                category={blogs[0].category}
                                readTime={blogs[0].readTime}
                                featuredImage={blogs[0].featuredImage}
                                author={blogs[0].author}
                                date={blogs[0].Date}
                                variant="featured"
                                showLatestBadge={true}
                            />
                        )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-10 pb-10">
                        {blogs
                            .slice(
                                searchTerm === '' && currentPage === 1 ? 1 : 0
                            )
                            .map((blog) => (
                                <BlogCard
                                    key={blog.id}
                                    id={blog.id}
                                    title={blog.title}
                                    category={blog.category}
                                    readTime={blog.readTime}
                                    featuredImage={blog.featuredImage}
                                    author={blog.author}
                                    date={blog.Date}
                                />
                            ))}
                    </div>
                </section>
            )}

            <ol className="flex justify-center items-center gap-2 text-xs font-medium">
                <li>
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-gray-100 bg-white text-gray-900 hover:bg-gray-100"
                    >
                        <ChevronLeft />
                    </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                        <li key={page}>
                            <button
                                onClick={() => handlePageChange(page)}
                                className={`block w-8 h-8 rounded-md border border-gray-100 text-center leading-8 ${
                                    page === currentPage
                                        ? 'bg-red-600 text-white'
                                        : 'bg-white text-gray-900 hover:bg-gray-100'
                                }`}
                            >
                                {page}
                            </button>
                        </li>
                    )
                )}
                <li>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-gray-100 bg-white text-gray-900 hover:bg-gray-100"
                    >
                        <ChevronRight />
                    </button>
                </li>
            </ol>

            <Newsletter />
            <Footer />
        </div>
    );
}
