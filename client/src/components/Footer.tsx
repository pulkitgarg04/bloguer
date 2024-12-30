import { Twitter, Github, Mail, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <div className="bg-black text-white">
      <div className="flex justify-around p-10 items-center">
        <div className="text-2xl font-bold">
          BLOG<span className="text-red-500">UER</span>
        </div>
        <ul className="flex gap-8">
          <li>Home</li>
          <li>Blogs</li>
          <li>About Us</li>
          <li>Contact Us</li>
        </ul>
        <div className="flex gap-5">
          <Twitter className="text-black bg-white rounded-full p-1" size={25} />
          <Github className="text-black bg-white rounded-full p-1" size={25} />
          <Linkedin className="text-black bg-white rounded-full p-1" size={25} />
          <Mail className="text-black bg-white rounded-full p-1" size={25} />
        </div>
      </div>

      <div className="flex justify-between items-center pb-5 px-20 text-gray-300">
        <p>Copyright &copy; {new Date().getFullYear()} Pulkit Garg. All rights reserved.</p>
        <ul className="flex gap-5">
            <li>Privacy Policy</li>
            <li>Terms and Conditions</li>
        </ul>
        </div>
    </div>
  );
}
