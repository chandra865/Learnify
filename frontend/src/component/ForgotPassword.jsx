import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(`${API_BASE_URL}/api/v1/password-reset-request/password-reset-token`, { email });
      setEmail("");
      setLoading(false);
      toast.success("Reset link sent to your email");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="mt-20 max-w-md mx-auto p-6 shadow rounded bg-gray-900 text-white">
      <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border px-3 py-2 mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button 
        disabled={loading}
        type="submit" className="w-full cursor-pointer bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">
          Send Reset Link
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
