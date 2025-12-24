import { useState, useRef, useMemo } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { toast } from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ImagePlus } from 'lucide-react';

export default function WritePost() {
    const [content, setContent] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [category, setCategory] = useState<string>('Uncategorized');
    const [loading, setLoading] = useState(false);
    const [generateLoading, setGenerateLoading] = useState(false);
    const [refining, setRefining] = useState(false);
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

    const handlePublish = async () => {
        if (!title || !content) {
            toast.error('Title or content cannot be empty!');
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            let finalContent = content;
            if (pendingImages.size > 0) {
                toast.loading('Uploading images...');
                finalContent = await uploadAllPendingImages();
                toast.dismiss();
            }

            toast.loading('Processing images...');
            finalContent = await convertBase64ImagesInContent(finalContent);
            toast.dismiss();

            let uploadedFeaturedImage = undefined;
            if (featuredImageFile) {
                toast.loading('Uploading featured image...');
                uploadedFeaturedImage = await handleImageUpload(featuredImageFile);
                toast.dismiss();
                if (!uploadedFeaturedImage) {
                    toast.error('Failed to upload featured image');
                    setLoading(false);
                    return;
                }
            }

            const formData = {
                title,
                content: finalContent,
                category,
                featuredImage: uploadedFeaturedImage,
            };

            const response = await axios.post(
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
                toast.success('Article published successfully!');
                localStorage.removeItem('bloguer_draft');
                navigate('/');
            } else {
                toast.error('Failed to publish article.');
            }
        } catch (error) {
            console.error('Error publishing article:', error);
            toast.error('An error occurred while publishing the article.');
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateAI = async () => {
        if (!title) {
            toast.error(
                'Please enter a title first — AI needs a title to generate an article.'
            );
            return;
        }

        if (
            content &&
            !confirm(
                'Existing content will be replaced with AI-generated content. Continue?'
            )
        ) {
            return;
        }

        try {
            setGenerateLoading(true);
            const token = localStorage.getItem('token');

            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/ai/generate-article`,
                { title, category },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (res?.data?.success && res.data.content) {
                setContent(res.data.content);
                toast.success('AI-generated article inserted. Edit as needed.');
            } else {
                const msg = res?.data?.message || 'Failed to generate article.';
                toast.error(msg);
            }
        } catch (err: unknown) {
            console.error('AI generation error:', err);
            const e = err as {
                response?: { data?: { message?: string } };
                code?: string;
            };
            if (e?.response?.data?.message) {
                toast.error(e.response.data.message);
            } else if (e?.code === 'ECONNABORTED') {
                toast.error('Generation timed out. Try again.');
            } else {
                toast.error('Error generating article. Try again in a moment.');
            }
        } finally {
            setGenerateLoading(false);
        }
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

    const handleSaveDraft = async () => {
        if (!title || !content) {
            toast.error('Title and content are required to save a draft.');
            return;
        }
        
        try {
            let finalContent = content;
            if (pendingImages.size > 0) {
                toast.loading('Uploading images...');
                finalContent = await uploadAllPendingImages();
                toast.dismiss();
                setContent(finalContent);
            }

            const draft = {
                title,
                content: finalContent,
                category,
                featuredImagePreview,
                timestamp: new Date().toISOString(),
            };
            localStorage.setItem('bloguer_draft', JSON.stringify(draft));
            toast.success('Draft saved successfully!');
        } catch (error) {
            console.error('Error saving draft:', error);
            toast.error('Failed to save draft.');
        }
    };

    return (
        <div className="min-h-screen font-inter">
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

            <section className="p-10">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-semibold">
                        Write New Article
                    </h1>
                    <div className="flex gap-3">
                        <button
                            className={`py-2 px-6 rounded-md ${
                                loading
                                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                            }`}
                            onClick={handleSaveDraft}
                            disabled={loading}
                        >
                            Save Draft
                        </button>
                        <button
                            className={`py-2 px-6 rounded-md ${
                                loading
                                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                    : 'bg-red-500 text-white hover:bg-red-600'
                            }`}
                            onClick={handlePublish}
                            disabled={loading}
                        >
                            {loading ? 'Publishing...' : 'Publish'}
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
                                    }}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                                >
                                    ×
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <div>
                                    <p className="text-sm text-gray-600 mb-2">Default thumbnail for {category}:</p>
                                    <img
                                        src={`/thumbnails/${category}.webp`}
                                        alt={`${category} thumbnail`}
                                        className="w-40 h-24 object-cover rounded-lg border border-gray-300"
                                    />
                                </div>
                                <label className="cursor-pointer">
                                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition w-fit">
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
                            </div>
                        )}
                    </div>
                </div>

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
                        onClick={handleGenerateAI}
                        disabled={generateLoading}
                        className={`inline-flex items-center whitespace-nowrap py-2 px-4 rounded-md ${
                            generateLoading
                                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                : 'bg-gray-800 text-white hover:bg-gray-700'
                        }`}
                        title="Write with AI"
                    >
                        <span className="pointer-events-none">
                            {generateLoading
                                ? 'Generating...'
                                : 'Write with AI'}
                        </span>
                    </button>

                    <button
                        onClick={handleRefineAI}
                        disabled={refining || !content}
                        className={`inline-flex items-center whitespace-nowrap py-2 px-4 rounded-md ${
                            refining || !content
                                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                : 'bg-red-500 text-white hover:bg-red-600'
                        }`}
                        title="Refine article with AI"
                    >
                        <span className="pointer-events-none">
                            {refining ? 'Refining...' : 'Refine with AI'}
                        </span>
                    </button>
                </div>

                <ReactQuill
                    ref={quillRef}
                    value={content}
                    onChange={setContent}
                    modules={modules}
                    className="h-96 mt-10 mb-20"
                    placeholder="Write your article here..."
                />
            </section>

            <Footer />
        </div>
    );
}
