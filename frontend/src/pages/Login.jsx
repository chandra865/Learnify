import { useState } from "react";
import axios from "axios";
import { login } from "../store/slice/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import GoogleLogin from "../component/GoogleLogin";
import { userBaseUrl } from "../utils/endpoints";
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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
        `${userBaseUrl}/login`,
        formData,
        {
          headers: { "Content-Type": "application/json" }, // Use JSON for regular form data
          withCredentials: true, // Include credentials if needed
        }
      );

      const user = response.data.data.user;
      dispatch(login(user));

      if (user.role === "instructor") {
        navigate("/dashboard/profile");
      } else {
        navigate("/");
      }
      toast.success(response.data.message);
    } catch (error) {
      console.error(error.response?.data || "Request failed");
      toast.error(error.response?.data.message || "Request failed");
    }
  };

  return (
    <div className="flex justify-center items-center w-full min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded shadow-lg w-full max-w-md">
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
            <Link to="/forgot-password">Forgot Password?</Link>
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
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
