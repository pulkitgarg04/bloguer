import { useState } from "react";
import { Link } from "react-router-dom";
import { LogIn, Eye, EyeOff } from "lucide-react";
import { toast } from "react-hot-toast";
import { useUser } from "../context/UserContext";

export default function Login() {
  const { login } = useUser();

  const [formData, setFormData] = useState<{
    email: string;
    password: string;
  }>({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = () => {
    const { email, password } = formData;

    if (!email || !password) {
      toast.error("Please fill out all fields.");
      return;
    }

    const dummyUser = { name: 'John Doe', email };
    login(dummyUser);

    toast.success("Signup successful!");
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex font-inter">
      <div className="flex-1 bg-indigo-100 hidden lg:flex items-center justify-center">
          <img
            className="h-80"
            src="https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg"
            alt="Signup illustration"
          />
      </div>

      <div className="flex flex-col justify-center items-center flex-1 px-4">
        <div className="text-4xl font-bold text-gray-800 flex mb-5">
          BLOG<span className="text-red-500">UER</span>
        </div>
        <div className="w-full max-w-sm space-y-6">
          <h1 className="text-2xl xl:text-3xl font-bold text-center mb-6">
            Login
          </h1>

          <p className="text-center">Welcome Back to Bloguer Roger! You are just a few steps to login.</p>

          <div className="mx-auto max-w-xs space-y-5">
            <label
              htmlFor="email"
              className="relative block rounded-md border border-gray-200 shadow-sm"
            >
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-2 px-4 w-full text-lg"
                placeholder="Email"
              />
              <span className="pointer-events-none absolute left-2.5 top-0 -translate-y-1/2 bg-gray-100 px-1 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                Email
              </span>
            </label>

            <label
              htmlFor="password"
              className="relative rounded-md border border-gray-200 shadow-sm flex items-center"
            >
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-2 px-4 w-full text-lg"
                placeholder="Password"
              />
              <span className="pointer-events-none absolute left-2.5 top-0 -translate-y-1/2 bg-gray-100 px-1 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                Password
              </span>
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </label>

            <button
              type="submit"
              onClick={handleSubmit}
              className="bg-gray-800 text-white py-2 rounded-lg flex gap-2 justify-center items-center hover:bg-gray-700 w-full"
            >
              <LogIn size={20} />
              <p>Login</p>
            </button>

            <div className="text-sm text-center">
              Don't have an account?{" "}
              <Link to="/signup" className="hover:text-red-500 hover:underline">
                Signup
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}