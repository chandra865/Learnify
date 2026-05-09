import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import GoogleLogin from "../component/GoogleLogin";
import { userBaseUrl, otpBaseUrl } from "../utils/endpoints";
import { ShieldCheck, Mail, Lock, UserPlus, ArrowRight, Terminal, Timer, CheckCircle2, ChevronLeft } from "lucide-react";
import Card from "../component/ui/Card";
import Button from "../component/ui/Button";
import Input from "../component/ui/Input";
import logo from "../assets/logo.png";

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
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${userBaseUrl}/register`, formData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      toast.success("Verification protocol initiated: Check email");
      setStep("otp");

      await axios.post(`${otpBaseUrl}/send`, { email: formData.email });
      setTimeLeft(120);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Provisioning failure");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const joinedOtp = otp.join("");
      const res = await axios.post(`${otpBaseUrl}/verify`, {
        email: formData.email,
        otp: joinedOtp,
      });

      toast.success("Node identity successfully verified");
      navigate("/login");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Verification failure");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (step === "otp" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [step, timeLeft]);

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
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
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6 relative overflow-hidden">
       {/* Background Grid Pattern */}
       <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
            style={{ backgroundImage: `radial-gradient(#000000 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />
       
       <div className="w-full max-w-[460px] space-y-8 relative z-10">
          <div className="flex flex-col items-center gap-6">
              <Link to="/" className="flex items-center gap-3 group">
                <img src={logo} alt="Learnify" className="h-10 w-10" />
                <span className="text-xl font-black tracking-tight text-slate-900">Learnify</span>
              </Link>
              <div className="text-center space-y-1">
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    {step === "register" ? "Identity Provisioning" : "Verification Protocol"}
                  </h1>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">
                    {step === "register" ? "Declare New Framework Node" : "Authorized Authentication required"}
                  </p>
              </div>
          </div>

          <Card className="p-8 bg-white border-slate-200 shadow-xl shadow-slate-200/50 space-y-8">
            {step === "register" ? (
              <form onSubmit={handleRegisterSubmit} className="space-y-5">
                <div className="space-y-4">
                    <Input
                        label="Full Identity"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Architect John Doe"
                        required
                    />
                    <Input
                        label="Primary Domain (Email)"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="protocol@node.com"
                        required
                        icon={<Mail size={16} />}
                    />
                    <Input
                        label="Security Layer (Password)"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••••••"
                        required
                        icon={<Lock size={16} />}
                    />
                </div>

                <div className="pt-2">
                    <Button
                        type="submit"
                        className="w-full"
                        isLoading={loading}
                        size="lg"
                    >
                        Initialize Provisioning <ArrowRight size={18} className="ml-2" />
                    </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-8">
                <div className="text-center space-y-2">
                    <p className="text-xs font-medium text-slate-500">
                      Enter the 6-digit synchronization code dispatched to 
                    </p>
                    <Badge variant="outline" className="bg-slate-50 border-slate-200 text-blue-700 font-bold px-4">
                        {formData.email}
                    </Badge>
                </div>

                <div className="flex justify-between gap-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      ref={(el) => (inputRefs.current[index] = el)}
                      className="w-12 h-14 text-center text-slate-900 text-xl font-bold border-2 border-slate-100 rounded-xl focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-50/50 transition-all bg-slate-50/50"
                    />
                  ))}
                </div>

                <div className="flex items-center justify-center gap-2 py-2">
                  <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest transition-colors ${
                      timeLeft > 0 ? "bg-amber-50 border-amber-100 text-amber-700" : "bg-rose-50 border-rose-100 text-rose-700"
                  }`}>
                    <Timer size={14} />
                    Protocol Window: {Math.floor(timeLeft / 60).toString().padStart(2, "0")}:{(timeLeft % 60).toString().padStart(2, "0")}
                  </div>
                </div>

                <div className="space-y-3">
                    <Button
                        type="submit"
                        disabled={otp.some((d) => d === "") || timeLeft === 0}
                        className="w-full"
                        isLoading={loading}
                        size="lg"
                    >
                        Verify Identity Node
                    </Button>
                    <Button
                        variant="ghost"
                        className="w-full"
                        onClick={() => setStep("register")}
                    >
                        <ChevronLeft size={16} className="mr-2" /> Modify Metadata
                    </Button>
                </div>
              </form>
            )}

            {step === "register" && (
              <div className="space-y-6">
                <div className="relative flex items-center justify-center py-2">
                    <div className="absolute inset-x-0 h-[1px] bg-slate-100" />
                    <span className="relative z-10 px-4 bg-white text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Alternative Provisioning</span>
                </div>

                <GoogleLogin />

                <div className="text-center">
                    <p className="text-xs font-medium text-slate-500">
                      Already have an authorized node?{" "}
                      <Link to="/login" className="text-blue-600 font-bold hover:underline">
                        Access Terminal
                      </Link>
                    </p>
                </div>
              </div>
            )}
          </Card>

          <div className="flex items-center justify-center gap-4 py-4 opacity-50">
              <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                  <ShieldCheck size={12} /> Encrypted Node Provisioning
              </div>
              <div className="h-3 w-[1px] bg-slate-200" />
              <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                  <Terminal size={12} /> Protocol v4.0.0
              </div>
          </div>
       </div>
    </div>
  );
};

export default Register;
