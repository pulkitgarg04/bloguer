import { useState, useEffect, useRef, useMemo } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { toast } from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { ImagePlus } from 'lucide-react';

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
    const [refining, setRefining] = useState(false);
    const [featuredImage, setFeaturedImage] = useState<string>('');
    const [featuredImagePreview, setFeaturedImagePreview] = useState<string>('');
    const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);
    const [pendingImages, setPendingImages] = useState<Map<string, File>>(new Map());
    const quillRef = useRef<any>(null);

    const navigate = useNavigate();

    const handleImageUpload = async (file: File) => {
        const formData = new FormData();
        formData.append('image', file);
        const token = localStorage.getItem('token');

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/upload-image`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.data.url) {
                return response.data.url;
            }
        } catch (error) {
            toast.error('Failed to upload image');
            return null;
        }
    };

    const handleFeaturedImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFeaturedImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setFeaturedImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const imageHandler = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const localUrl = reader.result as string;
                    const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                    
                    setPendingImages(prev => new Map(prev).set(tempId, file));
                    
                    if (quillRef.current) {
                        const quill = quillRef.current.getEditor();
                        const range = quill.getSelection();
                        const index = range?.index || 0;
                        
                        quill.insertEmbed(index, 'image', localUrl);
                        quill.setSelection(index + 1);
                        
                        setTimeout(() => {
                            const imgElements = quill.root.querySelectorAll('img');
                            const lastImg = imgElements[imgElements.length - 1];
                            if (lastImg && lastImg.src === localUrl) {
                                lastImg.setAttribute('data-temp-id', tempId);
                                lastImg.style.maxWidth = '100%';
                                lastImg.style.height = 'auto';
                                lastImg.style.display = 'block';
                                lastImg.style.margin = '10px auto';
                            }
                        }, 10);
                    }
                };
                reader.readAsDataURL(file);
            }
        };
    };

    const modules = useMemo(
        () => ({
            toolbar: {
                container: [
                    [{ header: [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    ['blockquote', 'code-block'],
                    [{ color: [] }, { background: [] }],
                    ['link', 'image'],
                    ['clean'],
                ],
                handlers: {
                    image: imageHandler,
                },
            },
        }),
        []
    );

    const uploadAllPendingImages = async () => {
        if (pendingImages.size === 0) return content;
        
        let updatedContent = content;
        const uploadPromises: Promise<{tempId: string, url: string | null}>[] = [];
        
        for (const [tempId, file] of pendingImages.entries()) {
            uploadPromises.push(
                handleImageUpload(file).then(url => ({ tempId, url }))
            );
        }
        
        const results = await Promise.all(uploadPromises);
        
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = updatedContent;
        
        results.forEach(({ tempId, url }) => {
            if (url) {
                const img = tempDiv.querySelector(`img[data-temp-id="${tempId}"]`);
                if (img) {
                    img.setAttribute('src', url);
                    img.removeAttribute('data-temp-id');
                }
            }
        });
        
        updatedContent = tempDiv.innerHTML;
        setPendingImages(new Map());
        return updatedContent;
    };

    const convertBase64ImagesInContent = async (htmlContent: string) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        
        const images = tempDiv.querySelectorAll('img[src^="data:"]');
        
        if (images.length === 0) return htmlContent;
        
        const uploadPromises: Promise<{element: Element, url: string | null}>[] = [];
        
        images.forEach((img) => {
            const base64Data = img.getAttribute('src');
            if (base64Data?.startsWith('data:')) {
                // Convert base64 to file
                const arr = base64Data.split(',');
                const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
                const bstr = atob(arr[1]);
                const n = bstr.length;
                const u8arr = new Uint8Array(n);
                for (let i = 0; i < n; i++) {
                    u8arr[i] = bstr.charCodeAt(i);
                }
                const file = new File([u8arr], `image_${Date.now()}.png`, { type: mime });
                
                uploadPromises.push(
                    handleImageUpload(file).then(url => ({ element: img, url }))
                );
            }
        });
        
        const results = await Promise.all(uploadPromises);
        
        results.forEach(({ element, url }) => {
            if (url) {
                element.setAttribute('src', url);
            }
        });
        
        return tempDiv.innerHTML;
    };

    const handleRefineAI = async () => {
        if (!content) {
            toast.error('Please write some content first to refine.');
            return;
        }

        if (!title) {
            toast.error('Please enter a title first.');
            return;
        }

        try {
            setRefining(true);
            const token = localStorage.getItem('token');

            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/ai/refine-article`,
                { content, title },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (res?.data?.success && res.data.content) {
                setContent(res.data.content);
                toast.success('Article refined successfully!');
            } else {
                const msg = res?.data?.message || 'Failed to refine article.';
                toast.error(msg);
            }
        } catch (err: unknown) {
            console.error('AI refinement error:', err);
            const e = err as {
                response?: { data?: { message?: string } };
                code?: string;
            };
            if (e?.response?.data?.message) {
                toast.error(e.response.data.message);
            } else if (e?.code === 'ECONNABORTED') {
                toast.error('Refinement timed out. Try again.');
            } else {
                toast.error('Error refining article. Try again in a moment.');
            }
        } finally {
            setRefining(false);
        }
    };

    const handleUpdate = async () => {
        if (!title || !content) {
            toast.error('Title or content cannot be empty!');
            return;
        }

        try {
            setUpdating(true);
            const token = localStorage.getItem('token');

            let finalContent = content;
            if (pendingImages.size > 0) {
                toast.loading('Uploading images...');
                finalContent = await uploadAllPendingImages();
                toast.dismiss();
            }

            // Convert any remaining base64 images to Cloudinary URLs
            toast.loading('Processing images...');
            finalContent = await convertBase64ImagesInContent(finalContent);
            toast.dismiss();

            let uploadedFeaturedImage = featuredImage;
            if (featuredImageFile) {
                toast.loading('Uploading featured image...');
                const newImageUrl = await handleImageUpload(featuredImageFile);
                toast.dismiss();
                if (!newImageUrl) {
                    toast.error('Failed to upload featured image');
                    setUpdating(false);
                    return;
                }
                uploadedFeaturedImage = newImageUrl;
            }

            const formData = {
                postId: postId,
                title: title,
                content: finalContent,
                category: category,
                featuredImage: uploadedFeaturedImage || undefined,
            };

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
                setFeaturedImage(data.post.featuredImage || '');
                setFeaturedImagePreview(data.post.featuredImage || '');
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
            <div className="min-h-screen font-inter flex flex-col">
                <Navbar activeTab="Home" />
                <section className="p-4 md:p-10 flex-1">
                    <h1 className="text-2xl md:text-3xl font-semibold mb-4">
                        Edit Your Article
                    </h1>
                    <SkeletonLoader />
                </section>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen font-inter flex flex-col">
            <style>
                {`
                    .ql-editor img {
                        max-width: 100% !important;
                        height: auto !important;
                        display: block !important;
                        margin: 10px auto !important;
                    }
                `}
            </style>
            <Navbar activeTab="Home" />

            <section className="p-4 md:p-10 flex-1">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                    <h1 className="text-2xl md:text-3xl font-semibold">
                        Edit Your Article
                    </h1>
                    <div className="flex gap-3 w-full md:w-auto">
                        <button
                            onClick={handleRefineAI}
                            disabled={refining || !content}
                            className={`py-2 px-3 md:px-4 rounded-md flex-1 md:flex-none text-sm md:text-base ${
                                refining || !content
                                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                            }`}
                            title="Refine article with AI"
                        >
                            {refining ? 'Refining...' : 'Refine with AI'}
                        </button>
                        <button
                            className={`py-2 px-3 md:px-4 rounded-md flex-1 md:flex-none text-sm md:text-base ${
                                updating
                                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                    : 'bg-red-500 text-white hover:bg-red-600'
                            }`}
                            onClick={handleUpdate}
                            disabled={updating}
                        >
                            {updating ? 'Updating...' : 'Update'}
                        </button>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Featured Image (Optional)
                    </label>
                    <div className="flex items-center gap-4">
                        {featuredImagePreview ? (
                            <div className="relative">
                                <img
                                    src={featuredImagePreview}
                                    alt="Featured Preview"
                                    className="w-40 h-24 object-cover rounded-lg"
                                />
                                <button
                                    onClick={() => {
                                        setFeaturedImagePreview('');
                                        setFeaturedImageFile(null);
                                        setFeaturedImage('');
                                    }}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                                >
                                    ×
                                </button>
                            </div>
                        ) : (
                            <label className="cursor-pointer">
                                <div className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition">
                                    <ImagePlus size={20} />
                                    <span>Select Featured Image</span>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFeaturedImageSelect}
                                />
                            </label>
                        )}
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-center items-start md:items-center gap-3 md:gap-2 my-5">
                    <label htmlFor="title" className="text-xl md:text-2xl font-medium whitespace-nowrap">
                        Title:
                    </label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-gray-200 py-2 px-4 rounded-lg font-medium text-lg md:text-xl hover:outline-none focus:outline-none"
                        maxLength={100}
                        placeholder="Enter article title"
                    />
                    <select
                        name="category"
                        id="category"
                        className="bg-gray-200 py-2 px-2 rounded-md w-full md:w-auto"
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
                </div>

                <ReactQuill
                    ref={quillRef}
                    value={content}
                    onChange={setContent}
                    modules={modules}
                    className="h-64 md:h-96 mt-6 md:mt-10 mb-16 md:mb-20"
                    placeholder="Write your article here..."
                />
            </section>

            <Footer />
        </div>
    );
}
