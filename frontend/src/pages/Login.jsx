import { useState } from "react";
import axios from "axios";
import { login } from "../store/slice/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import GoogleLogin from "../component/GoogleLogin";
import { userBaseUrl } from "../utils/endpoints";
import { ShieldCheck, Mail, Lock, LogIn, ArrowRight, Terminal } from "lucide-react";
import Card from "../component/ui/Card";
import Button from "../component/ui/Button";
import Input from "../component/ui/Input";
import logo from "../assets/logo.png";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${userBaseUrl}/login`, formData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      const user = response.data.data.user;
      dispatch(login(user));
      toast.success("Security protocol authorized");
      if (user.role === "instructor") {
        navigate("/dashboard/profile");
      } else {
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Authentication failure");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6 relative overflow-hidden">
       {/* Background Grid Pattern */}
       <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
            style={{ backgroundImage: `radial-gradient(#000000 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />
       
       <div className="w-full max-w-[420px] space-y-8 relative z-10">
          <div className="flex flex-col items-center gap-6">
              <Link to="/" className="flex items-center gap-3 group">
                <img src={logo} alt="Learnify" className="h-10 w-10" />
                <span className="text-xl font-black tracking-tight text-slate-900">Learnify</span>
              </Link>
              <div className="text-center space-y-1">
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Access Terminal</h1>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Enterprise Learning Protocol</p>
              </div>
          </div>

          <Card className="p-8 bg-white border-slate-200 shadow-xl shadow-slate-200/50 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Authorized Email"
                type="email"
                name="email"
                placeholder="protocol@node.com"
                value={formData.email}
                onChange={handleChange}
                required
                icon={<Mail size={16} />}
              />

              <div className="space-y-1">
                  <Input
                    label="Security Partition (Password)"
                    type="password"
                    name="password"
                    placeholder="••••••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    icon={<Lock size={16} />}
                  />
                  <div className="flex justify-end">
                      <Link to="/forgot-password" size="sm" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">
                        Forgot Access Key?
                      </Link>
                  </div>
              </div>

              <div className="pt-2">
                  <Button
                    type="submit"
                    className="w-full"
                    isLoading={loading}
                    size="lg"
                  >
                    <LogIn size={18} className="mr-2" /> Initialize Session
                  </Button>
              </div>
            </form>

            <div className="relative flex items-center justify-center py-2">
                <div className="absolute inset-x-0 h-[1px] bg-slate-100" />
                <span className="relative z-10 px-4 bg-white text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Third Party Auth</span>
            </div>

            <GoogleLogin />

            <div className="pt-4 text-center">
                <p className="text-xs font-medium text-slate-500">
                  Awaiting node activation?{" "}
                  <Link to="/register" className="text-blue-600 font-bold hover:underline inline-flex items-center gap-1">
                    Request Provision <ArrowRight size={12} />
                  </Link>
                </p>
            </div>
          </Card>

          <div className="flex items-center justify-center gap-4 py-4 opacity-50">
              <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                  <ShieldCheck size={12} /> SSL Secure Partition
              </div>
              <div className="h-3 w-[1px] bg-slate-200" />
              <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                  <Terminal size={12} /> v4.0.0 Stable
              </div>
          </div>
       </div>
    </div>
  );
};

export default Login;
