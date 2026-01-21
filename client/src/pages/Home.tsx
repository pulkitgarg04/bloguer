import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';
import BlogCard from '../components/BlogCard';
import Skeleton from '../components/Skeleton';
import SEO, { WebsiteSchema } from '../components/SEO';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useBlogs } from '../hooks/useBlogs';
import { motion } from 'framer-motion';

export default function Blog() {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    
    const pageLimit = currentPage === 1 ? 10 : 9;
    const { data, isLoading, error } = useBlogs(currentPage, pageLimit, searchTerm);

    const blogs = data?.blogs || [];
    const totalPages = data?.totalPages || 1;

    useEffect(() => {
        if (error) {
            toast.error('Error fetching blogs');
        }
    }, [error]);

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
            <SEO
                title="Home"
                description="Explore insightful articles, trending topics, and deep dives into the world of blogging. Discover the latest blogs on technology, lifestyle, travel, and more."
                url="/"
                keywords="blog, articles, latest blogs, technology, lifestyle, travel, tutorials"
            />
            <WebsiteSchema />
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

            {isLoading ? (
                <Skeleton />
            ) : (
                <section className="mt-8 md:mt-16 px-4">
                    {searchTerm === '' &&
                        currentPage === 1 &&
                        blogs.length > 0 && (
                            <BlogCard
                                id={blogs[0].id}
                                title={blogs[0].title}
                                category={blogs[0].category}
                                readTime={blogs[0].readTime ?? undefined}
                                featuredImage={blogs[0].featuredImage}
                                author={blogs[0].author}
                                date={blogs[0].Date}
                                variant="featured"
                                showLatestBadge={true}
                            />
                        )}

                    {blogs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                            <Search size={48} className="mb-4 text-gray-300" />
                            <p className="text-xl font-medium">
                                No articles found
                                {searchTerm && ` matching "${searchTerm}"`}
                            </p>
                            <p className="text-sm mt-2">
                                Try using different keywords or clear the search
                            </p>
                        </div>
                    ) : (
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: { opacity: 0 },
                                visible: {
                                    opacity: 1,
                                    transition: {
                                        staggerChildren: 0.1,
                                    },
                                },
                            }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 px-2 md:px-10 pb-10"
                        >
                            {blogs
                                .slice(
                                    searchTerm === '' && currentPage === 1
                                        ? 1
                                        : 0
                                )
                                .map((blog) => (
                                    <motion.div
                                        key={blog.id}
                                        variants={{
                                            hidden: { opacity: 0, y: 20 },
                                            visible: { opacity: 1, y: 0 },
                                        }}
                                    >
                                        <BlogCard
                                            id={blog.id}
                                            title={blog.title}
                                            category={blog.category}
                                            readTime={blog.readTime ?? undefined}
                                            featuredImage={blog.featuredImage}
                                            author={blog.author}
                                            date={blog.Date}
                                        />
                                    </motion.div>
                                ))}
                        </motion.div>
                    )}
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
