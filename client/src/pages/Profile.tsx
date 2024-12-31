import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

interface User {
  avatar: string | undefined;
  email: string | null;
  name: string | null;
  username: string | null;
}

export default function Profile() {
  const [user, setUser] = useState<User>({
    avatar: undefined,
    email: null,
    name: null,
    username: null
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Unauthorized: Missing or invalid token.");
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/getUser`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(response.data);
      } catch (e: unknown) {
        toast.error(e instanceof Error ? e.message : "Server Error");
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="min-h-screen font-inter">
      <Navbar activeTab="Home" />
      <div>
        <h1>User Profile</h1>
        <img src={user.avatar} alt="User Avatar" width={100} height={100} />
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Username:</strong> {user.username}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
      </div>
    </div>
  );
}
