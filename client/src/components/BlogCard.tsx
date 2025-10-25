import { Link } from 'react-router-dom';

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
        return (
            <Link to={linkTo}>
                <div className="w-full overflow-hidden mb-10 flex justify-center">
                    <img
                        src={featuredImage}
                        alt={title}
                        className="w-1/3 h-80 object-cover rounded-lg shadow-sm"
                    />
                    <div className="p-8 flex flex-col justify-center">
                        <div className="text-sm text-red-500 font-medium flex items-center">
                            <p>
                                {category} • {readTime || '15 Min'}
                            </p>
                            {showLatestBadge && (
                                <span className="mx-5 bg-red-200 px-2 py-1 rounded-xl text-xs text-red-600">
                                    Latest
                                </span>
                            )}
                        </div>
                        <h2 className="text-3xl font-semibold mt-2 max-w-96">
                            {title}
                        </h2>
                        <div className="mt-4 flex items-center space-x-4 text-gray-500">
                            <img
                                src={author.avatar}
                                alt={author.name}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                                <p className="font-medium">
                                    {author.name} • {formatDate(date)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        );
    }

    return (
        <Link to={linkTo}>
            <div className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col h-full">
                <img
                    src={featuredImage}
                    alt={title}
                    className="w-full h-48 object-cover"
                />
                <div className="p-4 flex flex-col flex-grow">
                    <div className="text-sm text-red-500 font-medium">
                        {category} • {readTime || 'Read Time N/A'}
                    </div>
                    <h3 className="text-lg font-semibold mt-2 flex-grow">
                        {title}
                    </h3>
                    <div className="mt-4 flex items-center space-x-4 text-gray-500">
                        <img
                            src={author.avatar}
                            alt={author.name}
                            className="w-8 h-8 rounded-full object-cover"
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
