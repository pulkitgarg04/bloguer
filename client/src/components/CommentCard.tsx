import { useState } from 'react';

interface CommentAuthor {
    id?: string;
    name: string;
    username?: string;
    avatar?: string;
}

interface CommentCardProps {
    id: string;
    content: string;
    author: CommentAuthor;
    createdAt: string;
    isOwner: boolean;
    isPostAuthor: boolean;
    onEdit: (id: string, content: string) => void;
    onDelete: (id: string) => void;
    isDeleting?: boolean;
}

export default function CommentCard({
    id,
    content,
    author,
    createdAt,
    isOwner,
    isPostAuthor,
    onEdit,
    onDelete,
    isDeleting = false,
}: CommentCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editingContent, setEditingContent] = useState(content);
    const [isSaving, setIsSaving] = useState(false);

    const startEdit = () => {
        setIsEditing(true);
        setEditingContent(content);
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setEditingContent(content);
    };

    const saveEdit = async () => {
        if (!editingContent.trim() || editingContent.length > 500) return;

        setIsSaving(true);
        try {
            await onEdit(id, editingContent);
            setIsEditing(false);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="bg-white border border-gray-100 shadow-sm p-4 rounded-lg">
            <div className="flex items-start gap-3">
                <img
                    src={author.avatar || `https://ui-avatars.com/api/?background=random&name=${encodeURIComponent(author.name)}&size=128`}
                    alt={author.name}
                    className="w-10 h-10 rounded-full object-cover"
                />

                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-800">
                                {author.name}{' '}
                                <span className="text-sm text-gray-500 ml-2">
                                    @{author.username}
                                </span>
                            </p>
                            <p className="text-xs text-gray-400">
                                {new Date(createdAt).toLocaleString()}
                            </p>
                        </div>
                        {(isOwner || isPostAuthor) && !isEditing && (
                            <div className="flex gap-2">
                                {isOwner && (
                                    <button
                                        onClick={startEdit}
                                        className="text-xs px-2 py-1 rounded border border-gray-200 hover:bg-gray-100"
                                    >
                                        Edit
                                    </button>
                                )}
                                <button
                                    onClick={() => onDelete(id)}
                                    disabled={isDeleting}
                                    className={`text-xs px-2 py-1 rounded border ${
                                        isDeleting
                                            ? 'border-red-200 text-red-300 cursor-not-allowed'
                                            : 'border-red-300 text-red-600 hover:bg-red-50'
                                    }`}
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>

                    {!isEditing ? (
                        <p className="mt-3 text-gray-700 whitespace-pre-line">
                            {content}
                        </p>
                    ) : (
                        <div className="mt-3">
                            <textarea
                                value={editingContent}
                                onChange={(e) =>
                                    setEditingContent(e.target.value)
                                }
                                rows={3}
                                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />
                            <div className="mt-2 flex items-center justify-between">
                                <span className="text-xs text-gray-500">
                                    {editingContent.length}/500
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={cancelEdit}
                                        className="text-xs px-3 py-1 rounded border border-gray-200 hover:bg-gray-100"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={saveEdit}
                                        disabled={
                                            !editingContent.trim() ||
                                            editingContent.length > 500 ||
                                            isSaving
                                        }
                                        className={`text-xs px-3 py-1 rounded text-white ${
                                            !editingContent.trim() ||
                                            editingContent.length > 500 ||
                                            isSaving
                                                ? 'bg-red-300 cursor-not-allowed'
                                                : 'bg-red-600 hover:bg-red-700'
                                        }`}
                                    >
                                        {isSaving ? 'Saving...' : 'Save'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
