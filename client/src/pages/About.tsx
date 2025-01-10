import Navbar from '../components/Navbar';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';

export default function About() {
    return (
        <div className="min-h-screen font-inter">
            <Navbar activeTab="About Us" />
            <section className="py-24 relative">
                <div className="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto">
                    <div className="w-full justify-start items-center gap-12 grid lg:grid-cols-2 grid-cols-1">
                        <div className="w-full justify-center items-start gap-6 grid sm:grid-cols-2 grid-cols-1 lg:order-first order-last">
                            <div className="pt-24 lg:justify-center sm:justify-end justify-start items-start gap-2.5 flex">
                                <img
                                    className="rounded-xl object-cover"
                                    src="https://aftershoot.com/wp-content/uploads/2024/08/Cover-2-1.jpg"
                                    alt="About Us"
                                />
                            </div>
                            <img
                                className="sm:ml-0 ml-auto rounded-xl object-cover"
                                src="https://www.dominios.mx/wp-content/uploads/2022/04/blogging-estrategia.png"
                                alt="Our Mission"
                            />
                        </div>
                        <div className="w-full flex-col justify-center lg:items-start items-center gap-10 inline-flex">
                            <div className="w-full flex-col justify-center items-start gap-8 flex">
                                <div className="w-full flex-col justify-start lg:items-start items-center gap-3 flex">
                                    <h2 className="text-gray-900 text-4xl font-bold font-manrope leading-normal lg:text-start text-center">
                                        Empowering Voices Through Blogging
                                    </h2>
                                    <p className="text-gray-500 text-base font-normal leading-relaxed lg:text-start text-center">
                                        <b>Bloguer</b> is more than just a
                                        platform; it's a community where
                                        creativity meets purpose. Our journey is
                                        about enabling storytellers, thinkers,
                                        and dreamers to share their perspectives
                                        with the world, making blogging
                                        effortless and impactful for all.
                                    </p>
                                </div>
                                <div className="w-full lg:justify-start justify-center items-center sm:gap-10 gap-5 inline-flex">
                                    <div className="flex-col justify-start items-start inline-flex">
                                        <h3 className="text-gray-900 text-4xl font-bold font-manrope leading-normal">
                                            500+
                                        </h3>
                                        <h6 className="text-gray-500 text-base font-normal leading-relaxed">
                                            Blogs Published
                                        </h6>
                                    </div>
                                    <div className="flex-col justify-start items-start inline-flex">
                                        <h4 className="text-gray-900 text-4xl font-bold font-manrope leading-normal">
                                            100+
                                        </h4>
                                        <h6 className="text-gray-500 text-base font-normal leading-relaxed">
                                            Active Users
                                        </h6>
                                    </div>
                                    <div className="flex-col justify-start items-start inline-flex">
                                        <h4 className="text-gray-900 text-4xl font-bold font-manrope leading-normal">
                                            1K+
                                        </h4>
                                        <h6 className="text-gray-500 text-base font-normal leading-relaxed">
                                            Monthly Readers
                                        </h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Newsletter />
            <Footer />
        </div>
    );
}
