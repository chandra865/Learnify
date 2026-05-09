import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, Menu, X, LogOut, User as UserIcon, ShieldCheck, ChevronDown, Bell, ShoppingCart } from "lucide-react";
import CategoryMenu from "../component/CategoryMenu";
import { toast } from "react-toastify";
import { login } from "../store/slice/userSlice";
import axios from "axios";
import siteLogo from "../assets/logo.png";
import { userBaseUrl } from "../utils/endpoints";
import Button from "../component/ui/Button";
import Input from "../component/ui/Input";

const Navbar = () => {
  const { status, userData } = useSelector((state) => state.user);
  const [searchQuery, setSearchQuery] = useState("");
  const [switching, setSwitching] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      const query = searchQuery;
      setSearchQuery("");
      navigate(`/search?query=${encodeURIComponent(query)}`);
    }
  };

  const handleRoleSwitch = async () => {
    const newRole = userData.role === "student" ? "instructor" : "student";
    try {
      setSwitching(true);
      const response = await axios.patch(
        `${userBaseUrl}/${userData._id}/role`,
        { newRole },
        { withCredentials: true }
      );
      dispatch(login(response.data.data));
      newRole === "instructor" ? navigate("/dashboard/profile") : navigate("/");
      toast.success(`Role synchronized: ${newRole.toUpperCase()}`);
    } catch (err) {
      toast.error("Role synchronization failed");
    } finally {
      setSwitching(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-8">
          
          {/* Logo & Category Section */}
          <div className="flex items-center gap-8">
            <Link to={userData?.role === "instructor" ? "/dashboard/profile" : "/"} className="flex items-center gap-2 group">
              <img src={siteLogo} alt="Learnify" className="h-8 w-8 transition-transform group-hover:scale-110" />
              <span className="text-xl font-black tracking-tighter text-slate-900">Learnify</span>
            </Link>
            
            <div className="hidden lg:block">
              <CategoryMenu />
            </div>
          </div>

          {/* Search Engine Node */}
          <div className="hidden md:flex flex-1 max-w-xl relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search for domains, frameworks, or expertise..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="w-full bg-slate-100 border border-transparent rounded-xl pl-10 pr-4 py-2 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all"
            />
          </div>

          {/* Action Matrix */}
          <div className="flex items-center gap-4">
            {!status ? (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>Login</Button>
                <Button variant="primary" size="sm" onClick={() => navigate("/register")}>Get Started</Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRoleSwitch}
                  isLoading={switching}
                  className="hidden sm:flex"
                >
                  {userData?.role === "student" ? "Instructor Node" : "Student View"}
                </Button>

                <div className="h-8 w-[1px] bg-slate-200 mx-1 hidden sm:block" />

                <Link to="/cart" className="p-2 text-slate-500 hover:text-blue-600 relative transition-colors">
                  <ShoppingCart size={20} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full border-2 border-white" />
                </Link>

                <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
                  <Link 
                    to="/dashboard/profile" 
                    className="flex items-center gap-2 p-1 rounded-full border border-transparent hover:border-slate-200 transition-all"
                  >
                    <img
                      src={userData.profilePicture?.url || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                      alt="Identity"
                      className="w-8 h-8 rounded-full object-cover grayscale-[0.5] hover:grayscale-0 shadow-sm"
                    />
                    <ChevronDown size={14} className="text-slate-400" />
                  </Link>
                </div>
              </div>
            )}

            {/* Mobile Interface Trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Expedition Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 animate-in slide-in-from-top duration-300">
          <div className="p-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className="w-full bg-slate-100 rounded-xl pl-10 pr-4 py-3 text-sm font-medium focus:outline-none"
              />
            </div>
            
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-3 pb-2">Navigation Node</p>
              <Link to="/courses" className="block px-3 py-2 text-slate-700 font-bold hover:bg-slate-50 rounded-lg">Frameworks</Link>
              <Link to="/dashboard/profile" className="block px-3 py-2 text-slate-700 font-bold hover:bg-slate-50 rounded-lg">Identity Center</Link>
            </div>

            <div className="pt-4 border-t border-slate-100">
              {status ? (
                <Button variant="danger" size="md" className="w-full" onClick={() => navigate("/logout")}>
                  Terminate Session
                </Button>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" onClick={() => navigate("/login")}>Login</Button>
                  <Button variant="primary" onClick={() => navigate("/register")}>Join</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;