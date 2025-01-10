import { Twitter, Github, Mail, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <div className="bg-black text-white">
            <div className="flex justify-around p-10 items-center">
                <div className="text-2xl font-bold">
                    BLOG<span className="text-red-500">UER</span>
                </div>
                <ul className="flex gap-8">
                    <Link to="/">
                        <li>Home</li>
                    </Link>
                    <Link to="/blogs">
                        <li>Blogs</li>
                    </Link>
                    <Link to="/about">
                        <li>About Us</li>
                    </Link>
                    <Link to="/contact">
                        <li>Contact Us</li>
                    </Link>
                </ul>
                <div className="flex gap-5">
                    <a href="https://x.com/pulkitgarg04">
                        <Twitter
                            className="text-black bg-white rounded-full p-1"
                            size={25}
                        />
                    </a>
                    <a href="https://www.github.com/pulkitgarg04">
                        <Github
                            className="text-black bg-white rounded-full p-1"
                            size={25}
                        />
                    </a>
                    <a href="https://www.linkedin.com/in/pulkitgarg04">
                        <Linkedin
                            className="text-black bg-white rounded-full p-1"
                            size={25}
                        />
                    </a>
                    <a href="mailto:pulkitgargbnl@gmail.com">
                        <Mail
                            className="text-black bg-white rounded-full p-1"
                            size={25}
                        />
                    </a>
                </div>
            </div>

            <div className="flex justify-between items-center pb-5 px-20 text-gray-300">
                <p>
                    Copyright &copy; {new Date().getFullYear()} Pulkit Garg. All
                    rights reserved.
                </p>
                <ul className="flex gap-5">
                    <li>Privacy Policy</li>
                    <li>Terms and Conditions</li>
                </ul>
            </div>
        </div>
    );
}
