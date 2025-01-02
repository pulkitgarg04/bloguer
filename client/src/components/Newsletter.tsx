import { Mails } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    if(email === "") {
      toast.error("Please enter your email to subscribe to the newsletter!");
      return;
    }
    setEmail("");
    toast.success("You are subscribed to Bloguer's Newsletter");
  };

  return (
    <section className="flex justify-center items-center py-20">
      <div className="bg-red-200 rounded-xl p-5 w-full max-w-4xl flex justify-around items-center">
        <div>
          <h3 className="text-3xl font-bold text-red-600">Weekly Newsletter</h3>
          <p className="font-medium text-gray-700 mt-2">
            Get blog articles and offers via email
          </p>
          <div className="flex items-center mt-6">
            <div className="flex items-center bg-white px-3 py-1 rounded-lg w-72">
              <Mails className="text-red-600 mr-2" />
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-2 w-full rounded-r-lg focus:outline-none"
              />
            </div>
            <button
              className="ml-4 bg-red-500 text-white font-medium py-2 px-6 rounded-lg hover:bg-red-600 transition duration-200 h-full"
              onClick={handleSubscribe}
            >
              Subscribe
            </button>
          </div>
        </div>
        <div className="hidden md:block">
          <img
            src="/newsletter.webp"
            alt="Bloguer Newsletter"
            className="w-72 h-auto"
          />
        </div>
      </div>
    </section>
  );
}
