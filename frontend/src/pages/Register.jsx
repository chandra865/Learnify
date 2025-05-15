import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import GoogleLogin from "../component/GoogleLogin";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [step, setStep] = useState("register");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(120);
  const inputRefs = useRef([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/v1/user/register`, formData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      toast.success("OTP sent to your email");
      setStep("otp");

      await axios.post(`${API_BASE_URL}/api/v1/otp/send-otp`, {
        email: formData.email,
      });
     
      setTimeLeft(120); // Reset timer
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const joinedOtp = otp.join("");
      const res = await axios.post(`${API_BASE_URL}/api/v1/otp/verify-otp`, {
        email: formData.email,
        otp: joinedOtp,
      });

      toast.success(res?.data?.message || "Email verified successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error?.response?.data?.message || "OTP verification failed");
    }
  };

  // Handle timer countdown
  useEffect(() => {
    if (step === "otp" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [step, timeLeft]);

  // Handle OTP input
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // only allow digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <div className="flex justify-center items-center w-full min-h-screen bg-gray-600 text-white">
      <div className="bg-gray-900 p-6 mb-20 rounded shadow-lg w-90 text-white">
        <h2 className="text-2xl font-bold text-center mb-6">
          {step === "register" ? "Register" : "Verify OTP"}
        </h2>

        {step === "register" ? (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
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

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300 cursor-pointer"
            >
              Register
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <p className="text-center text-gray-400 mb-2">
              Enter the 6-digit OTP sent to <strong>{formData.email}</strong>
            </p>

            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className="w-10 h-12 text-center text-white text-xl border rounded "
                />
              ))}
            </div>

            <div className="text-center text-sm text-gray-300 mt-2">
              Time remaining:{" "}
              <span className="font-semibold text-white">
                {Math.floor(timeLeft / 60)
                  .toString()
                  .padStart(2, "0")}
                :
                {(timeLeft % 60).toString().padStart(2, "0")}
              </span>
            </div>

            <button
              type="submit"
              disabled={otp.some((d) => d === "") || timeLeft === 0}
              className={`w-full text-white py-2 rounded transition duration-300 ${
                otp.some((d) => d === "") || timeLeft === 0
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 cursor-pointer"
              }`}
            >
              Verify OTP
            </button>
          </form>
        )}

        {step === "register" && (
          <>
            <p className="text-center text-lg text-gray-300 my-2">or</p>
            <GoogleLogin />
            <p className="text-center text-gray-400 mt-4">
              Already have an account?{" "}
              <a href="/login" className="text-blue-500 hover:underline">
                Login
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;
