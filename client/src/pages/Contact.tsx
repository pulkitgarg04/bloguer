import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Mail, MapPin } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

interface FormData {
    name: string;
    email: string;
    phone: string;
    message: string;
}

export default function Contact() {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.phone || !formData.message) {
            toast.error('All fields are required');
            return;
        }

        setIsSubmitting(true);
        try {
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/contact/submit`,
                formData
            );
            setFormData({
                name: '',
                email: '',
                phone: '',
                message: '',
            });
            toast.success('Message sent successfully! We will get back to you soon.');
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to send message';
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen font-inter">
            <Navbar activeTab="Contact Us" />

            <section className="pt-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 grid-cols-1">
                        <div className="lg:mb-0 mb-10">
                            <div className="group w-full h-full">
                                <div className="relative h-full">
                                    <img
                                        src="/about/desk.webp"
                                        alt="Contact Us"
                                        className="w-full h-3/4 lg:rounded-l-2xl rounded-2xl bg-blend-multiply bg-red-700 object-cover"
                                    />
                                    <h1 className="font-manrope text-white text-4xl font-bold leading-10 absolute top-11 left-11">
                                        Contact us
                                    </h1>
                                    <div className="absolute bottom-24 w-full lg:p-11 p-5">
                                        <div className="bg-white rounded-lg border-2 p-6 block">
                                            <div className="flex mb-4">
                                                <Mail />
                                                <h5 className="text-black text-base font-normal leading-6 ml-5">
                                                    business.pulkitgarg@gmail.com
                                                </h5>
                                            </div>
                                            <div className="flex mt-4">
                                                <MapPin />
                                                <h5 className="text-black text-base font-normal leading-6 ml-5">
                                                    Barnala, Punjab, India -
                                                    148101
                                                </h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-5 lg:p-11 lg:rounded-r-2xl rounded-2xl">
                            <h2 className="text-red-500 font-manrope text-4xl font-semibold leading-10 mb-11">
                                Send Us A Message
                            </h2>
                            <form onSubmit={handleSubmit}>
                                <input
                                    type="text"
                                    name="name"
                                    className="w-full h-12 text-gray-600 placeholder-gray-400  shadow-sm bg-transparent text-lg font-normal leading-7 rounded-full border border-gray-200 focus:outline-none pl-4 mb-10 disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                />
                                <input
                                    type="email"
                                    name="email"
                                    className="w-full h-12 text-gray-600 placeholder-gray-400 shadow-sm bg-transparent text-lg font-normal leading-7 rounded-full border border-gray-200 focus:outline-none pl-4 mb-10 disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                />
                                <input
                                    type="tel"
                                    name="phone"
                                    className="w-full h-12 text-gray-600 placeholder-gray-400 shadow-sm bg-transparent text-lg font-normal leading-7 rounded-full border border-gray-200 focus:outline-none pl-4 mb-10 disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="Phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                />
                                <textarea
                                    name="message"
                                    className="w-full h-32 text-gray-600 placeholder-gray-400 bg-transparent text-lg shadow-sm font-normal leading-7 rounded-2xl border border-gray-200 focus:outline-none p-4 mb-10 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="Message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                />
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full h-12 text-white text-base font-semibold leading-6 rounded-full transition-all duration-700 hover:bg-red-700 bg-red-500 shadow-sm disabled:bg-red-300 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Sending...' : 'Send'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
