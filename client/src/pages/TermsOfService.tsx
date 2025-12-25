import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

export default function TermsOfService() {
    return (
        <div className="min-h-screen font-inter">
            <SEO
                title="Terms of Service"
                description="Read the terms and conditions for using Bloguer blogging platform."
                url="/terms-of-service"
                keywords="terms of service, terms and conditions, user agreement, bloguer terms"
            />
            <Navbar activeTab="" />
            
            <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-16">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
                <p className="text-gray-600 mb-8">Last updated: December 25, 2025</p>

                <div className="prose prose-lg max-w-none">
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            By accessing and using Bloguer, you accept and agree to be bound by the terms and provision 
                            of this agreement. If you do not agree to these Terms of Service, please do not use our platform.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Bloguer is a blogging platform that allows users to create, publish, share, and discover 
                            content. We provide tools for writing, editing, and managing blog posts, as well as features 
                            for community interaction through comments, bookmarks, and follows.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            To use certain features of our platform, you must register for an account. You agree to:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                            <li>Provide accurate, current, and complete information during registration</li>
                            <li>Maintain the security of your password and account</li>
                            <li>Notify us immediately of any unauthorized use of your account</li>
                            <li>Be responsible for all activities that occur under your account</li>
                            <li>Choose a username that is not offensive or violates any trademark</li>
                            <li>Not create more than one account or create an account for anyone other than yourself</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. User Content</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            You retain all rights to the content you create and publish on Bloguer. By posting content, you grant us:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                            <li>A worldwide, non-exclusive, royalty-free license to use, reproduce, and distribute your content on our platform</li>
                            <li>The right to display your username and profile information alongside your content</li>
                            <li>The right to use your content for promotional purposes (with attribution)</li>
                        </ul>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            You are solely responsible for the content you post and represent that you have all necessary 
                            rights to post such content.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Prohibited Content and Conduct</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            You agree not to post content or engage in conduct that:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                            <li>Is illegal, harmful, threatening, abusive, harassing, defamatory, or invasive of another's privacy</li>
                            <li>Contains hate speech, discriminatory content, or promotes violence</li>
                            <li>Infringes any patent, trademark, trade secret, copyright, or other proprietary rights</li>
                            <li>Contains spam, advertising, or promotional content without authorization</li>
                            <li>Impersonates any person or entity or misrepresents your affiliation with a person or entity</li>
                            <li>Contains malware, viruses, or any code designed to harm or compromise our platform</li>
                            <li>Attempts to manipulate our platform's features or algorithms</li>
                            <li>Harasses, bullies, or stalks other users</li>
                            <li>Contains sexually explicit or pornographic material</li>
                            <li>Violates any applicable laws or regulations</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Content Moderation</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We reserve the right, but not the obligation, to:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                            <li>Monitor and review user content for compliance with these Terms</li>
                            <li>Remove or modify any content that violates these Terms</li>
                            <li>Suspend or terminate accounts that violate these Terms</li>
                            <li>Cooperate with law enforcement authorities regarding illegal content</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Intellectual Property</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            The Bloguer platform, including its design, features, functionality, and all content not 
                            created by users (such as text, graphics, logos, and software), is owned by Bloguer and 
                            protected by copyright, trademark, and other intellectual property laws. You may not copy, 
                            modify, distribute, or create derivative works of our platform without our express written permission.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Copyright Infringement</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We respect intellectual property rights and expect our users to do the same. If you believe 
                            that your work has been copied in a way that constitutes copyright infringement, please contact 
                            us with the following information:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                            <li>Identification of the copyrighted work claimed to have been infringed</li>
                            <li>Identification of the material that is claimed to be infringing</li>
                            <li>Your contact information</li>
                            <li>A statement that you have a good faith belief that use of the material is not authorized</li>
                            <li>A statement that the information in the notification is accurate</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Third-Party Services</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Our platform may integrate with third-party services (such as Google OAuth for authentication). 
                            Your use of these services is subject to their respective terms of service and privacy policies. 
                            We are not responsible for the practices of these third-party services.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Analytics and Data Collection</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We use analytics services to collect information about how users interact with our platform. 
                            This helps us improve our services. For more information about how we collect and use data, 
                            please refer to our <a href="/privacy-policy" className="text-red-500 hover:text-red-600">Privacy Policy</a>.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Disclaimer of Warranties</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Bloguer is provided "as is" and "as available" without any warranties of any kind, either 
                            express or implied. We do not warrant that:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                            <li>The service will be uninterrupted, timely, secure, or error-free</li>
                            <li>The results obtained from using the service will be accurate or reliable</li>
                            <li>Any errors in the platform will be corrected</li>
                            <li>The platform is free from viruses or other harmful components</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Limitation of Liability</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            To the maximum extent permitted by law, Bloguer and its affiliates shall not be liable for 
                            any indirect, incidental, special, consequential, or punitive damages, or any loss of profits 
                            or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or 
                            other intangible losses resulting from:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                            <li>Your use or inability to use the service</li>
                            <li>Any unauthorized access to or use of our servers and/or any personal information stored therein</li>
                            <li>Any interruption or cessation of transmission to or from the service</li>
                            <li>Any bugs, viruses, or the like that may be transmitted through the service by any third party</li>
                            <li>Any errors or omissions in any content or for any loss or damage incurred as a result of the use of any content posted, emailed, transmitted, or otherwise made available through the service</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Indemnification</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            You agree to indemnify, defend, and hold harmless Bloguer and its officers, directors, 
                            employees, and agents from and against any claims, liabilities, damages, losses, and expenses, 
                            including legal fees, arising out of or in any way connected with:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                            <li>Your access to or use of the service</li>
                            <li>Your violation of these Terms</li>
                            <li>Your violation of any third-party right, including any intellectual property or privacy right</li>
                            <li>Any content you post on the platform</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Termination</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We may terminate or suspend your account and access to the service immediately, without prior 
                            notice or liability, for any reason, including if you breach these Terms. Upon termination, 
                            your right to use the service will immediately cease. You may also delete your account at any 
                            time through your account settings.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">15. Governing Law</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            These Terms shall be governed and construed in accordance with the laws of the applicable 
                            jurisdiction, without regard to its conflict of law provisions. Any disputes arising from 
                            these Terms or the use of our service shall be resolved in the courts of the applicable jurisdiction.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">16. Changes to Terms</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We reserve the right to modify or replace these Terms at any time. If a revision is material, 
                            we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes 
                            a material change will be determined at our sole discretion. By continuing to access or use our 
                            service after revisions become effective, you agree to be bound by the revised terms.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">17. Severability</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            If any provision of these Terms is held to be unenforceable or invalid, such provision will be 
                            changed and interpreted to accomplish the objectives of such provision to the greatest extent 
                            possible under applicable law, and the remaining provisions will continue in full force and effect.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">18. Entire Agreement</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            These Terms, together with our Privacy Policy, constitute the entire agreement between you and 
                            Bloguer regarding the use of our service and supersede any prior agreements between you and 
                            Bloguer relating to your use of the service.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">19. Contact Information</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            If you have any questions about these Terms, please contact us:
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
