import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen font-inter">
            <SEO
                title="Privacy Policy"
                description="Learn about how Bloguer collects, uses, and protects your personal information."
                url="/privacy-policy"
                keywords="privacy policy, data protection, user privacy, bloguer privacy"
            />
            <Navbar activeTab="" />
            
            <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-16">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
                <p className="text-gray-600 mb-8">Last updated: December 25, 2025</p>

                <div className="prose prose-lg max-w-none">
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Welcome to Bloguer. We respect your privacy and are committed to protecting your personal data. 
                            This privacy policy will inform you about how we look after your personal data when you visit our 
                            website and tell you about your privacy rights and how the law protects you.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We may collect, use, store and transfer different kinds of personal data about you:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                            <li><strong>Identity Data:</strong> includes username, full name, and profile picture</li>
                            <li><strong>Contact Data:</strong> includes email address and location</li>
                            <li><strong>Technical Data:</strong> includes IP address, browser type, device information, and analytics data</li>
                            <li><strong>Profile Data:</strong> includes your bio, interests, preferences, and feedback</li>
                            <li><strong>Usage Data:</strong> includes information about how you use our website, products and services</li>
                            <li><strong>Content Data:</strong> includes blog posts, comments, bookmarks, and other user-generated content</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We use your personal data for the following purposes:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                            <li>To register you as a new user and manage your account</li>
                            <li>To enable you to create, publish, and manage blog posts</li>
                            <li>To provide and improve our services</li>
                            <li>To send you newsletters and updates (if you've subscribed)</li>
                            <li>To personalize your experience with content recommendations</li>
                            <li>To analyze usage patterns and improve our platform</li>
                            <li>To communicate with you about your account or our services</li>
                            <li>To ensure the security and integrity of our platform</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Third-Party Authentication</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We offer Google OAuth authentication for your convenience. When you sign in with Google, 
                            we receive basic profile information (name, email, profile picture) from Google. We do not 
                            have access to your Google password. This data is processed in accordance with Google's privacy 
                            policy and our own privacy practices.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Cookies and Analytics</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We use cookies and similar tracking technologies to track activity on our website and hold 
                            certain information. Cookies are files with a small amount of data which may include an 
                            anonymous unique identifier. We use analytics services (such as Vercel Analytics) to help us 
                            understand how users interact with our platform.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data Security</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We have implemented appropriate security measures to prevent your personal data from being 
                            accidentally lost, used, or accessed in an unauthorized way. We use industry-standard encryption 
                            for data transmission and storage. However, no method of transmission over the Internet or 
                            electronic storage is 100% secure.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Data Retention</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We will only retain your personal data for as long as necessary to fulfill the purposes we 
                            collected it for, including for the purposes of satisfying any legal, accounting, or reporting 
                            requirements. When you delete your account, we will delete or anonymize your personal data, 
                            unless we are required to retain it for legal purposes.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Your Legal Rights</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Under certain circumstances, you have rights under data protection laws in relation to your personal data:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                            <li>Request access to your personal data</li>
                            <li>Request correction of your personal data</li>
                            <li>Request erasure of your personal data</li>
                            <li>Object to processing of your personal data</li>
                            <li>Request restriction of processing your personal data</li>
                            <li>Request transfer of your personal data</li>
                            <li>Right to withdraw consent</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Third-Party Links</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Our website may include links to third-party websites, plug-ins and applications. Clicking on 
                            those links or enabling those connections may allow third parties to collect or share data about 
                            you. We do not control these third-party websites and are not responsible for their privacy statements.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Children's Privacy</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Our service is not intended for children under the age of 13. We do not knowingly collect 
                            personally identifiable information from children under 13. If you are a parent or guardian 
                            and you are aware that your child has provided us with personal data, please contact us.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Changes to This Privacy Policy</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We may update our Privacy Policy from time to time. We will notify you of any changes by 
                            posting the new Privacy Policy on this page and updating the "Last updated" date at the top 
                            of this Privacy Policy. You are advised to review this Privacy Policy periodically for any changes.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Contact Us</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            If you have any questions about this Privacy Policy, please contact us:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                            <li>By email: <a href="mailto:pulkitgargbnl@gmail.com" className="text-red-500 hover:text-red-600">pulkitgargbnl@gmail.com</a></li>
                            <li>Through our <a href="/contact" className="text-red-500 hover:text-red-600">contact page</a></li>
                        </ul>
                    </section>
                </div>
            </div>

            <Footer />
        </div>
    );
}
