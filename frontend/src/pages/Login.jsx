import { useState } from "react";
import axios from "axios";
import { login } from "../store/slice/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import GoogleLogin from "../component/GoogleLogin";
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL; 
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    role: "", // Default role
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Send formData to backend using fetch/axios

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/user/login`,
        formData,
        {
          headers: { "Content-Type": "application/json" }, // Use JSON for regular form data
          withCredentials: true, // Include credentials if needed
        }
      );
      //console.log(response.data); // Log only response data
      const user = response.data.data.user;
      dispatch(login(user));

      if (user.role === "instructor") {
        navigate("/dashboard/profile"); // Redirect to instructor dashboard
      } else {
        navigate("/"); // Redirect to homepage
      }
      toast.success(response.data.message);
    } catch (error) {
      console.error(error.response?.data || "Request failed"); // Handle errors properly
      toast.error(error.response?.data.message || "Request failed");
    }
  };

  return (
    <div className="flex justify-center items-center w-full min-h-screen bg-gray-600 text-white">
      <div className="bg-gray-900 p-8 rounded shadow-lg w-96 mb-10">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <p className="text-right text-sm text-blue-400 hover:underline mt-1">
            <a href="/forgot-password">Forgot Password?</a>
          </p>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 cursor-pointer text-white py-2 rounded hover:bg-blue-600 transition duration-300"
          >
            Login
          </button>
        </form>

        <p className="text-center text-lg text-gray-300 my-2">or</p>
        <GoogleLogin />

        <p className="text-center text-gray-400 mt-4">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
