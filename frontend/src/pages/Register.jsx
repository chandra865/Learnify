import { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import GoogleLogin from "../component/GoogleLogin";
const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "", // Default role
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/user/register",
        formData,
        {
          headers: { "Content-Type": "application/json" }, // Use JSON for regular form data
          withCredentials: true, // Include credentials if needed
        }
      );
      //console.log(response.data); // Log only response data
      toast.success(response?.data?.message || "Register Successfully");
      navigate("/");
    } catch (error) {
      console.error(error.response?.data || "Request failed"); // Handle errors properly
    }
  };
  
  return (
    <div className="flex justify-center items-center w-full min-h-screen bg-gray-600 text-white">
      <div className="bg-gray-900 p-6 mb-20 rounded shadow-lg w-90 text-white">
      <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          {/* <div>
            <label className="block font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
              required
            />
          </div> */}

          {/* Email Field */}
          <div>
            <label className="block  font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block  font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Role (Enum Selection) */}
          {/* <div>
            <label className="block text-gray-700 font-medium">Role</label>
            <select
              name="role"
              defaultValue=""
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled>
                Select a role
              </option>
              <option value="student">student</option>
              <option value="instructor">instructor</option>
            </select>
          </div> */}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-500 transition duration-300"
          >
            Register
          </button>
        </form>

        <p className="text-center text-lg text-gray-300 my-2">or</p>
        <GoogleLogin/>

        <p className="text-center text-gray-400 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
