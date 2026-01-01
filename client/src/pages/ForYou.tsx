import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Newsletter from '../components/Newsletter';
import BlogCard from '../components/BlogCard';
import Skeleton from '../components/Skeleton';
import SEO from '../components/SEO';
import { useAuthStore } from '../store/authStore';
import { usePopularBlogs, useFollowingBlogs } from '../hooks/useBlogs';
import { toast } from 'react-hot-toast';

const ForYou: React.FC = () => {
    const { user, isAuthenticated } = useAuthStore();
    
    const { data: popularPosts = [], isLoading: popularLoading, error: popularError } = usePopularBlogs();
    const { data: followingBlogs = [], isLoading: followingLoading } = useFollowingBlogs(user?.id);
    
    const loading = popularLoading || followingLoading;

    useEffect(() => {
        if (popularError) {
            toast.error('Error fetching popular blogs');
        }
    }, [popularError]);

    if (loading) {
        return (
            <div className="min-h-screen font-inter bg-gray-50">
                <Navbar activeTab="Blogs" />
                <Skeleton />
                <Newsletter />
                <Footer />
            </div>
        );
    }

    return (
    <div className="min-h-screen font-inter bg-gray-50">
            <SEO
                title="For You - Personalized Blogs"
                description="Discover popular articles and personalized blog recommendations based on the authors you follow. Find trending stories and content curated just for you."
                url="/blogs"
                keywords="personalized blogs, popular articles, trending blogs, recommended articles"
            />
            <Navbar activeTab="Blogs" />

            <section className="flex flex-col items-center space-y-5 px-4 md:px-5">
                <div className="w-full">
                    <h3 className="text-xl md:text-2xl font-semibold text-gray-800 text-center my-6 md:my-10">
                        Most Popular Articles
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 px-2 md:px-10 pb-10">
                        {popularPosts.map((post) => (
                            <BlogCard
                                key={post.id}
                                id={post.id}
                                title={post.title}
                                category={post.category}
                                readTime={post.readTime || undefined}
                                featuredImage={post.featuredImage}
                                author={post.author}
                                date={post.Date}
                            />
                        ))}
                    </div>
                </div>

                {followingBlogs.length > 0 && isAuthenticated && (
                    <div className="w-full">
                        <h3 className="text-xl md:text-2xl font-semibold text-gray-800 text-center my-6 md:my-10">
                            Following
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 px-2 md:px-16 pb-10">
                            {followingBlogs.map((post) => (
                                <BlogCard
                                    key={post.id}
                                    id={post.id}
                                    title={post.title}
                                    category={post.category}
                                    readTime={post.readTime || undefined}
                                    featuredImage={post.featuredImage}
                                    author={post.author}
                                    date={post.Date}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </section>

            <Newsletter />
            <Footer />
        </div>
    );
};

export default ForYou;
