import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  
  
  // const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", formData);
      toast.success(res.data.msg || "Login successful!");

      //token
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        navigate("/dashboard");
      }

      setFormData({ email: "", password: "" });
    } catch (error) {
      console.error("Error during login:", error);
      toast.error(error.response?.data?.msg || "Invalid credentials or server issue.");
    }
  };

  


  return (
    <div className="min-h-screen flex items-center justify-center bg-nile-blue-950">
      <div className="bg-nile-blue-300 p-6 rounded-lg shadow-md w-96 h-96">
        <h2 className="text-2xl font-semibold mb-15 text-center">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />

          <button
            type="submit"
            className="w-full bg-nile-blue-950 text-white py-2 rounded hover:bg-nile-blue-800"
          >
            Login
          </button>
        </form>

        {/* {message && (
          <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
        )} */}

        <p className="text-center mt-4 text-sm">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-blue-700 hover:underline cursor-pointer"
            >
              Sign up
            </span>
          </p>
      </div>
    </div>
  );
}
