import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link, useParams } from 'react-router-dom';
import { MapPin, Calendar1, PenLine, Trash2, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { toast } from 'react-hot-toast';

function getInitials(name?: string) {
    if (!name) return '';
    const words = name.trim().split(' ');
    return (words[0]?.[0] || '') + (words[1]?.[0] || '');
}

type FormatDateFunction = (dateString: string) => string;

const formatDate: FormatDateFunction = (dateString) => {
    const date = new Date(dateString);

    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

export default function Profile() {
    const { username } = useParams();
    const { user } = useAuthStore();
    const [avatarUploading, setAvatarUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    interface Follower {
        id: string;
        name: string;
        username: string;
        avatar?: string;
    }

    interface User {
        id: string;
        name: string;
        username: string;
        email: string;
        avatar?: string;
        bio?: string;
        JoinedDate?: string;
        location?: string;
        followers: Follower[];
    }

    interface Blog {
        id: string;
        featuredImage?: string;
        title: string;
        category: string;
        readTime?: string;
        author: {
            avatar?: string;
            name: string;
            username: string;
        };
        Date: string;
    }

    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [userData, setUserData] = useState<User>({
        id: '',
        name: '',
        username: '',
        email: '',
        avatar: '',
        bio: '',
        JoinedDate: '',
        location: '',
        followers: [],
    });
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [followLoading, setFollowLoading] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        bio: '',
        location: '',
    });
    const [isSaving, setIsSaving] = useState(false);
    const userId = user?.id;

    const handleAvatarChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setAvatarUploading(true);
        const formData = new FormData();
        formData.append('avatar', file);
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/upload-avatar`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            if (response.data.avatar) {
                setUserData((prev) => ({
                    ...prev,
                    avatar: response.data.avatar,
                }));
                toast.success('Profile picture updated!');
            }
        } catch (err: unknown) {
            toast.error(
                'Failed to upload avatar: ' +
                    ((err as { response?: { data?: { message?: string } } })
                        ?.response?.data?.message || 'Unknown error')
            );
        } finally {
            setAvatarUploading(false);
        }
    };

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/profile/${username}`
                );

                setBlogs(response.data.posts);
                setUserData(response.data.user);
                setEditForm({
                    name: response.data.user.name || '',
                    bio: response.data.user.bio || '',
                    location: response.data.user.location || '',
                });

                const isUserFollowing = response.data.user.followers.some(
                    (follower: Follower) => follower.id === userId
                );

                setIsFollowing(isUserFollowing);

                const countResponse = await axios.get(
                    `${
                        import.meta.env.VITE_BACKEND_URL
                    }/api/v1/user/followersFollowingCount/${username}`
                );

                setFollowersCount(countResponse.data.followersCount);
                setFollowingCount(countResponse.data.followingCount);
            } catch (error) {
                console.error('Error fetching profile data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (username) {
            fetchUserProfile();
        }
    }, [username, userId]);

    if (loading) {
        return (
            <div className="min-h-screen font-inter">
                <Navbar activeTab="Home" />

                <div className="h-40 bg-gray-300 animate-pulse"></div>

                <div className="px-40 py-2 flex flex-col gap-3 pb-6">
                    <div className="h-28 w-28 rounded-full bg-gray-300 animate-pulse -mt-14 border-white"></div>

                    <div className="flex justify-between items-center">
                        <div className="py-4 flex flex-col gap-2 w-3/4">
                            <div className="h-6 bg-gray-300 animate-pulse w-1/2"></div>
                            <div className="h-4 bg-gray-300 animate-pulse w-3/4"></div>
                            <div className="flex gap-4">
                                <div className="h-4 bg-gray-300 animate-pulse w-1/3"></div>
                                <div className="h-4 bg-gray-300 animate-pulse w-1/3"></div>
                                <div className="h-4 bg-gray-300 animate-pulse w-1/3"></div>
                            </div>
                        </div>

                        <div className="flex flex-col space-y-4">
                            <div className="h-8 bg-gray-300 animate-pulse rounded-lg w-24"></div>
                            <div className="flex justify-center items-center gap-4">
                                <div className="bg-gray-300 animate-pulse py-3 rounded-xl px-7 w-24"></div>
                                <div className="bg-gray-300 animate-pulse py-3 rounded-xl px-7 w-24"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <section className="my-10">
                    <h3 className="text-center text-2xl font-semibold mb-10 h-6 bg-gray-300 animate-pulse w-1/3 mx-auto"></h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-20 pb-10">
                        {Array(3)
                            .fill(0)
                            .map((_, index) => (
                                <div
                                    className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col h-full animate-pulse"
                                    key={index}
                                >
                                    <div className="h-48 bg-gray-300 animate-pulse"></div>
                                    <div className="p-4 flex flex-col flex-grow">
                                        <div className="h-4 bg-gray-300 animate-pulse w-1/2"></div>
                                        <div className="h-6 bg-gray-300 animate-pulse mt-2 w-3/4"></div>
                                        <div className="mt-4 flex items-center space-x-4 text-gray-500">
                                            <div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse"></div>
                                            <div>
                                                <div className="h-4 bg-gray-300 animate-pulse w-1/2"></div>
                                                <div className="h-4 bg-gray-300 animate-pulse w-1/3 mt-2"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </section>

                <Footer />
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="min-h-screen font-inter">
                <Navbar activeTab="Home" />
                <div className="text-center font-medium text-xl">
                    User not found.
                </div>
                ;
            </div>
        );
    }

    const handleFollowToggle = async () => {
        if (!username) return;
        const action = isFollowing ? 'unfollow' : 'follow';
        const token = localStorage.getItem('token');

        setFollowLoading(true);
        setIsFollowing((prev) => !prev);
        setFollowersCount((prev) =>
            isFollowing ? Math.max(0, prev - 1) : prev + 1
        );

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/followOrUnfollow`,
                {
                    userId,
                    usernameToFollow: username,
                    action,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status !== 200) {
                setIsFollowing((prev) => !prev);
                setFollowersCount((prev) =>
                    isFollowing ? prev + 1 : Math.max(0, prev - 1)
                );
                toast.error('Failed to update follow status');
            } else {
                try {
                    const countResponse = await axios.get(
                        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/followersFollowingCount/${username}`
                    );
                    setFollowersCount(countResponse.data.followersCount);
                    setFollowingCount(countResponse.data.followingCount);
                } catch {
                    console.error('Failed to refresh follower counts');
                }
            }
        } catch (error) {
            setIsFollowing((prev) => !prev);
            setFollowersCount((prev) =>
                isFollowing ? prev + 1 : Math.max(0, prev - 1)
            );
            console.error('Error toggling follow status:', error);
            toast.error('Failed to update follow status');
        } finally {
            setFollowLoading(false);
        }
    };

    const handleDeleteBlog = async (blogId: string) => {
        if (
            !window.confirm('Are you sure you want to delete this blog post?')
        ) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/post/${blogId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                toast.success('Blog deleted successfully!');
                setBlogs(blogs.filter((blog) => blog.id !== blogId));
            }
        } catch (error: unknown) {
            console.error('Error deleting blog:', error);
            const errorMessage =
                (error as { response?: { data?: { message?: string } } })
                    .response?.data?.message || 'Failed to delete blog';

            toast.error(errorMessage);
        }
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        const token = localStorage.getItem('token');

        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/update-profile`,
                editForm,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                setUserData((prev) => ({
                    ...prev,
                    name: response.data.name,
                    bio: response.data.bio,
                    location: response.data.location,
                }));
                setIsEditModalOpen(false);
                toast.success('Profile updated successfully!');
            }
        } catch (err: unknown) {
            toast.error(
                'Failed to update profile: ' +
                    ((err as { response?: { data?: { message?: string } } })
                        ?.response?.data?.message || 'Unknown error')
            );
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen font-inter">
            <Navbar activeTab="Home" />
            <div className="h-40 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
            <div className="px-40 py-2 flex flex-col gap-3 pb-6">
                <div className="h-28 shadow-md w-28 rounded-full border-4 overflow-hidden -mt-14 border-white flex items-center justify-center bg-gray-100 relative group">
                    {userData.avatar ? (
                        <img
                            src={userData.avatar}
                            className="w-full h-full rounded-full object-center object-cover"
                            alt={userData.name || 'User Avatar'}
                        />
                    ) : (
                        <span className="w-full h-full flex items-center justify-center text-4xl font-bold text-white bg-blue-500 rounded-full select-none">
                            {getInitials(userData.name)}
                        </span>
                    )}
                    {user && user.username === username && (
                        <>
                            <div
                                className={`absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer rounded-full ${avatarUploading ? 'pointer-events-none' : ''}`}
                                onClick={() =>
                                    !avatarUploading &&
                                    fileInputRef.current?.click()
                                }
                                title="Change profile picture"
                            >
                                <PenLine size={24} className="text-white" />
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleAvatarChange}
                                disabled={avatarUploading}
                            />
                        </>
                    )}
                    {avatarUploading && (
                        <div className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center rounded-full">
                            <svg
                                className="animate-spin h-8 w-8 text-blue-600"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                ></path>
                            </svg>
                        </div>
                    )}
                </div>
                <div className="flex justify-between items-center">
                    <div className="py-4 flex flex-col gap-2">
                        <p className="text-2xl font-semibold">
                            {userData.name}
                        </p>
                        <p>{userData.bio || 'Hi There, I am using Bloguer!'}</p>
                        <div className="flex gap-4">
                            <p>@{userData.username}</p>
                            <p className="flex gap-1 items-center">
                                <MapPin size={15} />
                                <span>
                                    {userData.location || 'Location not set'}
                                </span>
                            </p>
                            <p className="flex gap-1 items-center">
                                <Calendar1 size={15} />
                                <span>
                                    {userData.JoinedDate
                                        ? `Joined: ${formatDate(userData.JoinedDate)}`
                                        : 'Joined Date not available'}
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col space-y-4">
                        {user && username === user.username && (
                            <button
                                className="rounded-lg bg-red-500 hover:bg-red-600 text-white px-4 py-2 transition-colors duration-150"
                                onClick={() => setIsEditModalOpen(true)}
                            >
                                Edit Profile
                            </button>
                        )}
                        {user && username !== user.username && (
                            <button
                                className={`rounded-lg text-white p-2 transition-colors duration-150 ${isFollowing ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-800 hover:bg-gray-700'} ${followLoading ? 'opacity-75' : ''}`}
                                onClick={handleFollowToggle}
                                disabled={followLoading}
                            >
                                {isFollowing ? 'Unfollow' : 'Follow'}
                            </button>
                        )}
                        <div className="flex justify-center items-center gap-4">
                            <div className="bg-indigo-200 py-3 rounded-xl px-7">
                                <p className="text-xl text-indigo-800 font-medium">
                                    {followersCount}
                                </p>
                                <p className="text-sm">Followers</p>
                            </div>
                            <div className="bg-green-200 py-3 rounded-xl px-7">
                                <p className="text-xl text-green-800 font-medium">
                                    {followingCount}
                                </p>
                                <p className="text-sm">Following</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <section className="my-10">
                <h3 className="text-center text-2xl font-semibold mb-10">
                    {userData.name}'s Blogs
                </h3>

                {blogs && blogs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-20 pb-10">
                        {blogs.map((blog) => (
                            <div className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col h-full">
                                <img
                                    src={
                                        blog.featuredImage ||
                                        'https://default-placeholder.com/600x400.png'
                                    }
                                    alt={blog.title}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4 flex flex-col flex-grow">
                                    <div className="flex gap-2 items-center">
                                        {user && user.username === username && (
                                            <>
                                                <Link
                                                    to={`/edit/${user?.username}/${blog.id}`}
                                                >
                                                    <button className="flex gap-1 items-center bg-blue-200 px-2 py-1 rounded-xl text-xs text-blue-600 hover:bg-blue-300">
                                                        <PenLine size={15} />
                                                        Edit
                                                    </button>
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        handleDeleteBlog(
                                                            blog.id
                                                        )
                                                    }
                                                    className="flex gap-1 items-center bg-red-200 px-2 py-1 rounded-xl text-xs text-red-600 hover:bg-red-300"
                                                >
                                                    <Trash2 size={15} />
                                                    Delete
                                                </button>
                                            </>
                                        )}
                                        <p className="text-sm text-red-500 font-medium">
                                            {blog.category} •{' '}
                                            {blog.readTime || 'Read Time N/A'}
                                        </p>
                                    </div>
                                    <Link
                                        to={`/${userData.username}/${blog.id}`}
                                        key={blog.id}
                                    >
                                        <h3 className="text-lg font-semibold mt-2 flex-grow line-clamp-2">
                                            {blog.title}
                                        </h3>
                                    </Link>
                                    <div className="mt-4 flex items-center space-x-4 text-gray-500">
                                        {userData.avatar ? (
                                            <img
                                                src={userData.avatar}
                                                alt={userData.name}
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                        ) : (
                                            <span className="w-8 h-8 flex items-center justify-center text-lg font-bold text-white bg-blue-500 rounded-full select-none">
                                                {getInitials(userData.name)}
                                            </span>
                                        )}
                                        <div>
                                            <p className="font-medium text-sm">
                                                {userData.name} •{' '}
                                                {formatDate(blog.Date)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center font-medium text-xl py-10">
                        No blogs found.
                    </div>
                )}
            </section>

            {/* Edit Profile Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
                        <button
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                            onClick={() => setIsEditModalOpen(false)}
                        >
                            <X size={24} />
                        </button>
                        <h2 className="text-2xl font-semibold mb-6">
                            Edit Profile
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={(e) =>
                                        setEditForm({
                                            ...editForm,
                                            name: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                    placeholder="Enter your name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Bio
                                </label>
                                <textarea
                                    value={editForm.bio}
                                    onChange={(e) =>
                                        setEditForm({
                                            ...editForm,
                                            bio: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                                    placeholder="Tell us about yourself"
                                    rows={3}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    value={editForm.location}
                                    onChange={(e) =>
                                        setEditForm({
                                            ...editForm,
                                            location: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                    placeholder="Enter your location"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                                disabled={isSaving}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveProfile}
                                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isSaving}
                            >
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
