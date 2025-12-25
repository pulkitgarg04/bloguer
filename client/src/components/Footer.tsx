import { Twitter, Github, Mail, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <div className="bg-black text-white">
            <div className="flex flex-col md:flex-row justify-around p-6 md:p-10 items-center gap-6 md:gap-0">
                <div className="text-2xl font-bold">
                    BLOG<span className="text-red-500">UER</span>
                </div>
                <ul className="flex flex-wrap justify-center gap-4 md:gap-8">
                    <Link to="/">
                        <li className="hover:text-red-500">Home</li>
                    </Link>
                    <Link to="/blogs">
                        <li className="hover:text-red-500">Blogs</li>
                    </Link>
                    <Link to="/about">
                        <li className="hover:text-red-500">About Us</li>
                    </Link>
                    <Link to="/contact">
                        <li className="hover:text-red-500">Contact Us</li>
                    </Link>
                </ul>
                <div className="flex gap-5">
                    <a href="https://x.com/pulkitgarg04">
                        <Twitter
                            className="text-black bg-white rounded-full p-1 hover:bg-red-500 hover:text-white transition-colors"
                            size={25}
                        />
                    </a>
                    <a href="https://www.github.com/pulkitgarg04">
                        <Github
                            className="text-black bg-white rounded-full p-1 hover:bg-red-500 hover:text-white transition-colors"
                            size={25}
                        />
                    </a>
                    <a href="https://www.linkedin.com/in/pulkitgarg04">
                        <Linkedin
                            className="text-black bg-white rounded-full p-1 hover:bg-red-500 hover:text-white transition-colors"
                            size={25}
                        />
                    </a>
                    <a href="mailto:pulkitgargbnl@gmail.com">
                        <Mail
                            className="text-black bg-white rounded-full p-1 hover:bg-red-500 hover:text-white transition-colors"
                            size={25}
                        />
                    </a>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center pb-5 px-6 md:px-20 text-gray-300 gap-3 text-center md:text-left">
                <p className="text-sm md:text-base">
                    Copyright &copy; {new Date().getFullYear()} Pulkit Garg. All
                    rights reserved.
                </p>
                <ul className="flex gap-5 text-sm md:text-base">
                    <li className="hover:text-white cursor-pointer">Privacy Policy</li>
                    <li className="hover:text-white cursor-pointer">Terms and Conditions</li>
                </ul>
            </div>
        </div>
    );
}
