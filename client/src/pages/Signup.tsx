import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, Eye, EyeOff } from "lucide-react";
import { toast } from "react-hot-toast";

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<{
    name: string;
    username: string;
    email: string;
    password: string;
  }>({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (
        !formData.name ||
        !formData.username ||
        !formData.email ||
        !formData.password
      ) {
        toast.error("Please fill out all fields.");
        return;
      }

      if (!isChecked) {
        toast.error("You must agree to the terms and privacy policy.");
        return;
      }

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/signup`,
        formData
      );

      if (res.status === 201) {
        const { jwt } = res.data;
        localStorage.setItem("token", jwt);
        toast.success("Signup successful!");
        // signup(formData);

        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    } catch (error: unknown) {
      console.log("Error occurred: ", error);

      if (axios.isAxiosError(error)) {
        const errorResponse = error.response?.data;

        if (error.response?.status === 403) {
          const message =
            errorResponse?.message || "Forbidden: Invalid email or password.";
          toast.error(message);
          return;
        }

        if (Array.isArray(errorResponse) && errorResponse[0]?.message) {
          toast.error(errorResponse[0].message);
        } else {
          toast.error("Invalid Inputs");
        }
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex font-inter">
      <div className="flex flex-col justify-center items-center flex-1 px-4">
        <div className="text-4xl font-bold text-gray-800 flex mb-5">
          BLOG<span className="text-red-500">UER</span>
        </div>
        <div className="w-full max-w-sm space-y-6">
          <h1 className="text-2xl xl:text-3xl font-bold text-center mb-6">
            Signup
          </h1>

          <p className="text-center">
            Welcome to Bloguer Roger! You are just a few steps away to signup.
          </p>

          <div className="mx-auto max-w-xs space-y-4">
            <label
              htmlFor="name"
              className="relative block rounded-md border border-gray-200 shadow-sm"
            >
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-2 px-4 w-full text-lg"
                placeholder="Name"
              />
              <span className="pointer-events-none absolute left-2.5 top-0 -translate-y-1/2 bg-gray-100 px-1 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                Name
              </span>
            </label>

            <label
              htmlFor="username"
              className="relative block rounded-md border border-gray-200 shadow-sm"
            >
              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={handleChange}
                className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-2 px-4 w-full text-lg"
                placeholder="Username"
              />
              <span className="pointer-events-none absolute left-2.5 top-0 -translate-y-1/2 bg-gray-100 px-1 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                Username
              </span>
            </label>

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

            <div className="flex items-center justify-start space-x-2">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={isChecked}
                onChange={() => setIsChecked((prev) => !prev)}
              />
              <p className="text-sm text-gray-600">
                I agree to abide by Bloguer's Terms of Service and its Privacy
                Policy.
              </p>
            </div>

            <button
              type="submit"
              onClick={handleSubmit}
              className="bg-gray-800 text-white py-2 rounded-lg flex gap-2 justify-center items-center hover:bg-gray-700 w-full"
            >
              <LogIn size={20} />
              <p>Create Account</p>
            </button>

            <div className="text-sm text-center">
              Already have an account?{" "}
              <Link to="/login" className="hover:text-red-500 hover:underline">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-indigo-100 hidden lg:flex items-center justify-center">
        <img
          className="h-80"
          src="https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg"
          alt="Signup illustration"
        />
      </div>
    </div>
  );
}
