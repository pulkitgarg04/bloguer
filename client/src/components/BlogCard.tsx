import { Link } from 'react-router-dom';
import BlurImage from './BlurImage';

interface BlogAuthor {
    name: string;
    username: string;
    avatar?: string;
}

interface BlogCardProps {
    id: string;
    title: string;
    category: string;
    readTime?: string;
    featuredImage?: string;
    author: BlogAuthor;
    date: string;
    variant?: 'default' | 'featured';
    showLatestBadge?: boolean;
}

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

export default function BlogCard({
    id,
    title,
    category,
    readTime,
    featuredImage,
    author,
    date,
    variant = 'default',
    showLatestBadge = false,
}: BlogCardProps) {
    const linkTo = `/${author.username}/${id}`;

    if (variant === 'featured') {
        // Optimize Cloudinary images with transformations
        const optimizedFeaturedImage = featuredImage?.includes('cloudinary.com')
            ? featuredImage.replace('/upload/', '/upload/f_auto,q_auto,w_600/')
            : featuredImage;
        const optimizedAvatar = author.avatar?.includes('cloudinary.com')
            ? author.avatar.replace('/upload/', '/upload/f_auto,q_auto,w_128/')
            : author.avatar;

        return (
            <Link to={linkTo}>
                <div className="w-full overflow-hidden mb-6 md:mb-10 flex flex-col md:flex-row justify-center items-center">
                    <BlurImage
                        src={optimizedFeaturedImage}
                        alt={title}
                        wrapperClassName="w-full md:w-1/3 h-48 md:h-80 rounded-lg shadow-sm"
                        className="rounded-lg"
                        loading="lazy"
                    />
                    <div className="p-4 md:p-8 flex flex-col justify-center">
                        <div className="text-sm text-red-500 font-medium flex items-center flex-wrap">
                            <p>
                                {category} • {readTime || '15 Min'}
                            </p>
                            {showLatestBadge && (
                                <span className="ml-3 md:mx-5 bg-red-200 px-2 py-1 rounded-xl text-xs text-red-600">
                                    Latest
                                </span>
                            )}
                        </div>
                        <h2 className="text-xl md:text-3xl font-semibold mt-2 max-w-full md:max-w-96">
                            {title}
                        </h2>
                        <div className="mt-4 flex items-center space-x-4 text-gray-500">
                            <BlurImage
                                src={
                                    optimizedAvatar ||
                                    `https://ui-avatars.com/api/?background=random&name=${encodeURIComponent(author.name)}&size=128`
                                }
                                alt={author.name}
                                wrapperClassName="w-8 md:w-10 h-8 md:h-10"
                                className="rounded-full"
                                loading="lazy"
                            />
                            <div>
                                <p className="font-medium text-sm md:text-base">
                                    {author.name} • {formatDate(date)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        );
    }

    const optimizedFeaturedImage = featuredImage?.includes('cloudinary.com')
        ? featuredImage.replace('/upload/', '/upload/f_auto,q_auto,w_400/')
        : featuredImage;
    const optimizedAvatar = author.avatar?.includes('cloudinary.com')
        ? author.avatar.replace('/upload/', '/upload/f_auto,q_auto,w_64/')
        : author.avatar;

    return (
        <Link to={linkTo}>
            <div className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col h-full">
                <BlurImage
                    src={optimizedFeaturedImage}
                    alt={title}
                    wrapperClassName="w-full h-48"
                    loading="lazy"
                />
                <div className="p-4 flex flex-col flex-grow">
                    <div className="text-sm text-red-500 font-medium">
                        {category} • {readTime || 'Read Time N/A'}
                    </div>
                    <h3 className="text-lg font-semibold mt-2 flex-grow">
                        {title}
                    </h3>
                    <div className="mt-4 flex items-center space-x-4 text-gray-500">
                        <BlurImage
                            src={
                                optimizedAvatar ||
                                `https://ui-avatars.com/api/?background=random&name=${encodeURIComponent(author.name)}&size=128`
                            }
                            alt={author.name}
                            wrapperClassName="w-8 h-8"
                            className="rounded-full"
                            loading="lazy"
                        />
                        <div>
                            <p className="font-medium text-sm">
                                {author.name} • {formatDate(date)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
