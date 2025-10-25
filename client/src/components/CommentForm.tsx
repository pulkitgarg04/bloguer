import { useState } from 'react';
import { Link } from 'react-router-dom';

interface User {
    avatar: string;
    name: string;
}

interface CommentFormProps {
    user: User | null;
    onSubmit: (content: string) => Promise<void>;
}

export default function CommentForm({ user, onSubmit }: CommentFormProps) {
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!comment.trim() || comment.length > 500) return;

        setIsSubmitting(true);
        try {
            await onSubmit(comment);
            setComment('');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClear = () => {
        setComment('');
    };

    if (!user) {
        return (
            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                <p className="mb-4 text-gray-600">
                    Please{' '}
                    <Link to="/login" className="text-blue-600 font-medium">
                        login
                    </Link>{' '}
                    to post a comment.
                </p>
            </div>
        );
    }

    return (
        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
            <div className="flex gap-4">
                <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover"
                />

                <div className="flex-1">
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg bg-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
                        placeholder="Share your thoughts..."
                        rows={4}
                        disabled={isSubmitting}
                    />

                    <div className="flex items-center justify-between mt-2">
                        <p className="text-sm text-gray-500">
                            {comment.length}/500
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={handleClear}
                                disabled={isSubmitting}
                                className="text-sm px-3 py-1 rounded-md border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Clear
                            </button>

                            <button
                                onClick={handleSubmit}
                                disabled={
                                    !comment.trim() ||
                                    comment.length > 500 ||
                                    isSubmitting
                                }
                                className={`text-sm px-4 py-2 rounded-md text-white ${
                                    !comment.trim() ||
                                    comment.length > 500 ||
                                    isSubmitting
                                        ? 'bg-red-300 cursor-not-allowed'
                                        : 'bg-red-500 hover:bg-red-600 transition duration-200'
                                }`}
                            >
                                {isSubmitting ? 'Posting...' : 'Post Comment'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
